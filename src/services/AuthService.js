import { getLocalStorageItem, setLocalStorageItem } from 'utils/localStorage';
import { isAccessTokenExpiredOrExpiringSoon, isAccessTokenIllFormed } from 'utils/jwtAccess';
import ApiService from './ApiService';
import store from 'redux/store';
import { setToken } from 'redux/actions/Auth';
import { teardownSession } from './sessionTeardown';

const LOG = '[AuthService]';

const ENDPOINTS = {
  LOGIN: '/token/',
  FORGOT_PASSWORD: '/password_reset/',
  FORGOT_PASSWORD_CONFIRM: '/password_reset/confirm/',
  FETCH_USER: '/users/me/',
  CREATE_PASSWORD: '/users/create_password/',
  REFRESH_TOKEN: '/token/refresh/',
  CHANGE_PASSWORD: '/users/me/change_password/',
};

class AuthService extends ApiService {
  constructor() {
    super();
    this._refreshInFlight = null;
    this._socketHandshakeForceRefresh = false;
    this.init();
  }

  init = () => {
    const token = this.getToken();

    if (token) {
      console.info(`${LOG} init: persisted session found, HTTP interceptors attached`);
      this.setAuthorizationHeader();

      this.api.setUnauthorizedCallback(this.destroySession.bind(this));
      this.api.setRefreshTokenCallback(this.refreshToken.bind(this));
    } else {
      console.info(`${LOG} init: no persisted token`);
    }
  };

  setAuthorizationHeader = () => {
    const token = this.getToken();
    if (token) {
      this.api.attachHeaders({
        Authorization: `Bearer ${token.access}`,
      });
    }
  };

  createSession = (token) => {
    console.debug(`${LOG} createSession`);
    setLocalStorageItem('token', token);
    this.setAuthorizationHeader();

    this.api.setUnauthorizedCallback(this.destroySession.bind(this));
    this.api.setRefreshTokenCallback(this.refreshToken.bind(this));
  };

  destroySession = () => {
    console.warn(
      `${LOG} destroySession (401 / refresh failure / invalid session) -> teardownSession`
    );
    teardownSession({ navigateToLogin: true });
  };

  login = async (loginData) => {
    const { data } = await this.apiClient.post(ENDPOINTS.LOGIN, loginData);
    console.info(`${LOG} login: success`);
    this.createSession(data);
    return data;
  };

  refreshToken = async () => {
    if (this._refreshInFlight) {
      console.info(`${LOG} refreshToken: reusing in-flight refresh request`);
      return this._refreshInFlight;
    }
    const p = (async () => {
      const token = this.getToken();
      if (!token?.refresh) {
        throw new Error('Missing refresh token');
      }
      console.info(`${LOG} refreshToken: POST ${ENDPOINTS.REFRESH_TOKEN}`);
      const { data } = await this.apiClient.post(ENDPOINTS.REFRESH_TOKEN, {
        refresh: token.refresh,
      });
      const refreshed = { access: data.access, refresh: token.refresh };
      this.createSession(refreshed);
      store.dispatch(setToken(refreshed));
      console.info(`${LOG} refreshToken: new access token stored`);
      return data.access;
    })();
    this._refreshInFlight = p;
    try {
      return await p;
    } finally {
      if (this._refreshInFlight === p) {
        this._refreshInFlight = null;
      }
    }
  };

  /** After the server drops the WebSocket before `onopen`, next `ensureFreshAccessTokenForSocket` will refresh. */
  markSocketHandshakeFailed = () => {
    this._socketHandshakeForceRefresh = true;
    console.info(
      `${LOG} markSocketHandshakeFailed: next socket connect will refresh access token`
    );
  };

  _consumeSocketHandshakeForceRefresh = () => {
    if (!this._socketHandshakeForceRefresh) return false;
    this._socketHandshakeForceRefresh = false;
    return true;
  };

  /**
   * Ensure access JWT is valid for WebSocket ?token=... (refresh if expired or near expiry).
   * Throws if credentials are missing or refresh fails.
   */
  ensureFreshAccessTokenForSocket = async () => {
    const token = this.getToken();
    if (!token?.access || !token?.refresh) {
      console.warn(`${LOG} ensureFreshAccessTokenForSocket: missing access or refresh`);
      throw new Error('Missing access or refresh token');
    }

    const forceHandshake = this._consumeSocketHandshakeForceRefresh();
    const illFormed = isAccessTokenIllFormed(token.access);
    const expiredSoon = isAccessTokenExpiredOrExpiringSoon(token.access);

    if (!forceHandshake && !illFormed && !expiredSoon) {
      console.info(
        `${LOG} ensureFreshAccessTokenForSocket: access still valid for WebSocket, no refresh`
      );
      return;
    }

    if (forceHandshake) {
      console.info(
        `${LOG} ensureFreshAccessTokenForSocket: refreshing (handshake failure — server likely rejected token)`
      );
    } else if (illFormed) {
      console.info(
        `${LOG} ensureFreshAccessTokenForSocket: refreshing (access token ill-formed or missing exp)`
      );
    } else {
      console.info(
        `${LOG} ensureFreshAccessTokenForSocket: refreshing (expired or near expiry)`
      );
    }
    await this.refreshToken();
  };

  getToken = () => {
    const token = getLocalStorageItem('token');
    return token ? token : undefined;
  };

  fetchUser = () => {
    return this.apiClient.get(ENDPOINTS.FETCH_USER);
  };

  sendForgotPasswordEmail = async (email) => {
    const { data } = await this.apiClient.post(
      ENDPOINTS.FORGOT_PASSWORD,
      email
    );

    return data;
  };

  resetPassword = (password, token) => {
    this.apiClient.post(
      ENDPOINTS.FORGOT_PASSWORD_CONFIRM,

      {
        password,
        token,
      },
      { params: { token } }
    );
  };

  createUserPassword = (password) =>
    this.apiClient.post(ENDPOINTS.CREATE_PASSWORD, password);

  changeUserPassword = (data) =>
    this.apiClient.put(ENDPOINTS.CHANGE_PASSWORD, data);
}

const authService = new AuthService();
export default authService;
