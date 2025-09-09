import React from 'react';
import { Table, Card, Menu, Dropdown, Button, Typography } from 'antd';
import { useIntl } from 'react-intl';
import messages from './messages';
import { DownOutlined } from '@ant-design/icons';

const dummyData = [
  {
    key: '1',
    patient: 'Terry Cooper',
    appointment: 'Mark Downey (Senior Endocrinologist)',
    date: 'Tomorrow',
    time: '9:30am',
    whitelisted: 'Yes',
    status: 'Chatbot reachout',
  },
  {
    key: '2',
    patient: 'Ruby Campbell',
    appointment: 'Mark Johnson (Senior DO)',
    date: '15/01/2021',
    time: '11:00am',
    whitelisted: 'Yes',
    status: 'Missed a call',
  },
  {
    key: '3',
    patient: 'Bruce Martinez',
    appointment: 'Jazmin Stokes (Senior MD)',
    date: '16/01/2021',
    time: '5:00pm',
    whitelisted: 'No',
    status: 'Called - booking confirmed',
  },
  {
    key: '4',
    patient: 'Howard Rodriguez',
    appointment: 'Summer-Luise Cabrera (Junior PA)',
    date: '20/01/2021',
    time: '4:30pm',
    whitelisted: 'Yes',
    status: 'Called - rescheduled',
  },
  {
    key: '5',
    patient: 'Barbara James',
    appointment: 'Talia Pritchard (Junior MD)',
    date: '25/01/2021',
    time: '2:00pm',
    whitelisted: 'No',
    status: 'Called - moved appointment to virtual',
  },
  {
    key: '6',
    patient: 'Jane Thomas',
    appointment: 'Mark Downey (Senior Endocrinologist)',
    date: '20/01/2021',
    time: '11:30am',
    whitelisted: 'No',
    status: 'Called - will call again',
  },
];

const OverviewTable = () => {
  const { formatMessage } = useIntl();

  const columns = [
    {
      title: formatMessage(messages.tableColumnPatient),
      dataIndex: 'patient',
      key: 'patient',
    },
    {
      title: formatMessage(messages.tableColumnAppointment),
      dataIndex: 'appointment',
      key: 'appointment',
    },
    {
      title: formatMessage(messages.tableColumnDate),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: formatMessage(messages.tableColumnTime),
      key: 'time',
      dataIndex: 'time',
    },
    {
      title: () => (
        <div className="text-center">
          {formatMessage(messages.tableColumnWhitelisted)}
        </div>
      ),
      key: 'whitelisted',
      dataIndex: 'whitelisted',
      render: (text) => <div className="text-center">{text}</div>,
    },
    {
      title: formatMessage(messages.tableColumnStatus),
      key: 'status',
      dataIndex: 'status',
    },
    {
      key: 'action',
      render: () => (
        <div className="text-right">
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button type="primary" ghost>
              {formatMessage(messages.tableDropdownTitleContact)}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  const menuItems = [
    {
      key: "0",
      label: formatMessage(messages.tableDropdownSeeAppointment),
    },
    {
      key: "1",
      label: formatMessage(messages.tableDropdownAiReachout),
    },
  ];

  return (
    <>
      <Typography.Title level={2} className="mb-2">
        {formatMessage(messages.tableTitle)}
      </Typography.Title>
      <Card className="mt-0">
        <Table columns={columns} dataSource={dummyData} />
      </Card>
    </>
  );
};

export default OverviewTable;
