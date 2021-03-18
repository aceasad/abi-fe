import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import {
  AUTH_TOKEN,
  SEND_FORGOT_PASSWORD_EMAIL,
  SIGNOUT,
  SIGNIN,
} from "../constants/Auth";
import {
  sendForgotPasswordEmailError,
  sendForgotPasswordEmailSuccess,
  showAuthMessage,
  signOutSuccess,
} from "../actions/Auth";
import { push, go } from "connected-react-router";

import FirebaseService from "services/FirebaseService";
import AuthService from "services/AuthService";
import { ROUTES } from "routes";

export function* signIn() {
  yield takeEvery(SIGNIN, function* ({ payload }) {
    try {
      yield call(AuthService.login, payload);
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
      const signOutUser = yield call(FirebaseService.signOutRequest);
      if (signOutUser === undefined) {
        localStorage.removeItem(AUTH_TOKEN);
        yield put(signOutSuccess(signOutUser));
      } else {
        yield put(showAuthMessage(signOutUser.message));
      }
    } catch (err) {
      yield put(showAuthMessage(err));
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

export default function* rootSaga() {
  yield all([fork(signIn), fork(signOut), fork(forgotPasswordEmailSend)]);
}
