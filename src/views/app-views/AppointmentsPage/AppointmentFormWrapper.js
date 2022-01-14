import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAppointmentTypes,
  getDoctors,
  getAppointmentStatuses,
  getAppointmentCommunicationStatuses,
  getAppointmentMissingReasons,
  getAppointmentCancellationReasons,
} from 'redux/actions/Appointment';
import {
  makeSelectAppointmentTypes,
  makeSelectClinicDoctors,
  makeSelectAppointmentStatuses,
  makeSelectAppointmentCommunicationStatuses,
  makeSelectAppointmentMissingReasons,
  makeSelectAppointmentCancellationReasons,
} from 'redux/selectors/Appointment';

const AppointmentFormWrapper = ({ isEditForm, Component, closeModal }) => {
  const dispatch = useDispatch();

  const { appointmentTypesLoading, appointmentTypes } = useSelector(
    makeSelectAppointmentTypes()
  );
  const { doctors, doctorsLoading } = useSelector(makeSelectClinicDoctors());
  const { appointmentStatusLoading, appointmentStatuses } = useSelector(
    makeSelectAppointmentStatuses()
  );
  const {
    appointmentCommunicationStatusesLoading,
    appointmentCommunicationStatuses,
  } = useSelector(makeSelectAppointmentCommunicationStatuses());
  const {
    appointmentMissingReasonsLoading,
    appointmentMissingReasons,
  } = useSelector(makeSelectAppointmentMissingReasons());
  const {
    appointmentCancellationReasonsLoading,
    appointmentCancellationReasons,
  } = useSelector(makeSelectAppointmentCancellationReasons());

  useEffect(() => {
    if (!appointmentTypes?.length) {
      dispatch(getAppointmentTypes());
    }
  }, [dispatch, isEditForm, appointmentTypes?.length]);

  useEffect(() => {
    if (!doctors?.length) {
      dispatch(getDoctors());
    }
  }, [dispatch, doctors?.length]);

  useEffect(() => {
    if (isEditForm && !appointmentStatuses?.length) {
      dispatch(getAppointmentStatuses());
    }
  }, [dispatch, isEditForm, appointmentStatuses?.length]);

  useEffect(() => {
    if (isEditForm && !appointmentCommunicationStatuses?.length) {
      dispatch(getAppointmentCommunicationStatuses());
    }
  }, [dispatch, isEditForm, appointmentCommunicationStatuses?.length]);

  useEffect(() => {
    if (isEditForm && !appointmentMissingReasons?.length) {
      dispatch(getAppointmentMissingReasons());
    }
  }, [dispatch, isEditForm, appointmentMissingReasons?.length]);

  useEffect(() => {
    if (isEditForm && !appointmentCancellationReasons?.length) {
      dispatch(getAppointmentCancellationReasons());
    }
  }, [dispatch, isEditForm, appointmentCancellationReasons?.length]);

  return (
    <Component
      appointmentTypes={appointmentTypes}
      doctors={doctors}
      appointmentStatuses={appointmentStatuses}
      appointmentCommunicationStatuses={appointmentCommunicationStatuses}
      appointmentMissingReasons={appointmentMissingReasons}
      appointmentCancellationReasons={appointmentCancellationReasons}
      closeModal={closeModal}
      isDataLoading={
        !!appointmentTypesLoading ||
        !!doctorsLoading ||
        !!appointmentStatusLoading ||
        !!appointmentCommunicationStatusesLoading ||
        !!appointmentMissingReasonsLoading ||
        !!appointmentCancellationReasonsLoading
      }
    />
  );
};

AppointmentFormWrapper.defaultProps = {
  isEditForm: false,
};

export default AppointmentFormWrapper;
