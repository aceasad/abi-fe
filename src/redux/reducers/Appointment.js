import { baseState } from 'constants/ClinicConstants';
import {
  SET_DOCTOR_APPOINTMENTS,
  SET_DATE_APPOINTMENTS,
  SET_IS_LOADING,
  SET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT_LOADING,
  SET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE,
  SET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE_LOADING,
  SET_LOADING_DOCTORS,
  APPEND_TO_ALL_DOCTORS,
  SET_APPOINTMENT_TYPES_LOADING,
  SET_APPOINTMENT_TYPES,
  SET_APPOINTMENT_STATUSES_LOADING,
  SET_APPOINTMENT_STATUSES,
  SET_APPOINTMENT_COMMUNICATION_STATUSES_LOADING,
  SET_APPOINTMENT_COMMUNICATION_STATUSES,
  SET_APPOINTMENT_MISSING_REASONS_LOADING,
  SET_APPOINTMENT_MISSING_REASONS,
  SET_APPOINTMENT_CANCELLATION_REASONS_LOADING,
  SET_APPOINTMENT_CANCELLATION_REASONS,
  SET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES_LOADING,
  SET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES,
  SAVE_APPOINTMENT_STATUS_LOADING,
  FILTER_DELETED_APPOINTMENT,
  SET_PATIENTS_AUTOCOMPLETE,
  SET_PATIENTS_LOADING_AUTOCOMPLETE,
  RESET_PATIENTS_AUTOCOMPLETE,
  APPEND_MORE_PATIENTS_AUTOCOMPLETE,
  SET_APPOINTMENTS_REMINDERS_PAGE,
  SET_APPOINTMENTS_REMINDERS_PAGE_LOADING,
} from '../constants/Appointment';
import { produce } from 'immer';

const initialState = {
  doctorAppointments: [],
  dateAppointments: [],
  loading: false,
  appointment: null,
  singleLoading: false,
  preAppointmentQuestionnaire: null,
  preAppointmentQuestionnaireLoading: false,
  doctors: {
    all: [],
    loading: false,
    next: null,
  },
  patients: {
    all: [],
    loading: false,
    next: null,
  },
  appointmentTypes: [],
  appointmentTypesLoading: false,
  appointmentStatuses: [],
  appointmentStatusesLoading: false,
  appointmentCommunicationStatuses: [],
  appointmentCommunicationStatusesLoading: false,
  appointmentMissingReasons: [],
  appointmentMissingReasonsLoading: false,
  appointmentCancellationReasons: [],
  appointmentCancellationReasonsLoading: false,
  messageRequiringImmediateAttentionStatuses: [],
  messageRequiringImmediateAttentionStatusesLoading: false,
  saveAppointmentStatusLoading: false,
  appointmentsReminders: { ...baseState },
};

const appointment = (state = initialState, action) =>
  produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case SET_DOCTOR_APPOINTMENTS:
        draft.doctorAppointments = action.payload;
        break;
      case SET_DATE_APPOINTMENTS:
        draft.dateAppointments = action.payload;
        break;
      case SET_IS_LOADING:
        draft.loading = action.payload;
        break;
      case SET_SINGLE_APPOINTMENT:
        draft.appointment = action.payload;
        break;
      case SET_SINGLE_APPOINTMENT_LOADING:
        draft.singleLoading = action.payload;
        break;
      case SET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE:
        draft.preAppointmentQuestionnaire = action.payload;
        break;
      case SET_SINGLE_PRE_APPOINTMENT_QUESTIONNAIRE_LOADING:
        draft.preAppointmentQuestionnaireLoading = action.payload;
        break;
      // doctors
      case SET_LOADING_DOCTORS:
        draft.doctors.loading = action.payload;
        break;
      case APPEND_TO_ALL_DOCTORS:
        draft.doctors = {
          ...draft.doctors,
          all: [...draft.doctors.all, ...action.payload.results],
          next: action.payload.next,
        };
        break;

      // appointment types
      case SET_APPOINTMENT_TYPES_LOADING:
        draft.appointmentTypesLoading = action.payload;
        break;
      case SET_APPOINTMENT_TYPES:
        draft.appointmentTypes = action.payload.results;
        break;

      // appointment statuses
      case SET_APPOINTMENT_STATUSES_LOADING:
        draft.appointmentStatusesLoading = action.payload;
        break;
      case SET_APPOINTMENT_STATUSES:
        draft.appointmentStatuses = action.payload.results;
        break;

      // appointment communication statuses
      case SET_APPOINTMENT_COMMUNICATION_STATUSES_LOADING:
        draft.appointmentCommunicationStatusesLoading = action.payload;
        break;
      case SET_APPOINTMENT_COMMUNICATION_STATUSES:
        draft.appointmentCommunicationStatuses = action.payload;
        break;

      // appointment missing reasons
      case SET_APPOINTMENT_MISSING_REASONS_LOADING:
        draft.appointmentMissingReasonsLoading = action.payload;
        break;
      case SET_APPOINTMENT_MISSING_REASONS:
        draft.appointmentMissingReasons = action.payload;
        break;

      // appointment cancellation reasons
      case SET_APPOINTMENT_CANCELLATION_REASONS_LOADING:
        draft.appointmentCancellationReasonsLoading = action.payload;
        break;
      case SET_APPOINTMENT_CANCELLATION_REASONS:
        draft.appointmentCancellationReasons = action.payload.results;
        break;

      // appointment cancellation reasons
      case SET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES_LOADING:
        draft.messageRequiringImmediateAttentionStatusesLoading =
          action.payload;
        break;
      case SET_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUSES:
        draft.messageRequiringImmediateAttentionStatuses =
          action.payload;
        break;

      // save appointment status
      case SAVE_APPOINTMENT_STATUS_LOADING:
        draft.saveAppointmentStatusesLoading = action.payload;
        break;

      case SET_PATIENTS_AUTOCOMPLETE:
        draft.patients = {
          ...draft.patients,
          all: [...action.payload.results],
          next: action.payload.next,
        };
        break;
      case APPEND_MORE_PATIENTS_AUTOCOMPLETE:
        draft.patients = {
          ...draft.patients,
          all: [...draft.patients.all, action.payload.results],
          next: action.payload.next,
        };
        break;
      case FILTER_DELETED_APPOINTMENT:
        draft.doctorAppointments = state.doctorAppointments.reduce(
          (acc, item) => {
            const appointments = item.appointments.filter(
              (appointment) => appointment.id !== action.payload.id
            );
            if (appointments.length) return [...acc, { ...item, appointments }];
            return acc;
          },
          []
        );
        draft.dateAppointments = state.dateAppointments
          .map((appointments) =>
            appointments.date === action.payload.date
              ? { ...appointments, total: appointments.total - 1 }
              : appointments
          )
          .filter((a) => a.total > 0);
        break;
      case SET_PATIENTS_LOADING_AUTOCOMPLETE:
        draft.patients.loading = action.payload;
        break;
      case RESET_PATIENTS_AUTOCOMPLETE:
        draft.patients = {
          ...draft.patients,
          all: [],
          next: null,
        };
        break;

      case SET_APPOINTMENTS_REMINDERS_PAGE:
        draft.appointmentsReminders = {
          ...state.appointmentsReminders,
          items: action.payload.results,
          count: action.payload.count,
          page: action.payload,
        };
        break;

      case SET_APPOINTMENTS_REMINDERS_PAGE_LOADING:
        draft.appointmentsReminders.loading = action.payload;
        break;
    }
  });
export default appointment;
