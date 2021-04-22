import React from 'react';
import { Card, Table, Typography } from 'antd';
import { useIntl } from 'react-intl';
import messages from '../PatientsPage/messages';

const { Title, Text } = Typography;

export const statusColor = (status) => {
  const statusOptions = {
    scheduled: 'Scheduled',
    attended: 'Attended',
    rescheduled: 'Rescheduled',
    cancelled: 'Cancelled',
  };
  switch (status) {
    case statusOptions.scheduled:
      return <Text className="text-primary">{status}</Text>;
    case statusOptions.attended:
      return <Text type="success">{status}</Text>;
    case statusOptions.rescheduled:
      return <Text type="warning">{status}</Text>;
    case statusOptions.cancelled:
      return <Text type="secondary">{status}</Text>;
    default:
      return <Text>{status}</Text>;
  }
};

const StaffAppointmentsListPast = () => {
  const { formatMessage } = useIntl();

  const columnsHistory = [
    {
      title: formatMessage(messages.columnTitleDate),
      dataIndex: 'date',
      sorter: true,
    },
    {
      title: formatMessage(messages.columnTitleTime),
      dataIndex: 'time',
      sorter: false,
    },
    {
      title: formatMessage(messages.columnTitlePatient),
      dataIndex: ['patient', 'full_name'],
      sorter: true,
    },
    {
      title: formatMessage(messages.columnTitleType),
      dataIndex: ['appointment_type', 'name'],
      sorter: true,
    },
    {
      title: formatMessage(messages.columnTitleStatus),
      dataIndex: ['status', 'name'],
      sorter: true,
      render: statusColor,
    },
  ];

  return (
    <Card>
      <Title level={4}>{formatMessage(messages.staffPastAppointments)}</Title>
      <Table columns={columnsHistory} dataSource={''} />
    </Card>
  );
};

export default StaffAppointmentsListPast;
