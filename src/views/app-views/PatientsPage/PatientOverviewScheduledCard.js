import { Button, Card, Table, Typography } from 'antd';
import Flex from 'components/shared-components/Flex';
import React from 'react';
import localeString from 'utils/localeString';

const { Title, Text } = Typography;

const PatientOverviewScheduledCard = ({ patientData, localization }) => {
  const predictionColor = (prediction) => {
    if (prediction === 'Likely to be missed')
      return <Text type="danger">{prediction}</Text>;
    return <Text type="success">{prediction}</Text>;
  };

  const columnsScheduled = [
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: 'Time',
      dataIndex: 'time',
      sorter: (a, b) => a.time - b.time,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      sorter: (a, b) => a.doctor.length - b.doctor.length,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
    },
    {
      title: 'Prediction',
      dataIndex: 'prediction',
      sorter: (a, b) => a.prediction.length - b.prediction.length,
      render: predictionColor,
    },
  ];

  const onChangeScheduled = (pagination, filters, sorter, extra) => {
    // Implement on change logic here
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <Card>
      <Flex justifyContent="between" alignItems="center" className="mb-3">
        <Title level={4} className="mb-0">
          {localeString(
            localization,
            'patient_overview.card_title.scheduled_appointments'
          )}
        </Title>
        <Button ghost type="primary">
          {localeString(
            localization,
            'patient_overview.button.new_appointment'
          )}
        </Button>
      </Flex>
      <Table
        columns={columnsScheduled}
        dataSource={patientData}
        onChange={onChangeScheduled}
      />
    </Card>
  );
};

export default PatientOverviewScheduledCard;
