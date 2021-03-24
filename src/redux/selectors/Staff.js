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

export { makeSelectStaff, makeSelectPagination };
