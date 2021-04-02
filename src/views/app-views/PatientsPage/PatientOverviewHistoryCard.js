import { Button, Card, Table, Typography } from 'antd';
import React from 'react';
import localeString from 'utils/localeString';

const { Title, Text } = Typography;

const PatientOverviewHistoryCard = ({ patientData, localization }) => {
  const statusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return <Text className="text-primary">{status}</Text>;
      case 'Attended':
        return <Text type="success">{status}</Text>;
      case 'Rescheduled':
        return <Text type="warning">{status}</Text>;
      case 'Cancelled':
        return <Text type="secondary">{status}</Text>;
    }
  };

  const columnsHistory = [
    {
      title: 'Date',
      dataIndex: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: statusColor,
    },
  ];

  const onChangeHistory = (pagination, filters, sorter, extra) => {
    // Implement on change logic here
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <Card>
      <div className="mb-3">
        <Title level={4} className="mb-0">
          {localeString(
            localization,
            'patient_overview.card_title.appointment_history'
          )}
        </Title>
      </div>
      <Table
        columns={columnsHistory}
        dataSource={patientData}
        onChange={onChangeHistory}
      />
    </Card>
  );
};

export default PatientOverviewHistoryCard;
