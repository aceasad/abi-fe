import { Card, Table, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from '../PatientsPage/messages';

const { Title, Text } = Typography;

const StaffAppointmentsList = () => {
  const predictionOption = 'Likely to be missed';

  const renderPredictionText = (prediction) => (
    <Text type={prediction === predictionOption ? 'danger' : 'success'}>
      {prediction}
    </Text>
  );

  const { formatMessage } = useIntl();

  const columnsScheduled = [
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
      title: formatMessage(messages.columnTitlePrediction),
      dataIndex: 'prediction',
      sorter: true,
      render: renderPredictionText,
    },
  ];

  return (
    <Card>
      <Title level={4}>
        {formatMessage(messages.cardTitleScheduledAppointments)}
      </Title>

      <Table columns={columnsScheduled} dataSource={''} />
    </Card>
  );
};

export default StaffAppointmentsList;
