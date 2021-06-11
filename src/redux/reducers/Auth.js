import {
  AUTH_TOKEN,
  AUTHENTICATED,
  SHOW_AUTH_MESSAGE,
  HIDE_AUTH_MESSAGE,
  SIGNOUT_SUCCESS,
  SIGNUP_SUCCESS,
  SHOW_LOADING,
  SIGNIN_WITH_GOOGLE_AUTHENTICATED,
  SIGNIN_WITH_FACEBOOK_AUTHENTICATED,
  RESET_PASSWORD_ERROR,
  SET_USER,
  SET_PASSWORD_CHANGED,
  SET_TOKEN,
  SEND_FORGOT_PASSWORD_EMAIL_SUCCESS,
  SEND_FORGOT_PASSWORD_EMAIL_ERROR,
  RESET_PASSWORD_SUCCESS,
} from '../constants/Auth';
import { getLocalStorageItem } from 'utils/localStorage';
import produce from 'immer';
import { PASSWORD_STATUSES } from 'constants/UserConstants';

const initState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
  isSent: null,
  isReset: null,
  token: getLocalStorageItem(AUTH_TOKEN),
  user: null,
};

/* eslint-disable default-case */
const auth = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case AUTHENTICATED:
        draft.loading = false;
        draft.redirect = '/';
        draft.token = action.token;
        break;
      case SHOW_AUTH_MESSAGE:
        draft.message = action?.message;
        draft.showMessage = true;
        draft.loading = false;
        break;
      case HIDE_AUTH_MESSAGE:
        draft.message = '';
        draft.showMessage = false;
        break;
      case SIGNOUT_SUCCESS:
        draft.token = null;
        draft.redirect = '/';
        draft.loading = false;
        break;
      case SIGNUP_SUCCESS:
        draft.loading = false;
        draft.token = action.token;
        break;
      case SHOW_LOADING:
        draft.loading = action.payload;
        break;
      case SIGNIN_WITH_GOOGLE_AUTHENTICATED:
        draft.loading = false;
        draft.token = action.token;
        break;
      case SIGNIN_WITH_FACEBOOK_AUTHENTICATED:
        draft.loading = false;
        draft.token = action.token;
        break;
      case SET_USER:
        draft.user = { ...draft.user, ...action.payload };
        break;
      case RESET_PASSWORD_SUCCESS:
        draft.isReset = true;
        break;
      case RESET_PASSWORD_ERROR:
        draft.message = action.errorMessage.message;
        draft.isReset = false;
        break;
      case SET_PASSWORD_CHANGED:
        draft.user = {
          ...state.user,
          password_changed_status: PASSWORD_STATUSES.CHANGED,
        };
        break;
      case SET_TOKEN:
        draft.token = action.payload;
        break;
      case SEND_FORGOT_PASSWORD_EMAIL_SUCCESS:
        draft.isSent = true;
        break;
      case SEND_FORGOT_PASSWORD_EMAIL_ERROR:
        draft.message = action.message;
        draft.isSent = false;
    }
  });

export default auth;
