import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import messages from './messages';
import { makeSelectSingleAppointmentLoading } from 'redux/selectors/Appointment';

const DeleteAppointmentModal = ({ handleClose, handleDelete, appointment }) => {
  const { formatMessage } = useIntl();

  const loading = useSelector(makeSelectSingleAppointmentLoading());

  return (
    <Modal
      visible
      cancelText={formatMessage(messages.cancel)}
      okText={formatMessage(messages.confirm)}
      title={formatMessage(messages.deleteAppointment)}
      onCancel={handleClose}
      okButtonProps={{ disabled: loading }}
      onOk={handleDelete}
    >
      {formatMessage(messages.deleteMessage)}
      <div>
        {formatMessage(messages.patient)}: {appointment.patient}
      </div>
      <div>
        {formatMessage(messages.doctor)}:{' '}
        {`${appointment.doctor}(${appointment.specialization})`}
      </div>
      <div>
        {formatMessage(messages.date)}: {appointment.date}
      </div>
      <div>
        {formatMessage(messages.time)}: {appointment.time}
      </div>
    </Modal>
  );
};

export default DeleteAppointmentModal;
