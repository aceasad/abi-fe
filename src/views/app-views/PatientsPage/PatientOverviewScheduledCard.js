import { Button, Card, Table, Typography } from 'antd';
import Flex from 'components/shared-components/Flex';
import React from 'react';
import localeString from 'utils/localeString';

const { Title, Text } = Typography;

const PatientOverviewScheduledCard = ({ patientData, localization }) => {
  const predictionOption = 'Likely to be missed';

  const renderPredictionText = (prediction) => (
    <Text type={prediction === predictionOption ? 'danger' : 'success'}>
      {prediction}
    </Text>
  );

  const columnsScheduled = [
    {
      title: localeString(
        localization,
        'patient_overview.table.column_title.date'
      ),
      dataIndex: 'date',
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: localeString(
        localization,
        'patient_overview.table.column_title.time'
      ),
      dataIndex: 'time',
      sorter: (a, b) => a.time - b.time,
    },
    {
      title: localeString(
        localization,
        'patient_overview.table.column_title.doctor'
      ),
      dataIndex: 'doctor',
      sorter: (a, b) => a.doctor.length - b.doctor.length,
    },
    {
      title: localeString(
        localization,
        'patient_overview.table.column_title.type'
      ),
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
    },
    {
      title: localeString(
        localization,
        'patient_overview.table.column_title.prediction'
      ),
      dataIndex: 'prediction',
      sorter: (a, b) => a.prediction.length - b.prediction.length,
      render: renderPredictionText,
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
