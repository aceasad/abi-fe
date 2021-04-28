import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_SMALL_PAGINATION_LIMIT,
} from 'constants/ApiConstant';
import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectPatientsDomain = (state) => state.patient || reducers;

const makeSelectPatients = () =>
  createSelector(selectPatientsDomain, ({ patients }) => ({
    patients: patients.items,
    count: patients.count,
    loading: patients.loading,
    page: patients.page,
  }));

const makeSelectPatientRequestData = () =>
  createSelector(selectPatientsDomain, ({ patients }) => ({
    order: patients.order,
    field: patients.field,
    page: patients.page,
    search: patients.search,
  }));

const makeSelectLastOnThePage = () =>
  createSelector(selectPatientsDomain, ({ patients }) => ({
    isLast:
      patients.page !== 1 &&
      patients.count - 1 <= (patients.page - 1) * DEFAULT_PAGINATION_LIMIT,
    page: patients.page,
  }));

const makeSelectPatientDetails = () =>
  createSelector(selectPatientsDomain, (substate) => ({
    education: substate.education,
    employment: substate.employment,
    material_status: substate.material_status,
    ethnicities: substate.ethnicities,
  }));

const makeSelectPatientSingle = () =>
  createSelector(selectPatientsDomain, ({ patients }) => ({
    loading: patients.loading,
    patient: patients.single,
  }));

const makeSelectPatientLoading = () =>
  createSelector(selectPatientsDomain, ({ patients }) => patients.loading);

const makeSelectPatientOverview = () =>
  createSelector(selectPatientsDomain, ({ patients }) => ({
    loading: patients.loading,
    patient: patients.single,
  }));

const makeSelectScheduledAppointments = () =>
  createSelector(
    selectPatientsDomain,
    (substate) => substate.scheduledAppointments
  );

const makeSelectScheduledData = () =>
  createSelector(selectPatientsDomain, ({ scheduledAppointments }) => ({
    order: scheduledAppointments.order,
    field: scheduledAppointments.field,
    page: scheduledAppointments.page,
  }));

const makeSelectHistory = () =>
  createSelector(
    selectPatientsDomain,
    (substate) => substate.appointmentHistory
  );

const makeSelectHistoryPage = () =>
  createSelector(
    selectPatientsDomain,
    ({ appointmentHistory }) => appointmentHistory.page
  );

const makeSelectLastScheduledAppointmentOnThePage = () =>
  createSelector(selectPatientsDomain, ({ scheduledAppointments }) => ({
    isLast:
      scheduledAppointments.page !== 1 &&
      scheduledAppointments.count - 1 <=
        (scheduledAppointments.page - 1) * DEFAULT_SMALL_PAGINATION_LIMIT,
    page: scheduledAppointments.page,
  }));

const makeSelectLastAppointmentHistoryOnThePage = () =>
  createSelector(selectPatientsDomain, ({ appointmentHistory }) => ({
    isLast:
      appointmentHistory.page !== 1 &&
      appointmentHistory.count - 1 <=
        (appointmentHistory.page - 1) * DEFAULT_SMALL_PAGINATION_LIMIT,
    page: appointmentHistory.page,
  }));

export {
  makeSelectLastScheduledAppointmentOnThePage,
  makeSelectLastAppointmentHistoryOnThePage,
  makeSelectPatients,
  makeSelectPatientRequestData,
  makeSelectLastOnThePage,
  makeSelectPatientDetails,
  makeSelectPatientSingle,
  makeSelectPatientLoading,
  makeSelectPatientOverview,
  makeSelectScheduledAppointments,
  makeSelectScheduledData,
  makeSelectHistory,
  makeSelectHistoryPage,
};
