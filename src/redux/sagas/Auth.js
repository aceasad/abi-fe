import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import {
  SEND_FORGOT_PASSWORD_EMAIL,
  SIGNOUT,
  SIGNIN,
  RESET_PASSWORD,
  FETCH_USER,
  CREATE_PASSWORD,
  CHANGE_PASSWORD,
} from '../constants/Auth';

import {
  sendForgotPasswordEmailError,
  sendForgotPasswordEmailSuccess,
  showAuthMessage,
  resetPasswordSuccess,
  resetPasswordError,
  authenticated,
  setUser,
  setPasswordChanged,
  showLoading,
} from '../actions/Auth';
import AuthService from 'services/AuthService';
import { teardownSession } from 'services/sessionTeardown';
import clinicService from 'services/ClinicService';
import messages from 'containers/Forms/LoginForm/messages';
import changePasswordMessages from 'views/app-views/SettingsPage/messages';
import { setClinic } from '../actions/Clinic';
import { getMessageRequiringImmediateAttentionStatuses } from '../actions/Appointment';
import { fetchUnreadNotifications } from '../actions/Notifications';

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
      // Fetch clinic data after user data is set
      const clinicData = yield call(clinicService.getClinic);
      yield put(setClinic(clinicData.data));
      // Fetch message requiring immediate attention statuses after login
      yield put(getMessageRequiringImmediateAttentionStatuses());
      // Fetch unread notifications count after login
      yield put(fetchUnreadNotifications());
    } catch (error) {
      yield put(showAuthMessage(error));
    }
  });
}

export function* signOut() {
  yield takeEvery(SIGNOUT, function* () {
    try {
      console.info('[AuthSaga] SIGNOUT -> teardownSession');
      yield call(teardownSession, { navigateToLogin: true });
    } catch (err) {
      //
    }
  });
}

export function* forgotPasswordEmailSend() {
  yield takeEvery(SEND_FORGOT_PASSWORD_EMAIL, function* ({ email }) {
    try {
      const sendEmail = yield call(AuthService.sendForgotPasswordEmail, email);
      yield put(sendForgotPasswordEmailSuccess(sendEmail));
    } catch (err) {
      yield put(sendForgotPasswordEmailError(err.messages));
    }
  });
}

export function* resetPassword() {
  yield takeEvery(RESET_PASSWORD, function* ({ password, token }) {
    try {
      yield call(AuthService.resetPassword, password, token);
      yield put(resetPasswordSuccess());
    } catch (err) {
      yield put(resetPasswordError(err));
    }
  });
}

export function* createUserPassword() {
  yield takeEvery(CREATE_PASSWORD, function* ({ payload }) {
    try {
      yield put(showLoading(true));
      yield call(AuthService.createUserPassword, payload);
      yield put(setPasswordChanged());
    } catch (err) {
      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.message;
      yield put(
        showAuthMessage(backendError || messages.createPasswordError)
      );
    } finally {
      yield put(showLoading(false));
    }
  });
}

export function* changeUserPassword() {
  yield takeEvery(CHANGE_PASSWORD, function* ({ payload }) {
    try {
      yield put(showLoading(true));
      yield call(AuthService.changeUserPassword, payload.data);
      yield put(setPasswordChanged());
      yield payload.showSuccess();
      yield payload.resetForm();
    } catch (err) {
      if (err?.response?.status === 409) {
        yield call(payload.setErrors, {
          oldPassword: changePasswordMessages.invalidOldPassword,
        });
      }
      yield payload.showError();
    } finally {
      yield put(showLoading(false));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(signIn),
    fork(signOut),
    fork(forgotPasswordEmailSend),
    fork(resetPassword),
    fork(userFetch),
    fork(createUserPassword),
    fork(changeUserPassword),
  ]);
}
