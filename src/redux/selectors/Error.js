import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectErrorDomain = (state) => state.error || reducers;

const makeSelectUpdateClinicError = () =>
  createSelector(selectErrorDomain, (substate) => substate.clinicError);

export { makeSelectInvalidOldPasswordError, makeSelectUpdateClinicError };
