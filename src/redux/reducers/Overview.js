import { produce } from 'immer';
import {
  SET_OVERVIEW_SUMMARY_DATA,
  SET_OVERVIEW_CLINICSTATS_DATA,
  SET_OVERVIEW_SUMMARY_DATA_LOADING,
  SET_OVERVIEW_CLINICSTATS_DATA_LOADING,
  SET_OVERVIEW_KPI_FUNNEL_LOADING,
  SET_OVERVIEW_KPI_BOOKING_LOADING,
  SET_OVERVIEW_KPI_INTERVENTIONS_LOADING,
  SET_OVERVIEW_KPI_FUNNEL_DATA,
  SET_OVERVIEW_KPI_BOOKING_DATA,
  SET_OVERVIEW_KPI_INTERVENTIONS_DATA,
} from 'redux/constants/Overview';

const initialState = {
  loading: true,
  funnelLoading: true,
  bookingLoading: true,
  interventionsLoading: true,
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
  total_failed_messages_count: 0,
  total_patients_sent_message_status: 0,
  total_patients_engaged: 0,
  total_patients_read_but_no_response: 0,
  patients_waiting_added: 0,
  patients_booked: 0,

  open_conversations: 0,
  bookings: 0,
  booked_by_asa: 0,
  booked_asa: 0,
  booked_asa_assisted: 0,
  booked_human: 0,
  scheduled_asa: 0,
  scheduled_asa_assisted: 0,
  scheduled_human: 0,
  attended_asa: 0,
  attended_asa_assisted: 0,
  attended_human: 0,
  arrived_asa: 0,
  arrived_asa_assisted: 0,
  arrived_human: 0,
  cancelled_asa: 0,
  cancelled_asa_assisted: 0,
  cancelled_human: 0,
  reschedule_asa: 0,
  reschedule_asa_assisted: 0,
  reschedule_human: 0,
  non_attended_asa: 0,
  non_attended_asa_assisted: 0,
  non_attended_human: 0,
  reschedule: 0,
  cancelled: 0,
  attended: 0,
  non_attended: 0,
  walked_out: 0,
  quiet_sent_in: 0,
  sent_in: 0,
  arrived: 0,
  not_updated: 0,
  booking_time_distribution: {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0
  },

  declines: 0,
  opt_out: 0,
  snoozed: 0,
  emergency_situation: 0,
  human_intervention: 0,
  already_screened: 0,

  percentage_changes: {},


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

const mergePercentageChanges = (draft, next) => {
  draft.percentage_changes = {
    ...(draft.percentage_changes || {}),
    ...(next || {}),
  };
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
        draft.total_failed_messages_count = action.payload.total_failed_messages_count;
        draft.total_patients_sent_message_status = action.payload.total_patients_sent_message_status;
        draft.total_patients_engaged = action.payload.total_patients_engaged;
        draft.total_patients_read_but_no_response = action.payload.total_patients_read_but_no_response;
        draft.patients_waiting_added = action.payload.patients_waiting_added ?? 0;
        draft.patients_booked = action.payload.patients_booked;
        draft.open_conversations = action.payload.open_conversations;
        draft.snoozed = action.payload.snoozed;
        draft.bookings = action.payload.bookings;
        draft.booked_by_asa = action.payload.booked_by_asa;
        draft.booked_asa = action.payload.booked_asa ?? 0;
        draft.booked_asa_assisted = action.payload.booked_asa_assisted ?? 0;
        draft.booked_human = action.payload.booked_human ?? 0;
        draft.scheduled_asa = action.payload.scheduled_asa ?? 0;
        draft.scheduled_asa_assisted = action.payload.scheduled_asa_assisted ?? 0;
        draft.scheduled_human = action.payload.scheduled_human ?? 0;
        draft.attended_asa = action.payload.attended_asa ?? 0;
        draft.attended_asa_assisted = action.payload.attended_asa_assisted ?? 0;
        draft.attended_human = action.payload.attended_human ?? 0;
        draft.arrived_asa = action.payload.arrived_asa ?? 0;
        draft.arrived_asa_assisted = action.payload.arrived_asa_assisted ?? 0;
        draft.arrived_human = action.payload.arrived_human ?? 0;
        draft.cancelled_asa = action.payload.cancelled_asa ?? 0;
        draft.cancelled_asa_assisted = action.payload.cancelled_asa_assisted ?? 0;
        draft.cancelled_human = action.payload.cancelled_human ?? 0;
        draft.reschedule_asa = action.payload.reschedule_asa ?? 0;
        draft.reschedule_asa_assisted = action.payload.reschedule_asa_assisted ?? 0;
        draft.reschedule_human = action.payload.reschedule_human ?? 0;
        draft.non_attended_asa = action.payload.non_attended_asa ?? 0;
        draft.non_attended_asa_assisted = action.payload.non_attended_asa_assisted ?? 0;
        draft.non_attended_human = action.payload.non_attended_human ?? 0;
        draft.reschedule = action.payload.reschedule;
        draft.cancelled = action.payload.cancelled;
        draft.non_attended = action.payload.non_attended;
        draft.attended = action.payload.attended;
        draft.booking_time_distribution = action.payload.booking_time_distribution;
        draft.walked_out = action.payload.walked_out;
        draft.quiet_sent_in = action.payload.quiet_sent_in;
        draft.sent_in = action.payload.sent_in;
        draft.arrived = action.payload.arrived;
        draft.not_updated = action.payload.not_updated;
        draft.declines = action.payload.declines;
        draft.opt_out = action.payload.opt_out;
        draft.emergency_situation = action.payload.emergency_situation;
        draft.human_intervention = action.payload.human_intervention;
        draft.already_screened = action.payload.already_screened;
        draft.engagement_rate = action.payload.engagement_rate;
        draft.booking_rate = action.payload.booking_rate;
        draft.percentage_changes = action.payload.percentage_changes;
        break;
      case SET_OVERVIEW_KPI_FUNNEL_DATA: {
        const p = action.payload || {};
        draft.total_patients_added = p.total_patients_added;
        draft.total_patients_invited = p.total_patients_invited;
        draft.total_patients_engaged = p.total_patients_engaged;
        draft.patients_booked = p.patients_booked;
        draft.total_patients_read_but_no_response = p.total_patients_read_but_no_response;
        draft.patients_waiting_added = p.patients_waiting_added ?? 0;
        draft.total_failed_messages_count = p.total_failed_messages_count;
        draft.engagement_rate = p.engagement_rate;
        draft.booking_rate = p.booking_rate;
        if (p.booking_time_distribution) {
          draft.booking_time_distribution = p.booking_time_distribution;
        }
        mergePercentageChanges(draft, p.percentage_changes);
        break;
      }
      case SET_OVERVIEW_KPI_BOOKING_DATA: {
        const p = action.payload || {};
        draft.bookings = p.bookings;
        draft.patients_booked = p.patients_booked ?? draft.patients_booked;
        draft.booked_by_asa = p.booked_by_asa;
        draft.booked_asa = p.booked_asa ?? 0;
        draft.booked_asa_assisted = p.booked_asa_assisted ?? 0;
        draft.booked_human = p.booked_human ?? 0;
        draft.scheduled_asa = p.scheduled_asa ?? 0;
        draft.scheduled_asa_assisted = p.scheduled_asa_assisted ?? 0;
        draft.scheduled_human = p.scheduled_human ?? 0;
        draft.attended_asa = p.attended_asa ?? 0;
        draft.attended_asa_assisted = p.attended_asa_assisted ?? 0;
        draft.attended_human = p.attended_human ?? 0;
        draft.arrived_asa = p.arrived_asa ?? 0;
        draft.arrived_asa_assisted = p.arrived_asa_assisted ?? 0;
        draft.arrived_human = p.arrived_human ?? 0;
        draft.cancelled_asa = p.cancelled_asa ?? 0;
        draft.cancelled_asa_assisted = p.cancelled_asa_assisted ?? 0;
        draft.cancelled_human = p.cancelled_human ?? 0;
        draft.reschedule_asa = p.reschedule_asa ?? 0;
        draft.reschedule_asa_assisted = p.reschedule_asa_assisted ?? 0;
        draft.reschedule_human = p.reschedule_human ?? 0;
        draft.non_attended_asa = p.non_attended_asa ?? 0;
        draft.non_attended_asa_assisted = p.non_attended_asa_assisted ?? 0;
        draft.non_attended_human = p.non_attended_human ?? 0;
        draft.attended = p.attended;
        draft.non_attended = p.non_attended;
        draft.cancelled = p.cancelled;
        draft.reschedule = p.reschedule;
        draft.arrived = p.arrived;
        draft.sent_in = p.sent_in;
        draft.quiet_sent_in = p.quiet_sent_in;
        draft.walked_out = p.walked_out;
        draft.not_updated = p.not_updated;
        if (p.booking_time_distribution) {
          draft.booking_time_distribution = p.booking_time_distribution;
        }
        break;
      }
      case SET_OVERVIEW_KPI_INTERVENTIONS_DATA: {
        const p = action.payload || {};
        draft.declines = p.declines;
        draft.snoozed = p.snoozed;
        draft.opt_out = p.opt_out;
        draft.human_intervention = p.human_intervention;
        draft.emergency_situation = p.emergency_situation;
        draft.already_screened = p.already_screened;
        mergePercentageChanges(draft, p.percentage_changes);
        break;
      }
      case SET_OVERVIEW_CLINICSTATS_DATA_LOADING:
        draft.loading = action.payload;
        break;
      case SET_OVERVIEW_KPI_FUNNEL_LOADING:
        draft.funnelLoading = action.payload;
        draft.loading = draft.funnelLoading || draft.bookingLoading || draft.interventionsLoading;
        break;
      case SET_OVERVIEW_KPI_BOOKING_LOADING:
        draft.bookingLoading = action.payload;
        draft.loading = draft.funnelLoading || draft.bookingLoading || draft.interventionsLoading;
        break;
      case SET_OVERVIEW_KPI_INTERVENTIONS_LOADING:
        draft.interventionsLoading = action.payload;
        draft.loading = draft.funnelLoading || draft.bookingLoading || draft.interventionsLoading;
        break;
      case SET_OVERVIEW_SUMMARY_DATA_LOADING:
        draft.loading = action.payload;
        break;
    }
  });

export default chats;
