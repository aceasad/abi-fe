import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from 'constants/ThemeConstant';
import { env } from './EnvironmentConfig';

export const URL_PREFIX_PATH = !env.URL_PREFIX_PATH
  ? ''
  : `/${env.URL_PREFIX_PATH}`;
export const APP_NAME = 'Asa';
export const API_BASE_URL = env.API_ENDPOINT_URL;
export const APP_PAGES_PREFIX_PATH = `${URL_PREFIX_PATH}/pages`;
export const AUTH_PREFIX_PATH = `${URL_PREFIX_PATH}/auth`;

export const SHOW_APPOINTMENTS_LIKELY_TO_BE_MISSED =
  env.SHOW_APPOINTMENTS_LIKELY_TO_BE_MISSED === 'true';
export const SHOW_PASSED_APPOINTMENTS_REQUIRING_IMMEDIATE_ATTENTION =
  env.SHOW_PASSED_APPOINTMENTS_REQUIRING_IMMEDIATE_ATTENTION === 'true';
export const SHOW_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION =
  env.SHOW_MESSAGES_REQUIRING_IMMEDIATE_ATTENTION === 'true';
export const SHOW_APPOINTMENTS_REMINDERS =
  env.SHOW_APPOINTMENTS_REMINDERS === 'true';
export const SHOW_PATIENT_PROGRESS = 
  env.SHOW_PATIENT_PROGRESS === 'true';
export const SHOW_KPIS = 
  env.SHOW_KPIS === 'true';

export const THEME_CONFIG = {
  navCollapsed: false,
  sideNavTheme: SIDE_NAV_LIGHT,
  locale: 'en',
  navType: NAV_TYPE_SIDE,
  topNavColor: '#3e82f7',
  headerNavColor: '#5d4ebf', // Original was ''
  mobileNav: false,
  currentTheme: 'light',
};
