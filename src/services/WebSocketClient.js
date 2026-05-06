import { decodeJwtPayload } from 'utils/jwtAccess';
import authService from './AuthService';
import { teardownSession, registerWebSocketCloser } from './sessionTeardown';

/** Server-side ASGI failure (e.g. Redis in Channels) often maps to 1011. */
const WS_CLOSE_INTERNAL_ERROR = 1011;
/** Server restart/redeploy. */
const WS_CLOSE_SERVICE_RESTART = 1012;
/** Temporary overload/retry hint from server. */
const WS_CLOSE_TRY_AGAIN_LATER = 1013;
/** Unauthorized (custom app close code from backend). */
const WS_CLOSE_UNAUTHORIZED = 4401;
/** Forbidden / missing org access (custom app close code from backend). */
const WS_CLOSE_FORBIDDEN = 4403;

/** Abnormal closure (no close frame). */
const WS_CLOSE_ABNORMAL = 1006;
/** Protocol error. */
const WS_CLOSE_PROTOCOL_ERROR = 1002;

/** If the socket never reaches `open`, these closes often mean bad auth — refresh once, then give up. */
const WS_UNOPENED_AUTH_RETRY_CODES = new Set([
  WS_CLOSE_PROTOCOL_ERROR,
  WS_CLOSE_ABNORMAL,
]);

const MAX_RECONNECT_ATTEMPTS = 45;
const BASE_RECONNECT_MS = 500;
const MAX_RECONNECT_MS = 30000;
const WS_LOG_PREFIX = '[WebSocketClient]';

/** Origin + path only (never log query — contains JWT). */
const wsUrlForLog = (fullUrl) => {
  try {
    const u = new URL(fullUrl);
    return `${u.protocol}//${u.host}${u.pathname}`;
  } catch {
    return '(invalid-url)';
  }
};

class WebSocketClient {
  static instance = null;

  static getInstance() {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  constructor() {
    this.socketRef = null;
    this.isComponentMounted = false;
    this.reconnectTimer = null;
    this.currentPath = null;
    this.reconnectAttempts = 0;
    this._fatalSignOutDone = false;
    this._manualClose = false;
    this._wsContext = {
      getUrl: async () => '',
      onopen: () => {},
      onmessage: () => {},
    };
    this._connectGen = 0;
    this._consecutiveSocketHandshakeFailures = 0;

    registerWebSocketCloser(() => this.closeConnection({ bumpGen: true }));
  }

  extractTokenFromPath = (path = '') => {
    try {
      const parsed = new URL(path);
      return parsed.searchParams.get('token') || '';
    } catch (_err) {
      return '';
    }
  };

  isSocketTokenExpired = (path = '') => {
    const token = this.extractTokenFromPath(path);
    const payload = decodeJwtPayload(token);
    const exp = Number(payload?.exp);
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  };

  fatalDisconnect = (userMessage) => {
    if (this._fatalSignOutDone) return;
    this._fatalSignOutDone = true;
    console.warn(`${WS_LOG_PREFIX} fatalDisconnect`, {
      reconnectAttempts: this.reconnectAttempts,
      endpoint: this.currentPath ? wsUrlForLog(this.currentPath) : null,
      userMessage,
    });
    teardownSession({
      warningMessage: userMessage,
      navigateToLogin: true,
    });
  };

  reconnectDelayMs = () => {
    const exp = Math.min(this.reconnectAttempts, 6);
    return Math.min(MAX_RECONNECT_MS, BASE_RECONNECT_MS * 2 ** exp);
  };

  /**
   * @param {Object} opts
   * @param {() => Promise<string>} opts.getUrl - Resolves full ws/wss URL (may refresh access token).
   * @param {() => void} [opts.onopen]
   * @param {(event: MessageEvent) => void} [opts.onmessage]
   */
  connect = ({ getUrl, onopen = () => {}, onmessage = () => {} }) => {
    this._connectGen += 1;
    const gen = this._connectGen;
    this._consecutiveSocketHandshakeFailures = 0;
    console.info(`${WS_LOG_PREFIX} connect requested`, { connectGen: gen });
    this._wsContext = { getUrl, onopen, onmessage };
    this._fatalSignOutDone = false;
    this.reconnectAttempts = 0;
    this._startConnectPipeline(gen);
  };

  _startConnectPipeline = (gen) => {
    console.info(`${WS_LOG_PREFIX} connect pipeline start`, { connectGen: gen });
    (async () => {
      let path;
      try {
        path = await this._wsContext.getUrl();
      } catch (err) {
        console.warn(`${WS_LOG_PREFIX} getUrl failed`, { connectGen: gen, err });
        if (!this.isComponentMounted || this._fatalSignOutDone) return;
        if (gen !== this._connectGen) return;
        this.fatalDisconnect(
          'Your session could not be restored. Please sign in again.'
        );
        return;
      }

      if (gen !== this._connectGen) {
        console.info(`${WS_LOG_PREFIX} connect pipeline aborted (stale generation)`, {
          connectGen: gen,
          currentGen: this._connectGen,
        });
        return;
      }
      if (!path) {
        console.info(`${WS_LOG_PREFIX} getUrl returned empty (cancelled unmount or skip)`, {
          connectGen: gen,
        });
        return;
      }
      if (this._fatalSignOutDone || !this.isComponentMounted) {
        console.info(`${WS_LOG_PREFIX} connect pipeline skip open`, {
          connectGen: gen,
          fatalSignOutDone: this._fatalSignOutDone,
          isComponentMounted: this.isComponentMounted,
        });
        return;
      }

      this._openSocket(path, gen);
    })();
  };

  _openSocket = (path, gen) => {
    const endpoint = wsUrlForLog(path);
    console.info(`${WS_LOG_PREFIX} opening socket`, {
      endpoint,
      connectGen: gen,
      scheduledReconnect: this.reconnectAttempts > 0,
      reconnectAttempts: this.reconnectAttempts,
    });

    if (
      this.socketRef &&
      (this.socketRef.readyState === WebSocket.OPEN ||
        this.socketRef.readyState === WebSocket.CONNECTING)
    ) {
      this.closeConnection({ bumpGen: false });
    }

    const { onopen, onmessage } = this._wsContext;
    this._socketReachedOpen = false;
    this.currentPath = path;
    this.socketRef = new WebSocket(path);
    console.info(`${WS_LOG_PREFIX} WebSocket constructed`, { endpoint, connectGen: gen });

    this.socketRef.onopen = () => {
      if (gen !== this._connectGen) return;
      this._socketReachedOpen = true;
      this._consecutiveSocketHandshakeFailures = 0;
      this.reconnectAttempts = 0;
      console.info(`${WS_LOG_PREFIX} onopen`, { endpoint, connectGen: gen });
      onopen();
    };

    this.socketRef.onmessage = onmessage;

    this.socketRef.onerror = (event) => {
      console.warn(`${WS_LOG_PREFIX} onerror (see following onclose code/reason)`, {
        endpoint,
        connectGen: gen,
        event,
      });
    };

    this.socketRef.onclose = (event) => {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      if (this._manualClose) {
        this._manualClose = false;
        console.debug(`${WS_LOG_PREFIX} onclose:manual`, {
          code: event.code,
          reason: event.reason,
        });
        return;
      }

      if (!this.isComponentMounted || this._fatalSignOutDone) {
        console.debug(`${WS_LOG_PREFIX} onclose:skip-reconnect`, {
          isComponentMounted: this.isComponentMounted,
          fatalSignOutDone: this._fatalSignOutDone,
          code: event.code,
          reason: event.reason,
        });
        return;
      }

      const reachedOpen = this._socketReachedOpen;
      if (reachedOpen) {
        this._consecutiveSocketHandshakeFailures = 0;
      }

      this.reconnectAttempts += 1;
      console.warn(`${WS_LOG_PREFIX} onclose:reconnect`, {
        endpoint: wsUrlForLog(path),
        code: event.code,
        reason: event.reason,
        reachedOpen,
        reconnectAttempts: this.reconnectAttempts,
      });

      if (event.code === WS_CLOSE_UNAUTHORIZED) {
        this.fatalDisconnect('Your session has expired. Please sign in again.');
        return;
      }
      if (event.code === WS_CLOSE_FORBIDDEN) {
        this.fatalDisconnect(
          'Your account no longer has access to live updates. Please sign in again.'
        );
        return;
      }
      if (
        event.code === WS_CLOSE_ABNORMAL &&
        this.isSocketTokenExpired(this.currentPath || path)
      ) {
        this.fatalDisconnect('Your session has expired. Please sign in again.');
        return;
      }

      if (!reachedOpen && WS_UNOPENED_AUTH_RETRY_CODES.has(event.code)) {
        this._consecutiveSocketHandshakeFailures += 1;
        console.warn(`${WS_LOG_PREFIX} onclose:handshake-never-opened`, {
          code: event.code,
          consecutiveHandshakeFailures: this._consecutiveSocketHandshakeFailures,
        });
        authService.markSocketHandshakeFailed();
        if (this._consecutiveSocketHandshakeFailures >= 2) {
          this.fatalDisconnect(
            'Live updates could not be authenticated. Please sign in again.'
          );
          return;
        }
      }

      if (this.reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
        const hint =
          event.code === WS_CLOSE_ABNORMAL
            ? 'Could not reach live updates (connection lost). Please sign in again.'
            : 'Live updates could not be restored. Please sign in again.';
        this.fatalDisconnect(hint);
        return;
      }

      let delay = this.reconnectDelayMs();
      if (
        event.code === WS_CLOSE_INTERNAL_ERROR ||
        event.code === WS_CLOSE_SERVICE_RESTART ||
        event.code === WS_CLOSE_TRY_AGAIN_LATER
      ) {
        delay = Math.max(delay, 5000);
      }
      console.info(`${WS_LOG_PREFIX} reconnect:scheduled (will run getUrl + fresh token if needed)`, {
        delayMs: delay,
        connectGen: this._connectGen,
        code: event.code,
        reason: event.reason,
      });
      this.reconnectTimer = setTimeout(() => {
        this._startConnectPipeline(this._connectGen);
      }, delay);
    };
  };

  state = () => this.socketRef && this.socketRef.readyState;

  waitForConnection = () => {
    const interval = setInterval(() => {
      if (this.state() === 1) {
        clearInterval(interval);
      }
    }, 500);
  };

  closeConnection = ({ bumpGen = true } = {}) => {
    const prevGen = this._connectGen;
    if (bumpGen) {
      this._connectGen += 1;
    }
    console.info(`${WS_LOG_PREFIX} closeConnection`, {
      bumpGen,
      prevConnectGen: prevGen,
      nextConnectGen: this._connectGen,
      hadSocket: Boolean(this.socketRef),
      readyState: this.socketRef?.readyState,
    });
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socketRef) {
      this._manualClose = true;
      this.socketRef.onopen = null;
      this.socketRef.onmessage = null;
      this.socketRef.onerror = null;
      this.socketRef.onclose = null;
      if (
        this.socketRef.readyState === WebSocket.OPEN ||
        this.socketRef.readyState === WebSocket.CONNECTING
      ) {
        this.socketRef.close();
      }
    }
    this.socketRef = null;
    console.info(`${WS_LOG_PREFIX} closeConnection:done`, {
      connectGen: this._connectGen,
    });
  };

  sendMessage = (message) => this.socketRef.send(message);

  isConnected = () => this.state() === 1;
}

const instance = WebSocketClient.getInstance();
export default instance;
