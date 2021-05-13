import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { Card, Table, Typography } from 'antd';
import messages from './messages';
import { useIntl } from 'react-intl';
import { makeSelectPreviousOperations } from 'redux/selectors/Anemnesis';
import {
  getPreviousOperations,
  resetPreviousOperations,
  setPage,
} from 'redux/actions/Anamnesis';
import { PREVIOUS_OPERATIONS } from 'redux/reducers/Anemnesis';

const { Title } = Typography;

const PatientOverviewPreviousOperations = ({ patientId }) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const { items, loading, count, page } = useSelector(
    makeSelectPreviousOperations()
  );

  useEffect(() => {
    dispatch(getPreviousOperations({ id: patientId }));
    return () => dispatch(resetPreviousOperations());
  }, []);

  const columnsHistory = [
    {
      title: formatMessage(messages.columnTitleOperation),
      dataIndex: 'operation_type',
    },
    {
      title: formatMessage(messages.columnTitleTimeOfSurgery),
      dataIndex: 'year',
    },
  ];

  const handlePaginationChange = (page) => {
    dispatch(setPage({ page, id: patientId, field: PREVIOUS_OPERATIONS }));
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
          defaultPageSize: DEFAULT_SMALL_PAGINATION_LIMIT,
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
