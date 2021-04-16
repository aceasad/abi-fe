import { takeEvery, put, call, all, fork, select } from 'redux-saga/effects';
import {
  setExistingMedicalConditions,
  setLoading,
  setPreviousOperations,
} from 'redux/actions/Anamnesis';

import {
  GET_MEDICAL_CONDITIONS,
  GET_PREVIOUS_OPERATIONS,
  SET_ANEMNESIS_PAGE,
} from 'redux/constants/Anemnesis';
import {
  EXISTING_CONDITIONS,
  PREVIOUS_OPERATIONS,
} from 'redux/reducers/Anemnesis';
import {
  makeSelectExistingMedicalConditions,
  makeSelectPreviousOperations,
} from 'redux/selectors/Anemnesis';
import anamnesisService from 'services/AnamnesisService';

export function* getMedicalConditions({ payload }) {
  try {
    const requestData = yield select(makeSelectExistingMedicalConditions());
    yield put(setLoading({ field: EXISTING_CONDITIONS, loading: true }));
    const { data } = yield call(
      anamnesisService.getExistingConditions,
      requestData,
      payload.id
    );
    yield put(setExistingMedicalConditions(data));
  } finally {
    yield put(setLoading({ field: EXISTING_CONDITIONS, loading: false }));
  }
}

export function* getPreviousOperations({ payload }) {
  try {
    const requestData = yield select(makeSelectPreviousOperations());
    yield put(setLoading({ field: PREVIOUS_OPERATIONS, loading: true }));
    const { data } = yield call(
      anamnesisService.getPreviousOperations,
      requestData,
      payload.id
    );
    yield put(setPreviousOperations(data));
  } finally {
    yield put(setLoading({ field: PREVIOUS_OPERATIONS, loading: false }));
  }
}

export function* anemnesisSaga() {
  yield takeEvery(GET_MEDICAL_CONDITIONS, getMedicalConditions);
  yield takeEvery(GET_PREVIOUS_OPERATIONS, getPreviousOperations);
  yield takeEvery(SET_ANEMNESIS_PAGE, function* ({ payload }) {
    if (payload.field === EXISTING_CONDITIONS)
      yield getMedicalConditions({ payload });
    else if (payload.field === PREVIOUS_OPERATIONS)
      yield getPreviousOperations({ payload });
  });
}

export default function* rootSaga() {
  yield all([fork(anemnesisSaga)]);
}
