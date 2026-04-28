import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import messages from './messages';
import { makeSelectSingleAppointmentLoading } from 'redux/selectors/Appointment';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { Typography } from 'antd';
import RowWithMultipleColumns from 'components/util-components/Grid/RowWithMultipleColumns';
import { formatDateByCountry } from 'utils/helpers';

const ReverseAppointmentReminderCancellationModal = ({
  handleClose,
  handleDelete,
  appointment,
}) => {
  const { formatMessage } = useIntl();

  const loading = useSelector(makeSelectSingleAppointmentLoading());
  const clinic = useSelector(makeSelectClinic());

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
      value: formatDateByCountry(appointment?.date, clinic?.country, [
        'DD/MM/YYYY',
        'MM/DD/YYYY',
        'YYYY-MM-DD',
      ]),
    },
    {
      label: formatMessage(messages.time),
      value: appointment?.time,
    },
  ];

  const list = listData.map((item, index) => (
    <RowWithMultipleColumns key={index} gutter={16} spanList={[4, 20]}>
      {`${item.label}:`}
      {item.value}
    </RowWithMultipleColumns>
  ));

  return (
    <Modal
      open
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

export default ReverseAppointmentReminderCancellationModal;
