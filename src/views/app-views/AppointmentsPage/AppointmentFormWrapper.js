import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAppointmentStatus,
  getAppointmentTypes,
  getDoctors,
} from 'redux/actions/Appointment';
import {
  makeSelectAppointmentStatus,
  makeSelectAppointmentTypes,
  makeSelectClinicDoctors,
} from 'redux/selectors/Appointment';

const AppointmentFormWrapper = ({ isEditForm, Component, closeModal }) => {
  const dispatch = useDispatch();

  const { appointmentTypesLoading, appointmentTypes } = useSelector(
    makeSelectAppointmentTypes()
  );
  const { appointmentStatusLoading, appointmentStatus } = useSelector(
    makeSelectAppointmentStatus()
  );
  const { doctors, doctorsLoading } = useSelector(makeSelectClinicDoctors());

  useEffect(() => {
    if (!appointmentTypes.length) {
      dispatch(getAppointmentTypes());
    }
    if (!doctors.length) {
      dispatch(getDoctors());
    }
    if (isEditForm && !appointmentStatus.length) {
      dispatch(getAppointmentStatus());
    }
  }, []);

  return (
    <Component
      appointmentTypes={appointmentTypes}
      doctors={doctors}
      status={appointmentStatus}
      closeModal={closeModal}
      isDataLoading={
        !!appointmentTypesLoading ||
        !!appointmentStatusLoading ||
        !!doctorsLoading
      }
    />
  );
};

AppointmentFormWrapper.defaultProps = {
  isEditForm: false,
};

export default AppointmentFormWrapper;
