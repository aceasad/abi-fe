import { createSelector } from 'reselect';
import reducers from '../reducers';
import { SCHEDULED, HISTORY } from 'redux/reducers/Staff';
import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';

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

const makeSelectStaffAppointmentsRequestData = (field) =>
  createSelector(selectStaffDomain, ({ [field]: data }) => data);

const makeSelectLastScheduledAppointmentOnTheStaffPage = () =>
  createSelector(selectStaffDomain, ({ [SCHEDULED]: data }) => ({
    isLast:
      data.page !== 1 &&
      data.count - 1 <= (data.page - 1) * DEFAULT_PAGINATION_LIMIT,
    page: data.page,
  }));

const makeSelectLastPastAppointmentOnTheStaffPage = () =>
  createSelector(selectStaffDomain, ({ [HISTORY]: data }) => ({
    isLast:
      data.page !== 1 &&
      data.count - 1 <= (data.page - 1) * DEFAULT_PAGINATION_LIMIT,
    page: data.page,
  }));

export {
  makeSelectStaffAppointmentsRequestData,
  makeSelectStaff,
  makeSelectPagination,
  makeSelectStaffDetails,
  makeSelectStaffSingle,
  makeSelectLoading,
  makeSelectLastScheduledAppointmentOnTheStaffPage,
  makeSelectLastPastAppointmentOnTheStaffPage,
};
