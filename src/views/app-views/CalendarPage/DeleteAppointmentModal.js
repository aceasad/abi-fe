import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';

const DeleteAppointmentModal = ({ handleClose, handleDelete, appointment }) => {
  const { formatMessage } = useIntl();

  return (
    <Modal
      visible
      cancelText={formatMessage(messages.cancel)}
      okText={formatMessage(messages.confirm)}
      title={formatMessage(messages.deleteAppointment)}
      onCancel={handleClose}
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
