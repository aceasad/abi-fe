import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import {
  SEND_FORGOT_PASSWORD_EMAIL,
  SIGNOUT,
  SIGNIN,
  FETCH_USER,
  CREATE_PASSWORD
} from "../constants/Auth";
import {
  sendForgotPasswordEmailError,
  sendForgotPasswordEmailSuccess,
  showAuthMessage,
  authenticated,
  setUser,
  setPasswordChanged,
  signOutSuccess
} from "../actions/Auth";
import { push, go } from "connected-react-router";

import AuthService from "services/AuthService";
import { ROUTES } from "routes";
import messages from "views/auth-views/components/LoginForm/messages";
import { clearLocalStorage } from "utils/localStorage";

export function* signIn() {
  yield takeEvery(SIGNIN, function* ({ payload }) {
    try {
      const data = yield call(AuthService.login, payload);
      yield put(authenticated(data));
    } catch (error) {
      yield put(showAuthMessage(messages.invalidEmailOrPassword));
    }
  });
}

export function* userFetch() {
  yield takeEvery(FETCH_USER, function* () {
    try {
      const { data } = yield call(AuthService.fetchUser);
      yield put(setUser(data));
      //yield put(push(ROUTES.CONTACTS));
      //yield put(go());
    } catch (error) {
      yield put(showAuthMessage(error));
    }
  });
}

export function* signOut() {
  yield takeEvery(SIGNOUT, function* () {
    try {
      yield put(signOutSuccess());
      yield clearLocalStorage();
      yield put(push(ROUTES.LOGIN));
    } catch (err) {
      //
    }
  });
}

export function* forgotPasswordEmailSend() {
  yield takeEvery(SEND_FORGOT_PASSWORD_EMAIL, function* ({ email }) {
    try {
      const sendEmail = yield call(AuthService.sendForgotPasswordEmail, email);
      yield put(push(ROUTES.LOGIN));
      yield put(go());
      yield put(sendForgotPasswordEmailSuccess(sendEmail));
    } catch (err) {
      yield put(sendForgotPasswordEmailError(err));
    }
  });
}

export function* createUserPassword() {
  yield takeEvery(CREATE_PASSWORD, function* ({ payload }) {
    try {
      yield call(AuthService.createUserPassword, payload);
      yield put(setPasswordChanged());
      yield put(push(ROUTES.DASHBOARD));
    } catch (err) {
      //
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(signIn),
    fork(signOut),
    fork(forgotPasswordEmailSend),
    fork(userFetch),
    fork(createUserPassword)
  ]);
}
