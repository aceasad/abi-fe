import React from 'react';
import { Badge, Collapse, List, Typography } from 'antd';
import StaffPanelItem from './StaffPanelItem';

const { Panel } = Collapse;
const { Text } = Typography;

const dummyData = [
  {
    staffName: 'Mark Downey',
    staffSpecialization: '(General Practitioner)',
    appointmentCount: 3,
    appointments: [
      { time: '9am-10am', patient: 'Raymond Philips', status: 1 },
      { time: '10am-11am', patient: 'Theresa Dias', status: 2 },
      { time: '11am-12am', patient: 'Beverly Cox', status: 1 },
    ],
  },
  {
    staffName: 'Mark Downey',
    staffSpecialization: '(General Practitioner)',
    appointmentCount: 3,
    appointments: [
      { time: '9am-10am', patient: 'Raymond Philips', status: 1 },
      { time: '10am-11am', patient: 'Theresa Dias', status: 2 },
      { time: '11am-12am', patient: 'Beverly Cox', status: 1 },
    ],
  },
  {
    staffName: 'Mark Downey',
    staffSpecialization: '(General Practitioner)',
    appointmentCount: 3,
    appointments: [
      { time: '9am-10am', patient: 'Raymond Philips', status: 1 },
      { time: '10am-11am', patient: 'Theresa Dias', status: 2 },
      { time: '11am-12am', patient: 'Beverly Cox', status: 1 },
    ],
  },
];

const CalendarCollapseList = () => {
  const collapseHeader = (data) => (
    <div className="d-flex justify-content-between">
      <div>
        <Text strong className="text-primary">
          {data.staffName}
        </Text>
        &nbsp;
        <Text className="text-primary">{data.staffSpecialization}</Text>
      </div>
      <Badge count={data.appointmentCount} />
    </div>
  );

  return (
    <Collapse expandIconPosition="right">
      {dummyData.map((item, index) => (
        <Panel
          className="staff-collapse"
          header={collapseHeader(item)}
          key={index}
        >
          <List
            itemLayout="horizontal"
            dataSource={item.appointments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta description={<StaffPanelItem data={item} />} />
              </List.Item>
            )}
          />
        </Panel>
      ))}
    </Collapse>
  );
};

export default CalendarCollapseList;
