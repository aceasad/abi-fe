import {
  SET_DOCTOR_APPOINTMENTS,
  SET_DATE_APPOINTMENTS,
  SET_IS_LOADING,
  SET_SINGLE_APPOINTMENT,
  SET_SINGLE_APPOINTMENT_LOADING,
} from '../constants/Appointment';
import produce from 'immer';

const initialState = {
  doctorAppointments: [],
  dateAppointments: [],
  loading: false,
  appointment: null,
  singleLoading: false,
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
    }
  });
export default appointment;
