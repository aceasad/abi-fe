import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { Card, Table, Typography } from 'antd';
import messages from './messages';
import {
  getExistingMedicalConditions,
  resetExistingMedicalConditions,
  setPage,
} from 'redux/actions/Anamnesis';
import { makeSelectExistingMedicalConditions } from 'redux/selectors/Anemnesis';
import { EXISTING_CONDITIONS } from 'redux/reducers/Anemnesis';

const { Title } = Typography;

const PatientOverviewExistingConditions = ({ patientId }) => {
  const dispatch = useDispatch();

  const { items, loading, count, page } = useSelector(
    makeSelectExistingMedicalConditions()
  );

  useEffect(() => {
    dispatch(getExistingMedicalConditions({ id: patientId }));
    return () => dispatch(resetExistingMedicalConditions());
  }, []);

  const columnsHistory = [
    {
      title: messages.columnTitleCondition,
      dataIndex: 'name',
    },
  ];

  const handlePaginationChange = (page) => {
    dispatch(setPage({ page, id: patientId, field: EXISTING_CONDITIONS }));
  };

  return (
    <Card>
      <div className="mb-3">
        <Title level={4} className="mb-0">
          {messages.cardTitleExistingConditions}
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

export default PatientOverviewExistingConditions;
