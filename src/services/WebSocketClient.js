import { message } from 'antd';
import store from 'redux/store';
import { signOut } from 'redux/actions/Auth';

/** Server-side ASGI failure (e.g. Redis in Channels) often maps to 1011. */
const WS_CLOSE_INTERNAL_ERROR = 1011;

/** Abnormal closure (no close frame). */
const WS_CLOSE_ABNORMAL = 1006;

const MAX_RECONNECT_ATTEMPTS = 45;
const BASE_RECONNECT_MS = 500;
const MAX_RECONNECT_MS = 30000;

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
    /** True only when `connect` is invoked from the scheduled onclose reconnect. */
    this._scheduledReconnect = false;
  }

  fatalDisconnect = (userMessage) => {
    if (this._fatalSignOutDone) return;
    this._fatalSignOutDone = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socketRef) {
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
      this.socketRef = null;
    }

    message.warning(userMessage);
    store.dispatch(signOut());
  };

  reconnectDelayMs = () => {
    const exp = Math.min(this.reconnectAttempts, 6);
    return Math.min(MAX_RECONNECT_MS, BASE_RECONNECT_MS * 2 ** exp);
  };

  connect = (path, onopen = () => {}, onmessage = () => {}) => {
    // User-driven connect (route mount, token set): reset fatal + attempt budget.
    // Scheduled reconnect from onclose: keep attempt count so we can cap / sign out.
    if (!this._scheduledReconnect) {
      this._fatalSignOutDone = false;
      this.reconnectAttempts = 0;
    }
    this._scheduledReconnect = false;

    if (
      this.socketRef &&
      (this.socketRef.readyState === WebSocket.OPEN ||
        this.socketRef.readyState === WebSocket.CONNECTING)
    ) {
      this.closeConnection();
    }

    this.currentPath = path;
    this.socketRef = new WebSocket(path);

    this.socketRef.onopen = () => {
      this.reconnectAttempts = 0;
      onopen();
    };

    this.socketRef.onmessage = onmessage;

    this.socketRef.onerror = () => {};

    this.socketRef.onclose = (event) => {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      if (this._manualClose) {
        this._manualClose = false;
        return;
      }

      if (event.code === WS_CLOSE_INTERNAL_ERROR) {
        this.fatalDisconnect(
          'Live connection failed due to a server error. Please sign in again.'
        );
        return;
      }

      if (!this.isComponentMounted || this._fatalSignOutDone) {
        return;
      }

      this.reconnectAttempts += 1;
      if (this.reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
        const hint =
          event.code === WS_CLOSE_ABNORMAL
            ? 'Could not reach live updates (connection lost). Please sign in again.'
            : 'Live updates could not be restored. Please sign in again.';
        this.fatalDisconnect(hint);
        return;
      }

      const delay = this.reconnectDelayMs();
      this.reconnectTimer = setTimeout(() => {
        this._scheduledReconnect = true;
        this.connect(path, onopen, onmessage);
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

  closeConnection = () => {
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
  };

  sendMessage = (message) => this.socketRef.send(message);

  isConnected = () => this.state() === 1;
}

export default WebSocketClient.getInstance();
