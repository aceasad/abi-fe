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

const dummyDataImmediate = [
  {
    title: 'John Doe',
    description:
      'Oh sorry, my mistake, can I postpone the appointment for the next week?',
  },
  {
    title: 'John Doe',
    description:
      'Oh sorry, my mistake, can I postpone the appointment for the next week?',
  },
  {
    title: 'John Doe',
    description:
      'Oh sorry, my mistake, can I postpone the appointment for the next week?',
  },
  {
    title: 'John Doe',
    description:
      'Oh sorry, my mistake, can I postpone the appointment for the next week?',
  },
];

const dummyDataInvite = [
  {
    title: '18-25 years old, Female',
    description: (
      <div>
        Hi Kate, just a gentle reminder that you have a cervical screening
        appointment on Fri May 7th, 9 am
        <br />
        We don't want you to feel worried about this appointment. If you have
        any questions or concerns please let me know.
        <br />
        Please find frequently asked questions{' '}
        <a
          href="https://www.nhsinform.scot/healthy-living/screening/cervical/cervical-screening-smear-test#overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </div>
    ),
  },
  {
    title: '18-25 years old, Female',
    description: (
      <div>
        Hi Kate, just a gentle reminder that you have a cervical screening
        appointment on Fri May 7th, 9 am
        <br />
        We don't want you to feel worried about this appointment. If you have
        any questions or concerns please let me know.
        <br />
        Please find frequently asked questions{' '}
        <a
          href="https://www.nhsinform.scot/healthy-living/screening/cervical/cervical-screening-smear-test#overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </div>
    ),
  },
  {
    title: '18-25 years old, Female',
    description: (
      <div>
        Hi Kate, just a gentle reminder that you have a cervical screening
        appointment on Fri May 7th, 9 am
        <br />
        We don't want you to feel worried about this appointment. If you have
        any questions or concerns please let me know.
        <br />
        Please find frequently asked questions{' '}
        <a
          href="https://www.nhsinform.scot/healthy-living/screening/cervical/cervical-screening-smear-test#overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </div>
    ),
  },
  {
    title: '18-25 years old, Female',
    description: (
      <div>
        Hi Kate, just a gentle reminder that you have a cervical screening
        appointment on Fri May 7th, 9 am
        <br />
        We don't want you to feel worried about this appointment. If you have
        any questions or concerns please let me know.
        <br />
        Please find frequently asked questions{' '}
        <a
          href="https://www.nhsinform.scot/healthy-living/screening/cervical/cervical-screening-smear-test#overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </div>
    ),
  },
];

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
      <Row gutter={32}>
        <Col span={14}>
          <Booking />
          <OverviewList
            title={formatMessage(messages.listAttention)}
            listData={dummyDataImmediate}
          />
          <OverviewList
            title={formatMessage(messages.listScreening)}
            listData={dummyDataInvite}
          />
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
