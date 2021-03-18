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
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
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

export const sendForgotPasswordEmail = (email) => {
  return {
    type: SEND_FORGOT_PASSWORD_EMAIL,
    email,
  };
};

export const sendForgotPasswordEmailSuccess = (email) => {
  return {
    type: SEND_FORGOT_PASSWORD_EMAIL_SUCCESS,
    email,
  };
};

export const sendForgotPasswordEmailError = (payload) => {
  return {
    type: SEND_FORGOT_PASSWORD_EMAIL_ERROR,
    payload,
  };
};

export const resetPassword = (password, token, email) => {
  return {
    type: RESET_PASSWORD,
    password,
    token,
    email,
  };
};

export const resetPasswordSuccess = (password, token, email) => {
  return {
    type: RESET_PASSWORD_SUCCESS,
    password,
    token,
    email,
  };
};

export const resetPasswordError = (error_message) => {
  return {
    type: RESET_PASSWORD_ERROR,
    error_message,
  };
};
