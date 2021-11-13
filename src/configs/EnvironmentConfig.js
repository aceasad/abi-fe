const dev = {
  API_ENDPOINT_URL: process.env.REACT_APP_API_URL,
  SOCKETS_DOMAIN: process.env.REACT_APP_SOCKETS_DOMAIN,
  URL_PREFIX_PATH: process.env.REACT_APP_URL_PREFIX_PATH,
};

const prod = {
  API_ENDPOINT_URL: process.env.REACT_APP_API_URL,
  SOCKETS_DOMAIN: process.env.REACT_APP_SOCKETS_DOMAIN,
  URL_PREFIX_PATH: process.env.REACT_APP_URL_PREFIX_PATH,
};

const test = {
  API_ENDPOINT_URL: process.env.REACT_APP_API_URL,
  SOCKETS_DOMAIN: process.env.REACT_APP_SOCKETS_DOMAIN,
  URL_PREFIX_PATH: process.env.REACT_APP_URL_PREFIX_PATH,
};

const getEnv = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return dev;
    case 'production':
      return prod;
    case 'test':
      return test;
    default:
      break;
  }
};

export const env = getEnv();
