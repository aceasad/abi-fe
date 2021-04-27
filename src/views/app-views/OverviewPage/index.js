import { Col, PageHeader, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import OverviewList from './OverviewList';
import OverviewTable from './OverviewTable';
import GroupsCollapse from './Groups/GroupsCollapse';

const { Option } = Select;

const OverviewPage = () => {
  const { formatMessage } = useIntl();
  const filters = [
    { value: 'today', label: formatMessage(messages.selectToday) },
    { value: 'week', label: formatMessage(messages.selectWeek) },
    { value: 'month', label: formatMessage(messages.selectMonth) },
    { value: 'year', label: formatMessage(messages.selectYear) },
  ];
  const [filterValue, setFilterValue] = useState(filters[0].value);

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={formatMessage(messages.title)}
        extra={[
          <Select
            key="0"
            style={{ width: 120 }}
            onChange={setFilterValue}
            value={filterValue}
          >
            {filters.map((item, index) => (
              <Option key={index} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>,
        ]}
      />
      <OverviewTable />
      <Row gutter={48}>
        <Col span={13} className="mt-4">
          <OverviewList title={formatMessage(messages.listAttention)} />
          <OverviewList title={formatMessage(messages.listScreening)} />
        </Col>
        <Col span={11} className="mt-4">
          <GroupsCollapse />
        </Col>
      </Row>
    </>
  );
};

export default OverviewPage;
