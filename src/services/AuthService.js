import { getLocalStorageItem, setLocalStorageItem } from "utils/localStorage";
import ApiService from "./ApiService";

const ENDPOINTS = {
  LOGIN: "/token/",
  FORGOT_PASSWORD: "/password_reset/",
  FETCH_USER: "/users/me/"
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
    }
  };

  setAuthorizationHeader = () => {
    const token = this.getToken();
    if (token) {
      this.api.attachHeaders({
        Authorization: `Bearer ${token}`
      });
    }
  };

  createSession = (token) => {
    setLocalStorageItem("token", token);
    this.setAuthorizationHeader();
  };

  destroySession = () => {
    localStorage.clear();
    this.api.removeHeaders(["Authorization"]);
  };

  login = async (loginData) => {
    const { data } = await this.apiClient.post(ENDPOINTS.LOGIN, loginData);
    this.createSession(data);
    return data;
  };

  getToken = () => {
    const token = getLocalStorageItem("token");
    return token ? token.access : undefined;
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

  resetPassword = async (password, token, email) => {
    const { data } = await this.apiClient.post(
      ENDPOINTS.FORGOT_PASSWORD,

      {
        password,
        token,
        email,
      },
      { params: { token: token } }
    );
    return data;
  };
}

const authService = new AuthService();
export default authService;
