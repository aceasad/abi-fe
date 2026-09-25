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
    total_patients_sent_message_status: substate.total_patients_sent_message_status,
    total_patients_engaged: substate.total_patients_engaged,
    total_patients_read_but_no_response: substate.total_patients_read_but_no_response,
    patients_waiting_added: substate.patients_waiting_added,
    patients_booked: substate.patients_booked,
    open_conversations: substate.open_conversations,
    bookings: substate.bookings,
    booked_by_asa: substate.booked_by_asa,
    booked_asa: substate.booked_asa,
    booked_asa_assisted: substate.booked_asa_assisted,
    booked_human: substate.booked_human,
    booked_unknown: substate.booked_unknown,
    patients_asa: substate.patients_asa,
    patients_asa_assisted: substate.patients_asa_assisted,
    patients_human: substate.patients_human,
    patients_unknown: substate.patients_unknown,
    scheduled_asa: substate.scheduled_asa,
    scheduled_asa_assisted: substate.scheduled_asa_assisted,
    scheduled_human: substate.scheduled_human,
    attended_asa: substate.attended_asa,
    attended_asa_assisted: substate.attended_asa_assisted,
    attended_human: substate.attended_human,
    arrived_asa: substate.arrived_asa,
    arrived_asa_assisted: substate.arrived_asa_assisted,
    arrived_human: substate.arrived_human,
    cancelled_asa: substate.cancelled_asa,
    cancelled_asa_assisted: substate.cancelled_asa_assisted,
    cancelled_human: substate.cancelled_human,
    reschedule_asa: substate.reschedule_asa,
    reschedule_asa_assisted: substate.reschedule_asa_assisted,
    reschedule_human: substate.reschedule_human,
    non_attended_asa: substate.non_attended_asa,
    non_attended_asa_assisted: substate.non_attended_asa_assisted,
    non_attended_human: substate.non_attended_human,
    reschedule: substate.reschedule,
    cancelled: substate.cancelled,
    non_attended: substate.non_attended,
    attended: substate.attended,
    not_on_whatsapp: substate.not_on_whatsapp,
    walked_out: substate.walked_out,
    quiet_sent_in: substate.quiet_sent_in,
    sent_in: substate.sent_in,
    arrived: substate.arrived,
    not_updated: substate.not_updated,
    booking_time_distribution: substate.booking_time_distribution,
    declines: substate.declines,
    opt_out: substate.opt_out,
    snoozed: substate.snoozed,
    emergency_situation: substate.emergency_situation,
    human_intervention: substate.human_intervention,
    already_screened: substate.already_screened,
    booking_rate: substate.booking_rate,
    booking_rate_of_invited: substate.booking_rate_of_invited,
    booking_rate_of_engaged: substate.booking_rate_of_engaged,
    booking_rate_asa: substate.booking_rate_asa,
    booking_rate_asa_assisted: substate.booking_rate_asa_assisted,
    booking_rate_human: substate.booking_rate_human,
    asa_booking_share: substate.asa_booking_share,
    after_hours_bookings: substate.after_hours_bookings,
    after_hours_share: substate.after_hours_share,
    after_hours_asa: substate.after_hours_asa,
    after_hours_asa_assisted: substate.after_hours_asa_assisted,
    after_hours_human: substate.after_hours_human,
    total_messages_sent: substate.total_messages_sent,
    total_messages_received: substate.total_messages_received,
    reminders_scheduled: substate.reminders_scheduled,
    reminders_sent: substate.reminders_sent,
    reminders_failed: substate.reminders_failed,
    reminders_sent_patients_responded: substate.reminders_sent_patients_responded,
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
