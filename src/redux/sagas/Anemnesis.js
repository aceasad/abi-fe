import { takeEvery, put, call, all, fork, select } from 'redux-saga/effects';
import {
  appendExistingConditions,
  appendPreviousOperations,
  filterOperationType,
  setExistingMedicalConditions,
  setLoading,
  setPreviousOperations,
} from 'redux/actions/Anamnesis';

import {
  CREATE_MEDICAL_CONDITION,
  DELETE_MEDICAL_CONDITION,
  ADD_OPERATION_TYPE,
  DELETE_OPERATION_TYPE,
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

export const APPEND = 'APPEND';

export function* getMedicalConditions({ payload }) {
  try {
    const requestData = yield select(makeSelectExistingMedicalConditions());
    yield put(setLoading({ field: EXISTING_CONDITIONS, loading: true }));
    const { data } = yield call(
      anamnesisService.getExistingConditions,
      requestData,
      payload.id
    );
    if (payload.type === APPEND) yield put(appendExistingConditions(data));
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
    if (payload.type === APPEND) yield put(appendPreviousOperations(data));
    else yield put(setPreviousOperations(data));
  } finally {
    yield put(setLoading({ field: PREVIOUS_OPERATIONS, loading: false }));
  }
}

export function* createMedicalCondition({ payload }) {
  try {
    const { data } = yield call(
      anamnesisService.createMedicalCondition,
      payload.data
    );
    yield payload.afterCreate(data.id);
  } catch {
    yield payload.afterError();
  }
}

export function* deleteMedicalCondition({ payload }) {
  try {
    yield call(anamnesisService.deleteMedicalCondition, payload.data);
    yield payload.afterDelete(payload.data);
  } catch {}
}

export function* addOperationType({ payload }) {
  try {
    const { data } = yield call(
      anamnesisService.addOperationType,
      payload.name
    );
    yield payload.afterAdd();
    yield payload.addOperation(data);
  } catch {}
}

export function* deleteOperationType({ payload }) {
  try {
    yield call(
      anamnesisService.deleteOperationType,
      payload.item.operation_type_id
    );
    yield payload.afterDelete();
    yield put(filterOperationType(payload.item.operation_type_id));
  } catch {}
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
  yield takeEvery(CREATE_MEDICAL_CONDITION, createMedicalCondition);
  yield takeEvery(DELETE_MEDICAL_CONDITION, deleteMedicalCondition);
  yield takeEvery(ADD_OPERATION_TYPE, addOperationType);
  yield takeEvery(DELETE_OPERATION_TYPE, deleteOperationType);
}

export default function* rootSaga() {
  yield all([fork(anemnesisSaga)]);
}
