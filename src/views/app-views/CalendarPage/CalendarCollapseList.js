import React from 'react';
import { useIntl } from 'react-intl';
import { Badge, Collapse, List, Typography } from 'antd';

import { makeSelectDoctorAppointments } from 'redux/selectors/Appointment';
import StaffPanelItem from './StaffPanelItem';
import { useSelector } from 'react-redux';
import messages from './messages';
import Loading from 'components/shared-components/Loading';

const { Panel } = Collapse;
const { Text } = Typography;

const CalendarCollapseList = () => {
  const { doctorAppointments, loading } = useSelector(
    makeSelectDoctorAppointments()
  );
  const { formatMessage } = useIntl();

  const collapseHeader = (data) => (
    <div className="d-flex justify-content-between">
      <div>
        <Text strong className="text-primary">
          {data.doctor}
        </Text>
        &nbsp;
        <Text className="text-primary">({data.specialization})</Text>
      </div>
      <Badge count={data.appointments.length} />
    </div>
  );

  if (loading) return <Loading defaultSpinner />;

  return (
    <>
      {doctorAppointments.length ? (
        <Collapse expandIconPosition="right">
          {doctorAppointments.map((item, index) => (
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
                    <List.Item.Meta
                      description={<StaffPanelItem data={item} />}
                    />
                  </List.Item>
                )}
              />
            </Panel>
          ))}
        </Collapse>
      ) : (
        <div>{formatMessage(messages.noAppointments)}</div>
      )}
    </>
  );
};

export default CalendarCollapseList;
