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
  total_patients_engaged: 0,
  total_patients_read_but_no_response: 0,
  patients_booked: 0,
  funnel_stages: [],

  open_conversations: 0,
  bookings: 0,
  booked_asa: 0,
  booked_human: 0,
  booked_asa_end_to_end: 0,
  booked_human_started: 0,
  booked_staff_managed: 0,
  booked_asa_end_to_end_percent: 0,
  booked_human_started_percent: 0,
  booked_staff_managed_percent: 0,
  staff_messages_sent: 0,
  staff_rescheduled_by_asa: 0,
  status_scheduled: 0,
  status_attended: 0,
  status_no_show: 0,
  status_cancelled: 0,
  status_outcome_pending: 0,
  status_scheduled_percent: 0,
  status_attended_percent: 0,
  status_no_show_percent: 0,
  status_cancelled_percent: 0,
  status_outcome_pending_percent: 0,
  attendance_rate: 0,
  billed_appointments: 0,
  engaged_who_booked: 0,
  after_hours_bookings: 0,
  after_hours_share: 0,
  handled_without_human_rate: 0,
  handled_without_human_numerator: 0,
  handled_without_human_denominator: 0,
  reschedule: 0,
  cancelled: 0,
  attended: 0,
  non_attended: 0,
  not_updated: 0,

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
      case SET_OVERVIEW_CLINICSTATS_DATA: {
        const p = action.payload || {};
        draft.total_patients_added = p.total_patients_added;
        draft.total_patients_invited = p.total_patients_invited;
        draft.total_patients_failed_message_status = p.total_patients_failed_message_status;
        draft.total_failed_messages_count = p.total_failed_messages_count;
        draft.total_patients_engaged = p.total_patients_engaged;
        draft.total_patients_read_but_no_response = p.total_patients_read_but_no_response;
        draft.patients_booked = p.patients_booked;
        draft.open_conversations = p.open_conversations;
        draft.snoozed = p.snoozed;
        draft.bookings = p.bookings;
        draft.booked_asa = p.booked_asa ?? 0;
        draft.booked_human = p.booked_human ?? 0;
        draft.booked_asa_end_to_end = p.booked_asa_end_to_end ?? 0;
        draft.booked_human_started = p.booked_human_started ?? 0;
        draft.booked_staff_managed = p.booked_staff_managed ?? 0;
        draft.staff_messages_sent = p.staff_messages_sent ?? 0;
        draft.staff_rescheduled_by_asa = p.staff_rescheduled_by_asa ?? 0;
        draft.status_scheduled = p.status_scheduled ?? 0;
        draft.status_attended = p.status_attended ?? 0;
        draft.status_no_show = p.status_no_show ?? 0;
        draft.status_cancelled = p.status_cancelled ?? 0;
        draft.status_outcome_pending = p.status_outcome_pending ?? 0;
        draft.attendance_rate = p.attendance_rate ?? 0;
        draft.billed_appointments = p.billed_appointments ?? 0;
        draft.engaged_who_booked = p.engaged_who_booked ?? 0;
        draft.reschedule = p.reschedule;
        draft.cancelled = p.cancelled;
        draft.non_attended = p.non_attended;
        draft.attended = p.attended;
        draft.not_updated = p.not_updated;
        draft.declines = p.declines;
        draft.opt_out = p.opt_out;
        draft.emergency_situation = p.emergency_situation;
        draft.human_intervention = p.human_intervention;
        draft.already_screened = p.already_screened;
        draft.engagement_rate = p.engagement_rate;
        draft.booking_rate = p.booking_rate;
        draft.after_hours_bookings = p.after_hours_bookings ?? 0;
        draft.after_hours_share = p.after_hours_share ?? 0;
        draft.percentage_changes = p.percentage_changes;
        break;
      }
      case SET_OVERVIEW_KPI_FUNNEL_DATA: {
        const p = action.payload || {};
        draft.total_patients_added = p.total_patients_added;
        draft.total_patients_invited = p.total_patients_invited;
        draft.total_patients_engaged = p.total_patients_engaged;
        draft.patients_booked = p.patients_booked;
        draft.funnel_stages = p.funnel_stages || [];
        draft.total_patients_read_but_no_response = p.total_patients_read_but_no_response;
        draft.total_failed_messages_count = p.total_failed_messages_count;
        draft.total_patients_failed_message_status = p.total_patients_failed_message_status
          ?? draft.total_patients_failed_message_status;
        draft.engaged_who_booked = p.engaged_who_booked ?? 0;
        draft.engagement_rate = p.engagement_rate;
        draft.booking_rate = p.booking_rate;
        draft.after_hours_bookings = p.after_hours_bookings ?? 0;
        draft.after_hours_share = p.after_hours_share ?? 0;
        if (p.booked_asa != null) {
          draft.booked_asa = p.booked_asa;
        }
        draft.handled_without_human_rate = p.handled_without_human_rate ?? 0;
        draft.handled_without_human_numerator = p.handled_without_human_numerator ?? 0;
        draft.handled_without_human_denominator = p.handled_without_human_denominator ?? 0;
        mergePercentageChanges(draft, p.percentage_changes);
        break;
      }
      case SET_OVERVIEW_KPI_BOOKING_DATA: {
        const p = action.payload || {};
        draft.bookings = p.bookings;
        draft.patients_booked = p.patients_booked ?? draft.patients_booked;
        draft.booked_asa = p.booked_asa ?? 0;
        draft.booked_human = p.booked_human ?? 0;
        draft.booked_asa_end_to_end = p.booked_asa_end_to_end ?? 0;
        draft.booked_human_started = p.booked_human_started ?? 0;
        draft.booked_staff_managed = p.booked_staff_managed ?? 0;
        draft.booked_asa_end_to_end_percent = p.booked_asa_end_to_end_percent ?? 0;
        draft.booked_human_started_percent = p.booked_human_started_percent ?? 0;
        draft.booked_staff_managed_percent = p.booked_staff_managed_percent ?? 0;
        draft.staff_messages_sent = p.staff_messages_sent ?? 0;
        draft.staff_rescheduled_by_asa = p.staff_rescheduled_by_asa ?? 0;
        draft.status_scheduled = p.status_scheduled ?? 0;
        draft.status_attended = p.status_attended ?? 0;
        draft.status_no_show = p.status_no_show ?? 0;
        draft.status_cancelled = p.status_cancelled ?? 0;
        draft.status_outcome_pending = p.status_outcome_pending ?? 0;
        draft.status_scheduled_percent = p.status_scheduled_percent ?? 0;
        draft.status_attended_percent = p.status_attended_percent ?? 0;
        draft.status_no_show_percent = p.status_no_show_percent ?? 0;
        draft.status_cancelled_percent = p.status_cancelled_percent ?? 0;
        draft.status_outcome_pending_percent = p.status_outcome_pending_percent ?? 0;
        draft.attendance_rate = p.attendance_rate ?? 0;
        draft.billed_appointments = p.billed_appointments ?? 0;
        draft.attended = p.attended;
        draft.non_attended = p.non_attended;
        draft.cancelled = p.cancelled;
        draft.reschedule = p.reschedule;
        draft.not_updated = p.not_updated;
        if (p.after_hours_bookings != null) {
          draft.after_hours_bookings = p.after_hours_bookings;
        }
        if (p.after_hours_share != null) {
          draft.after_hours_share = p.after_hours_share;
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
