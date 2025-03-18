import { m } from 'framer-motion';
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

  engagement_rate: 0,
  booking_rate: 0,

  total_patients_added: 0,
  total_patients_invited: 0,
  total_patients_failed_message_status: 0,
  total_patients_sent_message_status: 0,
  total_patients_engaged: 0,
  total_patients_read_but_no_response: 0,


  open_conversations: 0,
  bookings: 0,
  reschedule: 0,
  cancelled: 0,
  attended: 0,
  non_attended: 0,
  booking_time_distribution: {
    morning: 0,
    afternook: 0,
    evening: 0,
    night: 0
  },

  declines: 0,
  opt_out: 0,
  snoozed: 0,
  emergency_situation: 0,
  human_intervention: 0,
  already_screened: 0,


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
        draft.total_patients_added = action.payload.total_patients_added;
        draft.total_patients_invited = action.payload.total_patients_invited;
        draft.total_patients_failed_message_status = action.payload.total_patients_failed_message_status;
        draft.total_patients_sent_message_status = action.payload.total_patients_sent_message_status;
        draft.total_patients_engaged = action.payload.total_patients_engaged;
        draft.total_patients_read_but_no_response = action.payload.total_patients_read_but_no_response;
        draft.open_conversations = action.payload.open_conversations;
        draft.snoozed = action.payload.snoozed;
        draft.bookings = action.payload.bookings;
        draft.reschedule = action.payload.reschedule;
        draft.cancelled = action.payload.cancelled;
        draft.non_attended = action.payload.non_attended;
        draft.attended = action.payload.attended;
        draft.non_attended = action.payload.non_attended;
        draft.booking_time_distribution = action.payload.booking_time_distribution;
        draft.declines = action.payload.declines;
        draft.opt_out = action.payload.opt_out;
        draft.emergency_situation = action.payload.emergency_situation;
        draft.human_intervention = action.payload.human_intervention;
        draft.already_screened = action.payload.already_screened;
        draft.engagement_rate = action.payload.engagement_rate;
        draft.booking_rate = action.payload.booking_rate;
        break;
      case SET_OVERVIEW_SUMMARY_DATA_LOADING:
        draft.loading = action.payload;
        break;
    }
  });

export default chats;
