import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectStaffDomain = (state) => state.staff || reducers;

const makeSelectStaff = () =>
  createSelector(selectStaffDomain, (substate) => substate.staff);

export { makeSelectStaff };
