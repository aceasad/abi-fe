import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { Card, Table, Typography } from 'antd';
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

  const { items, loading, count, page } = useSelector(
    makeSelectPreviousOperations()
  );

  useEffect(() => {
    dispatch(getPreviousOperations({ id: patientId }));
    return () => dispatch(resetPreviousOperations());
  }, []);

  const columnsHistory = [
    {
      title: "Operation",
      dataIndex: 'operation_type',
    },
    {
      title: "Time of surgery",
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
          {"Previous operations"}
        </Title>
      </div>
      <Table
        columns={columnsHistory}
        dataSource={items.map((item) => ({ ...item, key: item.id || item.key }))}
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
