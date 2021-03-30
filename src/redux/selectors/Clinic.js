import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectClinicDomain = (state) => state.clinic || reducers;

const makeSelectClinic = () =>
  createSelector(selectClinicDomain, (substate) => substate.clinic);

const makeSelectIsLoading = () =>
  createSelector(selectClinicDomain, (substate) => substate.loading);

export { makeSelectClinic, makeSelectIsLoading };
