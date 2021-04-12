import React from 'react';
import { Collapse } from 'antd';
import StaffPanelItem from './StaffPanelItem';

const { Panel } = Collapse;

const dummyData = [
  {
    staffName: 'Mark Downey (General Practitioner)',
    appointmentCount: 3,
    appointments: [
      { time: '9am-10am', patient: 'Raymond Philips', status: 1 },
      { time: '10am-11am', patient: 'Theresa Dias', status: 2 },
      { time: '11am-12am', patient: 'Beverly Cox', status: 1 },
    ],
  },
  {
    staffName: 'Mark Downey (General Practitioner)',
    appointmentCount: 3,
    appointments: [
      { time: '9am-10am', patient: 'Raymond Philips', status: 1 },
      { time: '10am-11am', patient: 'Theresa Dias', status: 2 },
      { time: '11am-12am', patient: 'Beverly Cox', status: 1 },
    ],
  },
  {
    staffName: 'Mark Downey (General Practitioner)',
    appointmentCount: 3,
    appointments: [
      { time: '9am-10am', patient: 'Raymond Philips', status: 1 },
      { time: '10am-11am', patient: 'Theresa Dias', status: 2 },
      { time: '11am-12am', patient: 'Beverly Cox', status: 1 },
    ],
  },
];
console.log(dummyData);

const CalendarCollapseList = () => {
  const callback = (key) => {
    console.log(key);
  };

  return (
    <Collapse onChange={callback} expandIconPosition="right">
      {dummyData.map((item, index) => (
        <Panel className="staff-collapse" header={item.staffName} key={index}>
          {item.appointments.map((item) => (
            <StaffPanelItem data={item} />
          ))}
        </Panel>
      ))}
    </Collapse>
  );
};

export default CalendarCollapseList;
