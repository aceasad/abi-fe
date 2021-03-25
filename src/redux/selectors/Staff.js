import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectStaffDomain = (state) => state.staff || reducers;

const makeSelectStaff = () =>
  createSelector(selectStaffDomain, (substate) => ({
    staff: substate.staff,
    loading: substate.loading,
  }));

const makeSelectPagination = () =>
  createSelector(selectStaffDomain, (substate) => ({
    count: substate.count,
    page: substate.page,
  }));

const makeSelectStaffDetails = () =>
  createSelector(selectStaffDomain, (substate) => ({
    seniorities: substate.seniorities,
    specializations: substate.specializations,
    ethnicities: substate.ethnicities,
    loading: substate.loading,
  }));

const makeSelectStaffSingle = () =>
  createSelector(selectStaffDomain, (substate) => substate.staffSingle);

const makeSelectLoading = () =>
  createSelector(selectStaffDomain, (substate) => substate.loading);

export {
  makeSelectStaff,
  makeSelectPagination,
  makeSelectStaffDetails,
  makeSelectStaffSingle,
  makeSelectLoading,
};
