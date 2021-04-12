import { Col, PageHeader, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import Booking from './Groups/Booking';
import AbiData from './Groups/AbiData';
import Uptake from './Groups/Uptake';
import Appointments from './Groups/Appointments';
import OverviewList from './OverviewList';
import OverviewTable from './OverviewTable';

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
            {filters.map((item) => (
              <Option value={item.value}>{item.label}</Option>
            ))}
          </Select>,
        ]}
      />
      <Row gutter={32}>
        <Col span={14}>
          <Booking />
          <OverviewList title={formatMessage(messages.listAttention)} />
          <OverviewList title={formatMessage(messages.listScreening)} />
        </Col>
        <Col span={10}>
          <AbiData />
          <Uptake />
          <Appointments />
        </Col>
      </Row>
      <OverviewTable />
    </>
  );
};

export default OverviewPage;
