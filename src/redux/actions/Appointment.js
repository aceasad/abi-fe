import {
  GET_DATE_APPOINTMENTS,
  GET_DOCTOR_APPOINTMENTS,
  SET_DATE_APPOINTMENTS,
  SET_DOCTOR_APPOINTMENTS,
  SET_IS_LOADING,
  GET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT_LOADING,
  GET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE,
  SET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE,
  SET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE_LOADING,
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT,
  UPDATE_APPOINTMENT_COMMUNICATION_STATUS,
  DELETE_APPOINTMENT,
  DELETE_APPOINTMENT_FROM_PATIENTS,
  DELETE_APPOINTMENT_FROM_STAFF,
  FILTER_DELETED_APPOINTMENT,
  CANCEL_APPOINTMENT,
  END_APPOINTMENT,
  GET_DOCTORS,
  SET_LOADING_DOCTORS,
  APPEND_TO_ALL_DOCTORS,
  GET_APPOINTMENT_TYPES,
  SET_APPOINTMENT_TYPES_LOADING,
  SET_APPOINTMENT_TYPES,
  GET_APPOINTMENT_STATUSES,
  SET_APPOINTMENT_STATUSES_LOADING,
  SET_APPOINTMENT_STATUSES,
  GET_APPOINTMENT_COMMUNICATION_STATUSES,
  SET_APPOINTMENT_COMMUNICATION_STATUSES_LOADING,
  SET_APPOINTMENT_COMMUNICATION_STATUSES,
  GET_APPOINTMENT_MISSING_REASONS,
  SET_APPOINTMENT_MISSING_REASONS_LOADING,
  SET_APPOINTMENT_MISSING_REASONS,
  GET_APPOINTMENT_CANCELLATION_REASONS,
  SET_APPOINTMENT_CANCELLATION_REASONS_LOADING,
  SET_APPOINTMENT_CANCELLATION_REASONS,
  GET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES,
  SET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES_LOADING,
  SET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES,
  UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS,
  SAVE_APPOINTMENT_STATUS,
  SAVE_APPOINTMENT_STATUS_LOADING,
  SEARCH_PATIENTS,
  SET_PATIENTS_AUTOCOMPLETE,
  SET_PATIENTS_LOADING_AUTOCOMPLETE,
  RESET_PATIENTS_AUTOCOMPLETE,
  GET_MORE_SEARCH_RESULTS,
  APPEND_MORE_PATIENTS_AUTOCOMPLETE,
  SET_APPOINTMENTS_REMINDERS_PAGE_LOADING,
  GET_APPOINTMENTS_REMINDERS_PAGE,
  SET_APPOINTMENTS_REMINDERS_PAGE,
  SET_APPOINTMENTS_REMINDERS_SORT_ORDER,
  CANCEL_APPOINTMENT_REMINDER,
  REVERSE_APPOINTMENT_REMINDER_CANCELLATION,
} from 'redux/constants/Appointment';
import {
  FROM_STAFF_APPOINTMENTS,
  FROM_PATIENT_APPOINTMENTS,
} from 'constants/ClinicConstants';

// doctor appointments
export const getDoctorAppointments = (payload) => ({
  type: GET_DOCTOR_APPOINTMENTS,
  payload,
});

export const setDoctorAppointments = (payload) => ({
  type: SET_DOCTOR_APPOINTMENTS,
  payload,
});

// date appointments
export const getDateAppointments = (payload) => ({
  type: GET_DATE_APPOINTMENTS,
  payload,
});

export const setDateAppointments = (payload) => ({
  type: SET_DATE_APPOINTMENTS,
  payload,
});

export const setAppointmentsLoading = (payload) => ({
  type: SET_IS_LOADING,
  payload,
});

// single appointment
export const getSingleAppointment = (payload) => ({
  type: GET_SINGLE_APPOINTMENT,
  payload,
});

export const setSingleAppointment = (payload) => ({
  type: SET_SINGLE_APPOINTMENT,
  payload,
});

export const setSingleAppointmentLoading = (payload) => ({
  type: SET_SINGLE_APPOINTMENT_LOADING,
  payload,
});

// single pre-appointment questionnaire (answers)
export const getSinglePreAppointmentQuestionnaire = (payload) => ({
  type: GET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE,
  payload,
});

export const setSinglePreAppointmentQuestionnaire = (payload) => ({
  type: SET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE,
  payload,
});

export const setSinglePreAppointmentQuestionnaireLoading = (payload) => ({
  type: SET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE_LOADING,
  payload,
});

// appointment
export const createAppointment = (payload) => ({
  type: CREATE_APPOINTMENT,
  payload,
});

export const updateAppointment = (payload) => ({
  type: UPDATE_APPOINTMENT,
  payload,
});

export const updateAppointmentCommunicationStatus = (payload) => ({
  type: UPDATE_APPOINTMENT_COMMUNICATION_STATUS,
  payload,
});

export const deleteAppointment = (payload) => {
  switch (payload.actionFrom) {
    case FROM_STAFF_APPOINTMENTS:
      return {
        type: DELETE_APPOINTMENT_FROM_STAFF,
        payload,
      };
    case FROM_PATIENT_APPOINTMENTS:
      return {
        type: DELETE_APPOINTMENT_FROM_PATIENTS,
        payload,
      };
    default:
      return {
        type: DELETE_APPOINTMENT,
        payload,
      };
  }
};

export const filterDeletedAppointment = (payload) => ({
  type: FILTER_DELETED_APPOINTMENT,
  payload,
});

export const cancelAppointment = (payload) => ({
  type: CANCEL_APPOINTMENT,
  payload,
});

export const endAppointment = (payload) => ({
  type: END_APPOINTMENT,
  payload,
});

// doctors
export const getDoctors = (payload) => ({
  type: GET_DOCTORS,
  payload,
});

export const setDoctorsLoading = (payload) => ({
  type: SET_LOADING_DOCTORS,
  payload,
});

export const appendToAllDoctors = (payload) => ({
  type: APPEND_TO_ALL_DOCTORS,
  payload,
});

// appointment types
export const getAppointmentTypes = (payload) => ({
  type: GET_APPOINTMENT_TYPES,
  payload,
});

export const setAppointmentTypesLoading = (payload) => ({
  type: SET_APPOINTMENT_TYPES_LOADING,
  payload,
});

export const setAppointmentTypes = (payload) => ({
  type: SET_APPOINTMENT_TYPES,
  payload,
});

// appointment statuses
export const getAppointmentStatuses = (payload) => ({
  type: GET_APPOINTMENT_STATUSES,
  payload,
});

export const setAppointmentStatusesLoading = (payload) => ({
  type: SET_APPOINTMENT_STATUSES_LOADING,
  payload,
});

export const setAppointmentStatuses = (payload) => ({
  type: SET_APPOINTMENT_STATUSES,
  payload,
});

// appointment communication statuses
export const getAppointmentCommunicationStatuses = (payload) => ({
  type: GET_APPOINTMENT_COMMUNICATION_STATUSES,
  payload,
});

export const setAppointmentCommunicationStatusesLoading = (payload) => ({
  type: SET_APPOINTMENT_COMMUNICATION_STATUSES_LOADING,
  payload,
});

export const setAppointmentCommunicationStatuses = (payload) => ({
  type: SET_APPOINTMENT_COMMUNICATION_STATUSES,
  payload,
});

// appointment missing reasons
export const getAppointmentMissingReasons = (payload) => ({
  type: GET_APPOINTMENT_MISSING_REASONS,
  payload,
});

export const setAppointmentMissingReasonsLoading = (payload) => ({
  type: SET_APPOINTMENT_MISSING_REASONS_LOADING,
  payload,
});

export const setAppointmentMissingReasons = (payload) => ({
  type: SET_APPOINTMENT_MISSING_REASONS,
  payload,
});

// appointment cancellation reasons
export const getAppointmentCancellationReasons = (payload) => ({
  type: GET_APPOINTMENT_CANCELLATION_REASONS,
  payload,
});

export const setAppointmentCancellationReasonsLoading = (payload) => ({
  type: SET_APPOINTMENT_CANCELLATION_REASONS_LOADING,
  payload,
});

export const setAppointmentCancellationReasons = (payload) => ({
  type: SET_APPOINTMENT_CANCELLATION_REASONS,
  payload,
});

// message requiring immediate attention statuses
export const  getMessageRequiringImmediateAttentionStatuses = (payload) => ({
  type: GET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES,
  payload,
});

export const setMessageRequiringImmediateAttentionStatusesLoading = (
  payload
) => ({
  type: SET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES_LOADING,
  payload,
});

export const setMessageRequiringImmediateAttentionStatuses = (payload) => ({
  type: SET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES,
  payload,
});

export const updateAppointmentMessageRequiringImmediateAttentionStatus = (
  payload
) => ({
  type: UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS,
  payload,
});

// appointment status save
export const saveAppointmentStatus = (payload) => ({
  type: SAVE_APPOINTMENT_STATUS,
  payload,
});

export const saveAppointmentStatusLoading = (payload) => ({
  type: SAVE_APPOINTMENT_STATUS_LOADING,
  payload,
});

// patient
export const setPatientsAutocomplete = (payload) => ({
  type: SET_PATIENTS_AUTOCOMPLETE,
  payload,
});

export const searchPatients = (payload) => ({
  type: SEARCH_PATIENTS,
  payload,
});

export const setPatientsLoadingAutocomplete = (payload) => ({
  type: SET_PATIENTS_LOADING_AUTOCOMPLETE,
  payload,
});

export const resetPatientsAutocomplete = () => ({
  type: RESET_PATIENTS_AUTOCOMPLETE,
});

export const getMoreSearchResults = () => ({
  type: GET_MORE_SEARCH_RESULTS,
});

export const addMorePatientsAutocomplete = (payload) => ({
  type: APPEND_MORE_PATIENTS_AUTOCOMPLETE,
  payload,
});

// appointment reminder
export const setAppointmentsRemindersPageLoading = (payload) => ({
  type: SET_APPOINTMENTS_REMINDERS_PAGE_LOADING,
  payload,
});

export const getAppointmentsRemindersPage = (payload) => ({
  type: GET_APPOINTMENTS_REMINDERS_PAGE,
  payload,
});

export const setAppointmentsRemindersPage = (payload) => ({
  type: SET_APPOINTMENTS_REMINDERS_PAGE,
  payload,
});

export const setAppointmentsRemindersOrder = (payload) => ({
  type: SET_APPOINTMENTS_REMINDERS_SORT_ORDER,
  payload,
});

export const cancelAppointmentReminder = (payload) => ({
  type: CANCEL_APPOINTMENT_REMINDER,
  payload,
});

export const reverseAppointmentReminderCancellation = (payload) => ({
  type: REVERSE_APPOINTMENT_REMINDER_CANCELLATION,
  payload,
});
