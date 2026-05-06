import axios from 'axios';
import { API_BASE_URL } from 'configs/AppConfig';
import { INVALID_TOKEN_CODE } from 'redux/constants/Auth';

const LOG = '[HttpService]';

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
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const url = String(error.config?.url || '');

    if (url.includes('token/refresh')) {
      console.warn(
        `${LOG} refresh endpoint rejected token -> unauthorizedCallback (session teardown)`
      );
      this.unauthorizedCallback();
      return Promise.reject(error);
    }

    const tryRefreshAndRetry = () => {
      if (error.config?.__jwtRefreshAttempted) {
        console.warn(
          `${LOG} JWT refresh already attempted for this request -> unauthorizedCallback`
        );
        this.unauthorizedCallback();
        return Promise.reject(error);
      }
      const config = { ...error.config, __jwtRefreshAttempted: true };
      console.info(`${LOG} token_not_valid on ${status} -> refresh + retry`, {
        requestUrl: url || error.config?.url,
      });
      return this.refreshTokenCallback()
        .then((newToken) => {
          console.info(`${LOG} retrying original request with new access token`);
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${newToken}`;
          return axios.request(config);
        })
        .catch(() => {
          console.warn(`${LOG} refresh+retry failed -> unauthorizedCallback`);
          this.unauthorizedCallback();
          return Promise.reject(error);
        });
    };

    if (status === 401 && data?.code === INVALID_TOKEN_CODE) {
      return tryRefreshAndRetry();
    }

    switch (status) {
      case 401: {
        console.warn(`${LOG} 401 without handled JWT code -> unauthorizedCallback`, {
          url,
          code: data?.code,
        });
        this.unauthorizedCallback();
        break;
      }
      case 403: {
        if (data?.code === INVALID_TOKEN_CODE) {
          return tryRefreshAndRetry();
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
