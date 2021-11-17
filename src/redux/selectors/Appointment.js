import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectAppointmentDomain = (state) => state.appointment || reducers;

const makeSelectDoctorAppointments = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    doctorAppointments: substate.doctorAppointments,
    loading: substate.loading,
  }));

const makeSelectDateAppointments = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    dateAppointments: substate.dateAppointments,
    appointmentsCount: substate.doctorAppointments.reduce(
      (acc, item) => acc + item.appointments.length,
      0
    ),
  }));

const makeSelectSingleAppointment = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    appointment: substate.appointment,
    singleLoading: substate.singleLoading,
  }));

const makeSelectAppointmentTypes = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    appointmentTypesLoading: substate.appointmentTypesLoading,
    appointmentTypes: substate.appointmentTypes,
  }));

const makeSelectAppointmentStatus = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    appointmentStatusLoading: substate.appointmentStatusLoading,
    appointmentStatus: substate.appointmentStatus,
  }));

const makeSelectClinicDoctors = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    doctors: substate.doctors.all,
    doctorsLoading: substate.doctors.loading,
    next: substate.doctors.next,
  }));

const makeSelectClinicPatients = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    patients: substate.patients.all,
    patientsLoading: substate.patients.loading,
    next: substate.patients.next,
  }));

const makeSelectLoading = () =>
  createSelector(selectAppointmentDomain, (substate) => substate.loading);
const makeSelectSingleAppointmentLoading = () =>
  createSelector(selectAppointmentDomain, (substate) => substate.singleLoading);

const makeSelectMissingReasons = () =>
  createSelector(
    selectAppointmentDomain,
    (substate) => substate.missingReasons
  );

const makeSelectAppointmentsReminders = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    appointmentsReminders: substate.appointmentsReminders.items,
    count: substate.appointmentsReminders.count,
    loading: substate.appointmentsReminders.loading,
    page: substate.appointmentsReminders.page,
  }));

const makeSelectAppointmentsRemindersLastOnThePage = () =>
  createSelector(selectAppointmentDomain, ({ appointmentsReminders }) => ({
    isLast:
      appointmentsReminders.page !== 1 &&
      appointmentsReminders.count - 1 <=
        (appointmentsReminders.page - 1) * DEFAULT_PAGINATION_LIMIT,
    page: appointmentsReminders.page,
  }));

export {
  makeSelectMissingReasons,
  makeSelectSingleAppointmentLoading,
  makeSelectDoctorAppointments,
  makeSelectDateAppointments,
  makeSelectSingleAppointment,
  makeSelectAppointmentTypes,
  makeSelectAppointmentStatus,
  makeSelectClinicDoctors,
  makeSelectClinicPatients,
  makeSelectLoading,
  makeSelectAppointmentsReminders,
  makeSelectAppointmentsRemindersLastOnThePage,
};
