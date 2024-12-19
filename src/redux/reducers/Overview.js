import produce from 'immer';
import {
  SET_OVERVIEW_SUMMARY_DATA,
  SET_OVERVIEW_CLINICSTATS_DATA,
  SET_OVERVIEW_SUMMARY_DATA_LOADING,
} from 'redux/constants/Overview';

const initialState = {
  loading: true,
  bookingEfficiency: 0,
  bookingMadeAfterInvite: 0,
  invitationRate: 0,
  asaEfficiency: 0,
  revenueSaved: 0,
  missedAppointmentsScreening: '',
  costOfMissedAppointments: 0,
  uptake: 0,
  uptakeAverage: 0,
  coverage: 0,
  coverageAverage: 0,
  patients_enrolled: 0,
  already_screened:0,
  open_conversations:0,
  bookings:0,
  declines:0,
  preferences: {
    byDay: {
      monday: 0,
      tuesday: 0,
      wednsesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    },
    byPeriod: {
      morning: 0,
      afternoon: 0,
      evening: 0,
    },
  },
};

/* eslint-disable default-case */
const chats = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_OVERVIEW_SUMMARY_DATA:
        draft.bookingEfficiency = action.payload.booking_efficiency;
        draft.bookingMadeAfterInvite = action.payload.booking_made_after_invite;
        draft.invitationRate = action.payload.invitation_rate;
        draft.asaEfficiency = action.payload.asa_efficiency;
        draft.revenueSaved = action.payload.revenue_saved;
        draft.missedAppointmentsScreening =
          action.payload.missed_appointments_screening;
        draft.costOfMissedAppointments =
          action.payload.cost_of_missed_appointments;
        draft.coverage = action.payload.coverage;
        draft.coverageAverage = action.payload.coverage_average;
        draft.uptake = action.payload.uptake;
        draft.uptakeAverage = action.payload.uptake_average;
        draft.preferences = {
          byDay: action.payload.preferences.by_day,
          byPeriod: action.payload.preferences.by_period,
        };
        break;
      case SET_OVERVIEW_CLINICSTATS_DATA:
        draft.patients_enrolled = action.payload.patients_enrolled;
        draft.already_screened = action.payload.already_screened;
        draft.open_conversations = action.payload.open_conversations;
        draft.bookings = action.payload.bookings;
        draft.declines = action.payload.declines;
        break;
      case SET_OVERVIEW_SUMMARY_DATA_LOADING:
        draft.loading = action.payload;
        break;
    }
  });

export default chats;
