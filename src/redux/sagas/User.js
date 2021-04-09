import { takeEvery, put, call, all, fork, select } from 'redux-saga/effects';
import {
  setSingleUser,
  setUsers,
  setUsersLoading,
  setUsersPage,
  setUsersSingleLoading,
} from 'redux/actions/User';
import {
  makeSelectLastOnThePage,
  makeSelectUsersPage,
} from 'redux/selectors/Users';
import {
  GET_USERS,
  SET_USERS_PAGE,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  GET_SINGLE_USER,
  UPDATE_CURRENT_USER,
} from 'redux/constants/User';
import userService from 'services/UserService';
import messages from 'views/app-views/UserSettings/messages';
import { setUser, showLoading } from 'redux/actions/Auth';

function* getUsers() {
  try {
    const page = yield select(makeSelectUsersPage());
    yield put(setUsersLoading(true));
    const { data } = yield call(userService.getUsers, page);
    yield put(setUsers(data));
  } catch (err) {
  } finally {
    yield put(setUsersLoading(false));
  }
}

function* createUser({ payload }) {
  try {
    yield put(setUsersSingleLoading(true));
    yield call(userService.createUser, payload.data);
    yield payload.afterCreate();
    yield getUsers();
  } catch (err) {
    yield payload.setErrors({ username: messages.usernameInUse });
  } finally {
    yield put(setUsersSingleLoading(false));
  }
}

function* updateUser({ payload }) {
  try {
    yield put(setUsersSingleLoading(true));
    yield call(userService.updateUser, payload.data);
    yield payload.afterUpdate();
    yield getUsers();
  } catch (err) {
    yield payload.setErrors({ username: messages.usernameInUse });
  } finally {
    yield put(setUsersSingleLoading(false));
  }
}

function* deleteUser({ payload }) {
  try {
    const { isLast, page } = yield select(makeSelectLastOnThePage());
    yield call(userService.deleteUser, payload.id);
    yield payload.afterDelete();
    if (isLast) yield put(setUsersPage(page - 1));
    else yield getUsers();
  } catch (err) {
  } finally {
    yield put(setUsersLoading(false));
  }
}

function* getSingleUser({ payload }) {
  try {
    yield put(setUsersSingleLoading(true));
    const { data } = yield call(userService.getSingleUser, payload);
    yield put(setSingleUser(data));
  } catch (err) {
  } finally {
    yield put(setUsersSingleLoading(false));
  }
}

function* updateCurrentUser({ payload }) {
  try {
    yield put(showLoading(true));
    const { data } = yield call(userService.updateUser, payload.data);
    yield payload.afterUpdate();
    yield put(setUser(data));
  } catch (err) {
    if (err?.response?.status === 400) {
      yield payload.setErrors({ username: messages.usernameInUse });
    }
  } finally {
    yield put(showLoading(false));
  }
}

export function* userSagas() {
  yield takeEvery(GET_USERS, getUsers);
  yield takeEvery(SET_USERS_PAGE, getUsers);
  yield takeEvery(CREATE_USER, createUser);
  yield takeEvery(DELETE_USER, deleteUser);
  yield takeEvery(UPDATE_USER, updateUser);
  yield takeEvery(GET_SINGLE_USER, getSingleUser);
  yield takeEvery(UPDATE_CURRENT_USER, updateCurrentUser);
}

export default function* rootSaga() {
  yield all([fork(userSagas)]);
}
