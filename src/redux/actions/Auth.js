import {
  SIGNIN,
  AUTHENTICATED,
  SIGNOUT,
  SIGNOUT_SUCCESS,
  SHOW_AUTH_MESSAGE,
  HIDE_AUTH_MESSAGE,
  SIGNUP,
  SIGNUP_SUCCESS,
  SHOW_LOADING,
  SEND_FORGOT_PASSWORD_EMAIL,
  SEND_FORGOT_PASSWORD_EMAIL_SUCCESS,
  SEND_FORGOT_PASSWORD_EMAIL_ERROR,
} from "../constants/Auth";

export const signIn = (payload) => {
  return {
    type: SIGNIN,
    payload,
  };
};

export const authenticated = (token) => {
  return {
    type: AUTHENTICATED,
    token,
  };
};

export const signOut = () => {
  return {
    type: SIGNOUT,
  };
};

export const signOutSuccess = () => {
  return {
    type: SIGNOUT_SUCCESS,
  };
};

export const signUp = (user) => {
  return {
    type: SIGNUP,
    payload: user,
  };
};

export const signUpSuccess = (token) => {
  return {
    type: SIGNUP_SUCCESS,
    token,
  };
};

export const showAuthMessage = (message) => {
  return {
    type: SHOW_AUTH_MESSAGE,
    message,
  };
};

export const hideAuthMessage = () => {
  return {
    type: HIDE_AUTH_MESSAGE,
  };
};

export const showLoading = () => {
  return {
    type: SHOW_LOADING,
  };
};

export const sendForgotPasswordEmail = (payload) => {
  return {
    type: SEND_FORGOT_PASSWORD_EMAIL,
    payload,
  };
};

export const sendForgotPasswordEmailSuccess = (payload) => {
  return {
    type: SEND_FORGOT_PASSWORD_EMAIL_SUCCESS,
    payload,
  };
};

export const sendForgotPasswordEmailError = (payload) => {
  return {
    type: SEND_FORGOT_PASSWORD_EMAIL_ERROR,
    payload,
  };
};
