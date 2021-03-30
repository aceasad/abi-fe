import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectPatientsDomain = (state) => state.patient || reducers;

const makeSelectPatients = () =>
  createSelector(selectPatientsDomain, (substate) => ({
    patients: substate.patients,
    count: substate.count,
    loading: substate.loading,
  }));

const makeSelectPatientRequestData = () =>
  createSelector(selectPatientsDomain, (substate) => ({
    order: substate.order,
    field: substate.field,
    page: substate.page,
    search: substate.search,
  }));

export { makeSelectPatients, makeSelectPatientRequestData };
