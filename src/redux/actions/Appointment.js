import {
  GET_DATE_APPOINTMENTS,
  GET_DOCTOR_APPOINTMENTS,
  SET_DATE_APPOINTMENTS,
  SET_DOCTOR_APPOINTMENTS,
  SET_IS_LOADING,
  GET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT_LOADING,
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT,
  GET_DOCTORS,
  APPEND_TO_ALL_DOCTORS,
  SET_LOADING_DOCTORS,
  GET_APPOINTMENT_TYPES,
  GET_APPOINTMENT_STATUS,
  APPEND_TO_APPOINTMENT_TYPES,
  APPEND_TO_APPOINTMENT_STATUS,
  SET_APPOINTMENT_TYPES_LOADING,
  SET_APPOINTMENT_STATUS_LOADING,
  SEARCH_PATIENTS,
  DELETE_APPOINTMENT,
  FILTER_DELETED_APPOINTMENT,
  END_APPOINTMENT,
  GET_MISSING_REASONS,
  SET_MISSING_REASONS,
  SET_PATIENTS_AUTOCOMPLETE,
  SET_PATIENTS_LOADING_AUTOCOMPLETE,
  RESET_PATIENTS_AUTOCOMPLETE,
  GET_MORE_SEARCH_RESULTS,
  APPEND_MORE_PATIENTS_AUTOCOMPLETE,
  DELETE_APPOINTMENT_FROM_PATIENTS,
  DELETE_APPOINTMENT_FROM_STAFF,
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

export const getDoctorAppointments = (payload) => ({
  type: GET_DOCTOR_APPOINTMENTS,
  payload,
});

export const setDoctorAppointments = (payload) => ({
  type: SET_DOCTOR_APPOINTMENTS,
  payload,
});

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

export const getSingleAppointment = (payload) => ({
  type: GET_SINGLE_APPOINTMENT,
  payload,
});

export const setSignleAppointmnet = (payload) => ({
  type: SET_SINGLE_APPOINTMENT,
  payload,
});

export const setSignleAppointmnetLoading = (payload) => ({
  type: SET_SINGLE_APPOINTMENT_LOADING,
  payload,
});
export const createAppointment = (payload) => ({
  type: CREATE_APPOINTMENT,
  payload,
});

export const updateAppointment = (payload) => ({
  type: UPDATE_APPOINTMENT,
  payload,
});

export const getDoctors = (payload) => ({
  type: GET_DOCTORS,
  payload,
});

export const appendToAllDoctors = (payload) => ({
  type: APPEND_TO_ALL_DOCTORS,
  payload,
});

export const setDoctorsLoading = (payload) => ({
  type: SET_LOADING_DOCTORS,
  payload,
});

export const getAppointmentTypes = (payload) => ({
  type: GET_APPOINTMENT_TYPES,
  payload,
});

export const getAppointmentStatus = (payload) => ({
  type: GET_APPOINTMENT_STATUS,
  payload,
});

export const appendToAppointmentTypes = (payload) => ({
  type: APPEND_TO_APPOINTMENT_TYPES,
  payload,
});

export const appendToAppointmentStatus = (payload) => ({
  type: APPEND_TO_APPOINTMENT_STATUS,
  payload,
});

export const setAppointmentTypesLoading = (payload) => ({
  type: SET_APPOINTMENT_TYPES_LOADING,
  payload,
});

export const setAppointmentStatusLoading = (payload) => ({
  type: SET_APPOINTMENT_STATUS_LOADING,
  payload,
});

export const setPatientsAutocomplete = (payload) => ({
  type: SET_PATIENTS_AUTOCOMPLETE,
  payload,
});

export const searchPatients = (payload) => ({
  type: SEARCH_PATIENTS,
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

export const endAppointment = (payload) => ({
  type: END_APPOINTMENT,
  payload,
});

export const getMissingReasons = () => ({
  type: GET_MISSING_REASONS,
});

export const setMissingReasons = (payload) => ({
  type: SET_MISSING_REASONS,
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
