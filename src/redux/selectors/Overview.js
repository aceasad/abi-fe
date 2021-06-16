import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectOverviewDomain = (state) => state.overview || reducers;

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
};
