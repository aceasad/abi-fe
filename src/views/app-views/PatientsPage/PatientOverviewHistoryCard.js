import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectHistory } from 'redux/selectors/Patient';
import { setAppointmentHistoryPage } from 'redux/actions/Patient';
import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { Card, Table, Typography } from 'antd';
import messages from './messages';
import { useIntl } from 'react-intl';
import { APPOINTMNET_HISTORY } from 'constants/ClinicConstants';

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

const PatientOverviewHistoryCard = ({ patient, showAppointment }) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const { items, loading, count, page } = useSelector(makeSelectHistory());

  const columnsHistory = [
    {
      title: formatMessage(messages.columnTitleDate),
      dataIndex: 'date',
    },
    {
      title: formatMessage(messages.columnTitleTime),
      dataIndex: 'time',
    },
    {
      title: formatMessage(messages.columnTitleDoctor),
      dataIndex: ['doctor', 'full_name'],
    },
    {
      title: formatMessage(messages.columnTitleType),
      dataIndex: ['appointment_type', 'name'],
    },
    {
      title: formatMessage(messages.columnTitleStatus),
      dataIndex: ['status', 'name'],
      render: statusColor,
    },
  ];

  const handlePaginationChange = (page) => {
    dispatch(setAppointmentHistoryPage({ page, id: patient.id }));
  };

  return (
    <Card>
      <div className="mb-3">
        <Title level={4} className="mb-0">
          {formatMessage(messages.cardTitleAppointmentHistory)}
        </Title>
      </div>
      <div className="table-responsive ant-table-row-pointer">
        <Table
          onRow={(record) => ({
            onClick: () =>
              showAppointment({ id: record.id, type: APPOINTMNET_HISTORY }),
          })}
          columns={columnsHistory}
          dataSource={items}
          loading={loading}
          pagination={{
            defaultPageSize: DEFAULT_SMALL_PAGINATION_LIMIT,
            total: count,
            onChange: handlePaginationChange,
            hideOnSinglePage: true,
            current: page,
          }}
        />
      </div>
    </Card>
  );
};

export default PatientOverviewHistoryCard;
