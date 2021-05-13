import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentFormModal from './AppointmentFormModal';
import messages from './messages';
import { useIntl } from 'react-intl';
import { updateAppointmentValidationSchema } from 'utils/validations';
import { message } from 'antd';
import { prepareAppointmentData } from 'utils/helpers';
import { updateAppointment } from 'redux/actions/Appointment';
import { makeSelectSingleAppointment } from 'redux/selectors/Appointment';
import moment from 'moment';
import { DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';
import { TIME_FORMAT_HH_MM } from 'constants/TimeConstant';
import {
  APPOINTMNET_HISTORY,
  SCHEDULED_APPOINTMENT,
} from 'constants/ClinicConstants';
import {
  getAppointmentHistory,
  getScheduledAppointments,
} from 'redux/actions/Patient';

const UpdateAppointment = ({
  appointmentTypes,
  doctors,
  status,
  closeModal,
  isDataLoading,
  patientId,
  appointment_type,
}) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const { appointment, singleLoading } = useSelector(
    makeSelectSingleAppointment()
  );

  const afterUpdate = () => {
    message.success(formatMessage(messages.appointmentUpdated));
    if (patientId)
      // eslint-disable-next-line default-case
      switch (appointment_type) {
        case APPOINTMNET_HISTORY:
          dispatch(getAppointmentHistory({ id: patientId }));
          break;
        case SCHEDULED_APPOINTMENT:
          dispatch(getScheduledAppointments({ id: patientId }));
          break;
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
        date: moment(appointment.date, 'DD/MM/YYYY').format(
          DATE_FORMAT_DD_MMM_YYYY
        ),
        time: moment(appointment.time, 'hh:mm a').format(TIME_FORMAT_HH_MM),
        status: appointment.status.id,
      }
    : {
        patient: '',
        doctor: '',
        appointmentType: '',
        price: 0,
        date: '',
        time: '',
        status: '',
      };

  return (
    <AppointmentFormModal
      title={formatMessage(messages.updateAppointmentTitle)}
      initialState={initialState}
      validationSchema={updateAppointmentValidationSchema}
      isEditForm
      doctors={doctors}
      appointmentTypes={appointmentTypes}
      appointmentStatus={status}
      closeModal={closeModal}
      handleSubmit={handleSubmit}
      loadingData={isDataLoading}
      loading={singleLoading}
      appointment={appointment}
    />
  );
};

export default UpdateAppointment;
