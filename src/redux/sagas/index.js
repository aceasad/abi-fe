import { all } from 'redux-saga/effects';
import Auth from './Auth';
import Clinic from './Clinic';

export default function* rootSaga(getState) {
  yield all([Auth(), Clinic()]);
}
