import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import messages from './messages';
import { makeSelectSingleAppointmentLoading } from 'redux/selectors/Appointment';
import { Typography } from 'antd';
import RowWithTwoColumns from 'components/util-components/Grid/RowWithTwoColumns';

const DeleteAppointmentModal = ({ handleClose, handleDelete, appointment }) => {
  const { formatMessage } = useIntl();

  const loading = useSelector(makeSelectSingleAppointmentLoading());

  const listData = [
    {
      label: formatMessage(messages.patient),
      value: appointment?.patient?.full_name,
    },
    {
      label: formatMessage(messages.doctor),
      value: `${appointment?.doctor?.full_name} (${appointment?.specialization})`,
    },
    {
      label: formatMessage(messages.date),
      value: appointment?.date,
    },
    {
      label: formatMessage(messages.time),
      value: appointment?.time,
    },
  ];

  const list = listData.map((item) => (
    <RowWithTwoColumns gutter={16} spanLeft={4} spanRight={20}>
      {`${item.label}:`}
      {item.value}
    </RowWithTwoColumns>
  ));

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
      <Typography.Paragraph type="secondary" strong>
        {formatMessage(messages.deleteMessage)}
      </Typography.Paragraph>
      {list}
    </Modal>
  );
};

export default DeleteAppointmentModal;
