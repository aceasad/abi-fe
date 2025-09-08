import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentFormModal from './AppointmentFormModal';
import AppointmentPASFormModal from './AppointmentPASFormModal'
import messages from './messages';
import { useIntl } from 'react-intl';
import { createAppointmentValidationSchema, createPASAppointmentValidationSchema } from 'utils/validations';
import { message } from 'antd';
import { getYearAndMonth, prepareAppointmentData } from 'utils/helpers';
import {
  createAppointment,
  getDateAppointments,
  getDoctorAppointments,
} from 'redux/actions/Appointment';
import { makeSelectSingleAppointment } from 'redux/selectors/Appointment';
import dayjs from 'utils/dayjs';
import { DATE_FORMAT_YYYY_MM_DD } from 'constants/DateConstant';
import { setScheduledPage } from 'redux/actions/Patient';

const CreateAppointment = ({
  appointmentTypes,
  doctors,
  closeModal,
  isDataLoading,
  patient_full_name = '',
  patient_id = '',
  isCalendar = true,
}) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { isPasIntegrated } = useSelector(state => state.auth.user);

  const afterCreate = (newAppointmentStartDatetime) => {
    message.success(formatMessage(messages.newAppointmentCreated));
    closeModal();
    if (isCalendar) {
      dispatch(
        getDoctorAppointments(
          dayjs(newAppointmentStartDatetime).format(DATE_FORMAT_YYYY_MM_DD)
        )
      );
      dispatch(
        getDateAppointments(getYearAndMonth(newAppointmentStartDatetime))
      );
    } else dispatch(setScheduledPage({ page: 1, id: patient_id }));
  };

  const afterError = (msg) => {
    message.error(msg);
  };

  const handleSubmit = (values, { setFieldValue }) => {
    const preparedData = prepareAppointmentData(values);
    dispatch(
      createAppointment({
        data: preparedData,
        afterCreate,
        afterError,
        setFieldValue,
      })
    );
  };

  const { singleLoading } = useSelector(makeSelectSingleAppointment());

  return (
    <AppointmentFormModal
      title={formatMessage(messages.createAppointmentTitle)}
      initialState={{
        patient: patient_id,
        doctor: '',
        appointmentType: '',
        price: 0,
        date: '',
        time: '',
      }}
      validationSchema={isPasIntegrated ? createPASAppointmentValidationSchema : createAppointmentValidationSchema}
      isEditForm={false}
      doctors={doctors}
      patients={[]}
      appointmentTypes={appointmentTypes}
      closeModal={closeModal}
      handleSubmit={handleSubmit}
      loadingData={isDataLoading}
      loading={singleLoading}
      patientDefault={patient_full_name}
      patient_id={patient_id}
    />
  )
};

export default CreateAppointment;
