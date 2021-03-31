import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectPatientsDomain = (state) => state.patient || reducers;

const makeSelectPatients = () =>
  createSelector(selectPatientsDomain, (substate) => ({
    patients: substate.patients,
    count: substate.count,
    loading: substate.loading,
    page: substate.page,
  }));

const makeSelectPatientRequestData = () =>
  createSelector(selectPatientsDomain, (substate) => ({
    order: substate.order,
    field: substate.field,
    page: substate.page,
    search: substate.search,
  }));

const makeSelectLastOnThePage = () =>
  createSelector(selectPatientsDomain, (substate) => ({
    isLast:
      substate.page !== 1 &&
      substate.count - 1 <= (substate.page - 1) * DEFAULT_PAGINATION_LIMIT,
    page: substate.page,
  }));

export {
  makeSelectPatients,
  makeSelectPatientRequestData,
  makeSelectLastOnThePage,
};
