import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentFormModal from './AppointmentFormModal';
import messages from './messages';
import { useIntl } from 'react-intl';
import { createAppointmentValidationSchema } from 'utils/validations';
import { message } from 'antd';
import { getYearAndMonth, prepareAppointmentData } from 'utils/helpers';
import {
  createAppointment,
  getDateAppointments,
  getDoctorAppointments,
} from 'redux/actions/Appointment';
import { makeSelectSingleAppointment } from 'redux/selectors/Appointment';
import moment from 'moment';
import { DATE_FORMAT_YYYY_MM_DD } from 'constants/DateConstant';

const CreateAppointment = ({
  appointmentTypes,
  doctors,
  closeModal,
  isDataLoading,
}) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const afterCreate = (newAppointmentStartDatetime) => {
    message.success(formatMessage(messages.newAppointmentCreated));
    closeModal();
    dispatch(
      getDoctorAppointments(
        moment(newAppointmentStartDatetime).format(DATE_FORMAT_YYYY_MM_DD)
      )
    );
    dispatch(getDateAppointments(getYearAndMonth(newAppointmentStartDatetime)));
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
        patient: '',
        doctor: '',
        appointmentType: '',
        price: 0,
        date: '',
        time: '',
      }}
      validationSchema={createAppointmentValidationSchema}
      isEditForm={false}
      doctors={doctors}
      patients={[]}
      appointmentTypes={appointmentTypes}
      closeModal={closeModal}
      handleSubmit={handleSubmit}
      loadingData={isDataLoading}
      loading={singleLoading}
    />
  );
};

export default CreateAppointment;
