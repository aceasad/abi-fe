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
} from "../constants/Auth";

const initState = {
  loading: false,
  message: "",
  showMessage: false,
  redirect: "",
  token: localStorage.getItem(AUTH_TOKEN),
};

const auth = (state = initState, action) => {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        loading: false,
        redirect: "/",
        token: action.token,
      };
    case SHOW_AUTH_MESSAGE:
      return {
        ...state,
        message: action.message,
        showMessage: true,
        loading: false,
      };
    case HIDE_AUTH_MESSAGE:
      return {
        ...state,
        message: "",
        showMessage: false,
      };
    case SIGNOUT_SUCCESS: {
      return {
        ...state,
        token: null,
        redirect: "/",
        loading: false,
      };
    }
    case SIGNUP_SUCCESS: {
      return {
        ...state,
        loading: false,
        token: action.token,
      };
    }
    case SHOW_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case SEND_FORGOT_PASSWORD_EMAIL_SUCCESS: {
      return {
        ...state,
      };
    }
    case SIGNIN_WITH_GOOGLE_AUTHENTICATED: {
      return {
        ...state,
        loading: false,
        token: action.token,
      };
    }
    case SIGNIN_WITH_FACEBOOK_AUTHENTICATED: {
      return {
        ...state,
        loading: false,
        token: action.token,
      };
    }
    case RESET_PASSWORD: {
      return { ...state };
    }
    case RESET_PASSWORD_SUCCESS: {
      return { ...state };
    }
    case RESET_PASSWORD_ERROR: {
      return { ...state, message: action.error_message.message };
    }

    default:
      return state;
  }
};

export default auth;
