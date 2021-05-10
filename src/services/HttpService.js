import axios from 'axios';
import { API_BASE_URL } from 'configs/AppConfig';
import { INVALID_TOKEN_CODE } from 'redux/constants/Auth';

class HttpService {
  constructor(options = {}) {
    this.client = axios.create(options);

    this.client.interceptors.response.use(
      this.handleSuccessResponse.bind(this),
      this.handleErrorResponse.bind(this)
    );
    this.unauthorizedCallback = () => {};
    this.refreshTokenCallback = () => {};
  }

  attachHeaders(headers) {
    Object.assign(this.client.defaults.headers, headers);
  }

  removeHeaders(headerKeys) {
    headerKeys.forEach((key) => delete this.client.defaults.headers[key]);
  }

  handleSuccessResponse(response) {
    return response;
  }

  handleErrorResponse(error) {
    const { status, data } = error.response;

    switch (status) {
      case 401: {
        this.unauthorizedCallback();
        break;
      }
      case 403: {
        if (data.code === INVALID_TOKEN_CODE) {
          return this.refreshTokenCallback()
            .then((newToken) => {
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return axios.request(error.config);
            })
            .catch(() => this.unauthorizedCallback());
        }
        break;
      }
      default:
        break;
    }

    return Promise.reject(error);
  }

  setUnauthorizedCallback(callback) {
    this.unauthorizedCallback = callback;
  }

  setRefreshTokenCallback(callback) {
    this.refreshTokenCallback = callback;
  }
}

const options = {
  baseURL: API_BASE_URL,
};
const httpService = new HttpService(options);

export default httpService;
