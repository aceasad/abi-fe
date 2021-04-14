import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectAppointmentDomain = (state) => state.appointment || reducers;

const makeSelectDoctorAppointments = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    doctorAppointments: substate.doctorAppointments,
    loading: substate.loading,
  }));

const makeSelectDateAppointments = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    dateAppointments: substate.dateAppointments,
    appointmentsCount: substate.doctorAppointments.reduce(
      (acc, item) => acc + item.appointments.length,
      0
    ),
  }));

const makeSelectSingleAppointment = () =>
  createSelector(selectAppointmentDomain, (substate) => ({
    appointment: substate.appointment,
    singleLoading: substate.singleLoading,
  }));

export {
  makeSelectDoctorAppointments,
  makeSelectDateAppointments,
  makeSelectSingleAppointment,
};
