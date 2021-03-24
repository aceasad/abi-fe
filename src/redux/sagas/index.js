import { all } from 'redux-saga/effects';
import Auth from './Auth';
import Staff from './Staff';

export default function* rootSaga(getState) {
  yield all([Auth(), Staff()]);
}
