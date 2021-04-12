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
  const filter = {
    today: formatMessage(messages.selectToday),
    week: formatMessage(messages.selectWeek),
    month: formatMessage(messages.selectMonth),
    year: formatMessage(messages.selectYear),
  };
  const [filterValue, setFilterValue] = useState(filter.today);

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={formatMessage(messages.title)}
        extra={[
          <Select
            key="0"
            style={{ width: 120 }}
            onChange={(value) => setFilterValue(value)}
            value={filterValue}
          >
            <Option value="today">{filter.today}</Option>
            <Option value="week">{filter.week}</Option>
            <Option value="month">{filter.month}</Option>
            <Option value="year">{filter.year}</Option>
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
