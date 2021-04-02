import { Button, Card, Table, Typography } from 'antd';
import React from 'react';
import localeString from 'utils/localeString';

const { Title, Text } = Typography;

const PatientOverviewHistoryCard = ({ patientData, localization }) => {
  const statusOptions = {
    scheduled: 'Scheduled',
    attended: 'Attended',
    rescheduled: 'Rescheduled',
    cancelled: 'Cancelled',
  };

  const statusColor = (status) => {
    switch (status) {
      case statusOptions.scheduled:
        return <Text className="text-primary">{status}</Text>;
      case statusOptions.attended:
        return <Text type="success">{status}</Text>;
      case statusOptions.rescheduled:
        return <Text type="warning">{status}</Text>;
      case statusOptions.cancelled:
        return <Text type="secondary">{status}</Text>;
    }
  };

  const columnsHistory = [
    {
      title: localeString(
        localization,
        'patient_overview.table.column_title.date'
      ),
      dataIndex: 'date',
    },
    {
      title: localeString(
        localization,
        'patient_overview.table.column_title.time'
      ),
      dataIndex: 'time',
    },
    {
      title: localeString(
        localization,
        'patient_overview.table.column_title.doctor'
      ),
      dataIndex: 'doctor',
    },
    {
      title: localeString(
        localization,
        'patient_overview.table.column_title.type'
      ),
      dataIndex: 'type',
    },
    {
      title: localeString(
        localization,
        'patient_overview.table.column_title.status'
      ),
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
