import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectOverviewDomain = (state) => state.overview || reducers;

const makeSelectClinicStatsData = createSelector(
  selectOverviewDomain,
  (substate) => ({
    total_patients_added: substate.total_patients_added,
    total_patients_invited: substate.total_patients_invited,
    total_patients_failed_message_status: substate.total_patients_failed_message_status,
    total_failed_messages_count: substate.total_failed_messages_count,
    total_patients_engaged: substate.total_patients_engaged,
    total_patients_read_but_no_response: substate.total_patients_read_but_no_response,
    patients_booked: substate.patients_booked,
    funnel_stages: substate.funnel_stages,
    open_conversations: substate.open_conversations,
    bookings: substate.bookings,
    booked_asa: substate.booked_asa,
    booked_human: substate.booked_human,
    booked_asa_end_to_end: substate.booked_asa_end_to_end,
    booked_human_started: substate.booked_human_started,
    booked_staff_managed: substate.booked_staff_managed,
    booked_asa_end_to_end_percent: substate.booked_asa_end_to_end_percent,
    booked_human_started_percent: substate.booked_human_started_percent,
    booked_staff_managed_percent: substate.booked_staff_managed_percent,
    staff_messages_sent: substate.staff_messages_sent,
    staff_rescheduled_by_asa: substate.staff_rescheduled_by_asa,
    status_scheduled: substate.status_scheduled,
    status_attended: substate.status_attended,
    status_no_show: substate.status_no_show,
    status_cancelled: substate.status_cancelled,
    status_outcome_pending: substate.status_outcome_pending,
    status_scheduled_percent: substate.status_scheduled_percent,
    status_attended_percent: substate.status_attended_percent,
    status_no_show_percent: substate.status_no_show_percent,
    status_cancelled_percent: substate.status_cancelled_percent,
    status_outcome_pending_percent: substate.status_outcome_pending_percent,
    attendance_rate: substate.attendance_rate,
    taken_place: substate.taken_place,
    no_show_of_taken_place_percent: substate.no_show_of_taken_place_percent,
    billed_appointments: substate.billed_appointments,
    engaged_who_booked: substate.engaged_who_booked,
    reschedule: substate.reschedule,
    cancelled: substate.cancelled,
    non_attended: substate.non_attended,
    attended: substate.attended,
    not_updated: substate.not_updated,
    declines: substate.declines,
    opt_out: substate.opt_out,
    snoozed: substate.snoozed,
    emergency_situation: substate.emergency_situation,
    human_intervention: substate.human_intervention,
    already_screened: substate.already_screened,
    booking_rate: substate.booking_rate,
    after_hours_bookings: substate.after_hours_bookings,
    after_hours_share: substate.after_hours_share,
    handled_without_human_rate: substate.handled_without_human_rate,
    handled_without_human_numerator: substate.handled_without_human_numerator,
    handled_without_human_denominator: substate.handled_without_human_denominator,
    engagement_rate: substate.engagement_rate,
    percentage_changes: substate.percentage_changes,
    loading: substate.loading,
    funnelLoading: substate.funnelLoading,
    bookingLoading: substate.bookingLoading,
    interventionsLoading: substate.interventionsLoading,
  })
);

const makeSelectBookingData = createSelector(
  selectOverviewDomain,
  (substate) => ({
    bookingEfficiency: substate.bookingEfficiency,
    bookingMadeAfterInvite: substate.bookingMadeAfterInvite,
    invitationRate: substate.invitationRate,
    loading: substate.loading,
  })
);

const makeSelectAsaData = createSelector(selectOverviewDomain, (substate) => ({
  asaEfficiency: substate.asaEfficiency,
  revenueSaved: substate.revenueSaved,
  loading: substate.loading,
}));

const makeSelectAppointmentData = createSelector(
  selectOverviewDomain,
  (substate) => ({
    missedAppointmentsScreening: substate.missedAppointmentsScreening,
    costOfMissedAppointments: substate.costOfMissedAppointments,
    loading: substate.loading,
  })
);

const makeSelectUptakeData = createSelector(
  selectOverviewDomain,
  (substate) => ({
    coverage: substate.coverage,
    coverageAverage: substate.coverageAverage,
    uptake: substate.uptake,
    uptakeAverage: substate.uptakeAverage,
    loading: substate.loading,
  })
);

const makeSelectPreferencesData = createSelector(
  selectOverviewDomain,
  (substate) => ({
    preferences: substate.preferences,
    loading: substate.loading,
  })
);

export {
  makeSelectBookingData,
  makeSelectAsaData,
  makeSelectAppointmentData,
  makeSelectPreferencesData,
  makeSelectUptakeData,
  makeSelectClinicStatsData,
};
