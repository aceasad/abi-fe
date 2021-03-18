import { getLocalStorageItem, setLocalStorageItem } from "utils/localStorage";
import ApiService from "./ApiService";

const ENDPOINTS = {
  LOGIN: "/login/",
  FORGOT_PASSWORD: "/password_reset/",
};

class AuthService extends ApiService {
  constructor() {
    super();
    this.init();
  }

  init = () => {
    const token = this.getToken();
    const user = this.getUser();

    if (token && user) {
      this.setAuthorizationHeader();

      this.api.setUnauthorizedCallback(this.destroySession.bind(this));
    }
  };

  setAuthorizationHeader = () => {
    const token = this.getToken();
    if (token) {
      this.api.attachHeaders({
        Authorization: `Bearer ${token}`,
      });
    }
  };

  createSession = (user) => {
    setLocalStorageItem("token", JSON.stringify(user));
    this.setAuthorizationHeader();
  };

  destroySession = () => {
    localStorage.clear();
    this.api.removeHeaders(["Authorization"]);
  };

  getUser = () => {
    const user = getLocalStorageItem("token");
    return JSON.parse(user);
  };

  login = async (loginData) => {
    const { data } = await this.apiClient.post(ENDPOINTS.LOGIN, loginData);
    this.createSession(data);
    return data;
  };

  getToken = () => {
    const user = getLocalStorageItem("token");
    return user ? JSON.parse(user).access : undefined;
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
