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

const makeSelectSinglePreAppointmentQuestionnaire = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    preAppointmentQuestionnaire: substate.preAppointmentQuestionnaire,
    preAppointmentQuestionnaireLoading:
      substate.preAppointmentQuestionnaireLoading,
  }));

const makeSelectClinicDoctors = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    doctors: substate.doctors.all,
    doctorsLoading: substate.doctors.loading,
    next: substate.doctors.next,
  }));

const makeSelectAppointmentTypes = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    appointmentTypesLoading: substate.appointmentTypesLoading,
    appointmentTypes: substate.appointmentTypes,
  }));

const makeSelectAppointmentStatuses = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    appointmentStatusesLoading: substate.appointmentStatusesLoading,
    appointmentStatuses: substate.appointmentStatuses,
    saveAppointmentStatusesLoading: substate.saveAppointmentStatusesLoading,
  }));

const makeSelectAppointmentCommunicationStatuses = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    appointmentCommunicationStatusesLoading:
      substate.appointmentCommunicationStatusesLoading,
    appointmentCommunicationStatuses: substate.appointmentCommunicationStatuses,
  }));

const makeSelectAppointmentMissingReasons = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    appointmentMissingReasonsLoading: substate.appointmentMissingReasonsLoading,
    appointmentMissingReasons: substate.appointmentMissingReasons,
  }));

const makeSelectAppointmentCancellationReasons = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    appointmentCancellationReasonsLoading:
      substate.appointmentCancellationReasonsLoading,
    appointmentCancellationReasons: substate.appointmentCancellationReasons,
  }));

const makeSelectMessageRequiringImmediateAttentionStatuses = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    messageRequiringImmediateAttentionStatusesLoading:
      substate.messageRequiringImmediateAttentionStatusesLoading,
    messageRequiringImmediateAttentionStatuses:
      substate.messageRequiringImmediateAttentionStatuses,
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

export {
  makeSelectSingleAppointmentLoading,
  makeSelectDoctorAppointments,
  makeSelectDateAppointments,
  makeSelectSingleAppointment,
  makeSelectSinglePreAppointmentQuestionnaire,
  makeSelectClinicDoctors,
  makeSelectAppointmentTypes,
  makeSelectAppointmentStatuses,
  makeSelectAppointmentCommunicationStatuses,
  makeSelectAppointmentMissingReasons,
  makeSelectAppointmentCancellationReasons,
  makeSelectMessageRequiringImmediateAttentionStatuses,
  makeSelectClinicPatients,
  makeSelectLoading,
};
