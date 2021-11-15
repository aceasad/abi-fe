import {
  URL_PREFIX_PATH,
  AUTH_PREFIX_PATH,
  APP_PAGES_PREFIX_PATH,
} from './configs/AppConfig';

export const ROUTES = {
  LOGIN: `${AUTH_PREFIX_PATH}/login`,
  FORGOT_PASSWORD: `${AUTH_PREFIX_PATH}/forgot-password`,
  CONTACTS: `${APP_PAGES_PREFIX_PATH}/contacts`,
  DASHBOARD: `${URL_PREFIX_PATH}/`,
  CREATE_PASSWORD: `${AUTH_PREFIX_PATH}/create-password`,
  FIRST_CLINIC_UPDATE: `${APP_PAGES_PREFIX_PATH}/first-clinic-update`,
};
