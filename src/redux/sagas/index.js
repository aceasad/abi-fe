import { all } from 'redux-saga/effects';
import Auth from './Auth';

import Clinic from './Clinic';
import Staff from './Staff';

export default function* rootSaga(getState) {
  yield all([Auth(), Staff(), Clinic()]);
}
