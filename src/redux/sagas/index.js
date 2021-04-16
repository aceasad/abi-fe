import { all } from 'redux-saga/effects';
import Auth from './Auth';

import Clinic from './Clinic';
import Staff from './Staff';
import IndustryAverage from './IndustryAverage';
import Patient from './Patient';
import User from './User';
import Appointment from './Appointment';
import Anamnesis from './Anemnesis';

export default function* rootSaga(getState) {
  yield all([
    Auth(),
    Staff(),
    Clinic(),
    IndustryAverage(),
    Patient(),
    User(),
    Appointment(),
    Anamnesis(),
  ]);
}
