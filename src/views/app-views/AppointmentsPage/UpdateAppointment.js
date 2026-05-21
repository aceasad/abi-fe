import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentFormModal from './AppointmentFormModal';
import { updateAppointmentValidationSchema } from 'utils/validations';
import { message } from 'antd';
import { prepareAppointmentData } from 'utils/helpers';
import { updateAppointment } from 'redux/actions/Appointment';
import { makeSelectSingleAppointment } from 'redux/selectors/Appointment';
import dayjs from 'utils/dayjs';
import { DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';
import { TIME_FORMAT_HH_MM } from 'constants/TimeConstant';
import {
  APPOINTMENT_HISTORY,
  FROM_PATIENT_APPOINTMENTS,
  FROM_STAFF_APPOINTMENTS,
  SCHEDULED_APPOINTMENT,
} from 'constants/ClinicConstants';
import { HISTORY, SCHEDULED } from 'redux/reducers/Staff';
import {
  getAppointmentHistory,
  getScheduledAppointments,
} from 'redux/actions/Patient';
import { getAppointments } from 'redux/actions/Staff';

const UpdateAppointment = ({
  doctors,
  appointmentTypes,
  appointmentStatuses,
  appointmentCommunicationStatuses,
  appointmentMissingReasons,
  appointmentCancellationReasons,
  closeModal,
  isDataLoading,
  patientId,
  appointment_type,
  staffId,
  updateFrom = null,
}) => {
  const dispatch = useDispatch();

  const { appointment, singleLoading } = useSelector(
    makeSelectSingleAppointment()
  );

  const afterUpdate = () => {
    message.success("Appointment updated");
    if (updateFrom === FROM_STAFF_APPOINTMENTS) {
      // eslint-disable-next-line default-case
      switch (appointment_type) {
        // those are when appointment is updated from the Staff Appointments List
        case SCHEDULED:
          dispatch(getAppointments({ id: staffId, field: SCHEDULED }));
          break;
        case HISTORY:
          dispatch(getAppointments({ id: staffId, field: HISTORY }));
          break;
      }
    } else if (updateFrom === FROM_PATIENT_APPOINTMENTS) {
      switch (appointment_type) {
        case APPOINTMENT_HISTORY:
          dispatch(getAppointmentHistory({ id: patientId }));
          break;
        case SCHEDULED_APPOINTMENT:
          dispatch(getScheduledAppointments({ id: patientId }));
          break;
      }
    }
    closeModal();
  };

  const afterError = (msg) => {
    message.error(msg);
  };

  const handleSubmit = (values, { setFieldValue }) => {
    const preparedData = prepareAppointmentData(values);
    dispatch(
      updateAppointment({
        data: preparedData,
        id: appointment.id,
        afterUpdate,
        afterError,
        setFieldValue,
      })
    );
  };

  const initialState = appointment
    ? {
      patient: appointment.patient.id,
      doctor: appointment.doctor.id,
      appointmentType: appointment.appointment_type.id,
      price: appointment.price,
      date: dayjs(appointment.date, 'DD/MM/YYYY').format(
        DATE_FORMAT_DD_MMM_YYYY
      ),
      time: dayjs(appointment.time, 'hh:mm a').format(TIME_FORMAT_HH_MM),
      status: appointment.status.id,
      communication_status: appointment.communication_status?.id,
      communication_status_details: appointment.communication_status_details,
      missing_reason: appointment.missing_reason?.id,
      missing_reason_details: appointment.missing_reason_details,
      cancellation_reason: appointment.cancellation_reason?.id,
      cancellation_reason_details: appointment.cancellation_reason_details,
    }
    : {
      patient: '',
      doctor: '',
      appointmentType: '',
      price: 0,
      date: '',
      time: '',
      status: '',
      communication_status: '',
      communication_status_details: '',
      missing_reason: '',
      missing_reason_details: '',
      cancellation_reason: '',
      cancellation_reason_details: '',
    };

  return (
    <AppointmentFormModal
      title={"Edit appointment"}
      initialState={initialState}
      validationSchema={updateAppointmentValidationSchema}
      isEditForm
      doctors={doctors}
      appointmentTypes={appointmentTypes}
      appointmentStatuses={appointmentStatuses}
      appointmentCommunicationStatuses={appointmentCommunicationStatuses}
      appointmentMissingReasons={appointmentMissingReasons}
      appointmentCancellationReasons={appointmentCancellationReasons}
      closeModal={closeModal}
      handleSubmit={handleSubmit}
      loadingData={isDataLoading}
      loading={singleLoading}
      appointment={appointment}
    />
  );
};

export default UpdateAppointment;
