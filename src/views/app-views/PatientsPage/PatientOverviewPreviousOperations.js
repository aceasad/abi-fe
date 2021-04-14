import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectHistory } from 'redux/selectors/Patient';
import { setAppointmentHistoryPage } from 'redux/actions/Patient';
import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { Card, Table, Typography } from 'antd';
import messages from './messages';
import { useIntl } from 'react-intl';

const { Title } = Typography;

const PatientOverviewPreviousOperations = ({ patient }) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const { items, loading, count, page } = useSelector(makeSelectHistory());

  const columnsHistory = [
    {
      title: formatMessage(messages.columnTitleOperation),
      dataIndex: 'operation',
    },
    {
      title: formatMessage(messages.columnTitleCategory),
      dataIndex: 'category',
    },
    {
      title: formatMessage(messages.columnTitleTimeOfSurgery),
      dataIndex: 'time_of_surgery',
    },
  ];

  const handlePaginationChange = (page) => {
    dispatch(setAppointmentHistoryPage({ page, id: patient.id }));
  };

  return (
    <Card>
      <div className="mb-3">
        <Title level={4} className="mb-0">
          {formatMessage(messages.cardTitlePreviousOperatins)}
        </Title>
      </div>
      <Table
        columns={columnsHistory}
        dataSource={items}
        loading={loading}
        pagination={{
          defaultPageSize: DEFAULT_PAGINATION_LIMIT,
          total: count,
          onChange: handlePaginationChange,
          hideOnSinglePage: true,
          current: page,
        }}
      />
    </Card>
  );
};

export default PatientOverviewPreviousOperations;
