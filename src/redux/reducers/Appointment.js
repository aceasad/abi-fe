import {
  SET_DOCTOR_APPOINTMENTS,
  SET_DATE_APPOINTMENTS,
  SET_IS_LOADING,
  SET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT_LOADING,
  SET_LOADING_DOCTORS,
  APPEND_TO_ALL_DOCTORS,
  SET_APPOINTMENT_TYPES_LOADING,
  APPEND_TO_APPOINTMENT_TYPES,
  SET_APPOINTMENT_STATUS_LOADING,
  APPEND_TO_APPOINTMENT_STATUS,
  FILTER_DELETED_APPOINTMENT,
  SET_MISSING_REASONS,
  SET_ENDED_APPOINTMENT,
  SET_PATIENTS_AUTOCOMPLETE,
  SET_PATIENTS_LOADING_AUTOCOMPLETE,
  RESET_PATIENTS_AUTOCOMPLETE,
} from '../constants/Appointment';
import produce from 'immer';

const initialState = {
  doctorAppointments: [],
  dateAppointments: [],
  loading: false,
  appointment: null,
  singleLoading: false,
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
  appointmentStatus: [],
  appointmentStatusLoading: false,
  missingReasons: [],
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
      case SET_APPOINTMENT_TYPES_LOADING:
        draft.appointmentTypesLoading = action.payload;
        break;
      case APPEND_TO_APPOINTMENT_TYPES:
        draft.appointmentTypes = [
          ...draft.appointmentTypes,
          ...action.payload.results,
        ];
        break;
      case SET_APPOINTMENT_STATUS_LOADING:
        draft.appointmentStatusLoading = action.payload;
        break;
      case APPEND_TO_APPOINTMENT_STATUS:
        draft.appointmentStatus = [
          ...draft.appointmentStatus,
          ...action.payload.results,
        ];
        break;
      case SET_PATIENTS_AUTOCOMPLETE:
        draft.patients = {
          ...draft.patients,
          all: [...action.payload.results],
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
      case SET_MISSING_REASONS:
        draft.missingReasons = action.payload;
        break;
      case SET_ENDED_APPOINTMENT:
        draft.appointment = {
          ...state.appointment,
          ...action.payload.data,
          missing_reason: action.payload?.missing_reason?.name,
        };
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
    }
  });
export default appointment;
