import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectOverviewDomain = (state) => state.overview || reducers;

const makeSelectClinicStatsData = createSelector(
  selectOverviewDomain,
  (substate) => ({
    total_patients_added: substate.total_patients_added,
    total_patients_invited: substate.total_patients_invited,
    total_patients_failed_message_status: substate.total_patients_failed_message_status,
    total_patients_sent_message_status: substate.total_patients_sent_message_status,
    total_patients_engaged: substate.total_patients_engaged,
    total_patients_read_but_no_response: substate.total_patients_read_but_no_response,
    open_conversations: substate.open_conversations,
    bookings: substate.bookings,
    reschedule: substate.reschedule,
    cancelled: substate.cancelled,
    non_attended: substate.non_attended,
    attended: substate.attended,
    not_on_whatsapp: substate.not_on_whatsapp,
    booking_time_distribution: substate.booking_time_distribution,
    declines: substate.declines,
    opt_out: substate.opt_out,
    snoozed: substate.snoozed,
    emergency_situation: substate.emergency_situation,
    human_intervention: substate.human_intervention,
    already_screened: substate.already_screened,
    booking_rate: substate.booking_rate,
    engagement_rate: substate.engagement_rate,
    percentage_changes: substate.percentage_changes,
    loading: substate.loading,
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
