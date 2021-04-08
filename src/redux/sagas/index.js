import { all } from 'redux-saga/effects';
import Auth from './Auth';

import Clinic from './Clinic';
import Staff from './Staff';
import IndustryAverage from './IndustryAverage';
import Patient from './Patient';
import User from './User';

export default function* rootSaga(getState) {
  yield all([Auth(), Staff(), Clinic(), IndustryAverage(), Patient(), User()]);
}
