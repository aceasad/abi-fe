import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from './configs/AppConfig'

export const ROUTES = {
    LOGIN: `${AUTH_PREFIX_PATH}/login`,
    FORGOT_PASSWORD: `${AUTH_PREFIX_PATH}/forgot-password`,
    CONTACTS: `${APP_PREFIX_PATH}/contacts`
}