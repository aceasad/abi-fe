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
  SEND_FORGOT_PASSWORD_EMAIL_SUCCESS,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  RESET_PASSWORD,
  SET_USER,
} from "../constants/Auth";
import { getLocalStorageItem } from "utils/localStorage";
import produce from "immer";

const initState = {
  loading: false,
  message: "",
  showMessage: false,
  redirect: "",
  token: localStorage.getItem(AUTH_TOKEN),
  user: null,
};

/* eslint-disable default-case */
const auth = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case AUTHENTICATED:
        draft.loading = false;
        draft.redirect = "/";
        draft.token = action.token;
        break;
      case SHOW_AUTH_MESSAGE:
        draft.message = action?.message;
        draft.showMessage = true;
        draft.loading = false;
        break;
      case HIDE_AUTH_MESSAGE:
        draft.message = "";
        draft.showMessage = false;
        break;
      case SIGNOUT_SUCCESS:
        draft.token = null;
        draft.redirect = "/";
        draft.loading = false;
        break;
      case SIGNUP_SUCCESS:
        draft.loading = false;
        draft.token = action.token;
        break;
      case SHOW_LOADING:
        draft.loading = true;
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
        draft.user = action.payload;
        break;
      case RESET_PASSWORD_ERROR:
        draft.message = action.errorMessage.message;
    }
  });

export default auth;
