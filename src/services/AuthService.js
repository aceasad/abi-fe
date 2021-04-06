import { getLocalStorageItem, setLocalStorageItem } from 'utils/localStorage';
import ApiService from './ApiService';
import store from 'redux/store';
import { setToken } from 'redux/actions/Auth';

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
    this.init();
  }

  init = () => {
    const token = this.getToken();

    if (token) {
      this.setAuthorizationHeader();

      this.api.setUnauthorizedCallback(this.destroySession.bind(this));
      this.api.setRefreshTokenCallback(this.refreshToken.bind(this));
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
    setLocalStorageItem('token', token);
    this.setAuthorizationHeader();
  };

  destroySession = () => {
    localStorage.clear();
    this.api.removeHeaders(['Authorization']);
  };

  login = async (loginData) => {
    const { data } = await this.apiClient.post(ENDPOINTS.LOGIN, loginData);
    this.createSession(data);
    return data;
  };

  refreshToken = async () => {
    const token = this.getToken();
    const { data } = await this.apiClient.post(ENDPOINTS.REFRESH_TOKEN, {
      refresh: token.refresh,
    });
    const refreshed = { access: data.access, refresh: token.refresh };
    this.createSession(refreshed);
    store.dispatch(setToken(refreshed));
    return data.access;
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
