import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Collapse, List, Typography } from 'antd';

import { makeSelectDoctorAppointments } from 'redux/selectors/Appointment';
import StaffPanelItem from './StaffPanelItem';
import { useDispatch, useSelector } from 'react-redux';
import messages from './messages';
import Loading from 'components/shared-components/Loading';
import { getSingleAppointment } from 'redux/actions/Appointment';
import AppointmentPreview from './AppointmentPreview';

const { Panel } = Collapse;
const { Text } = Typography;

const CalendarCollapseList = () => {
  const dispatch = useDispatch();
  const { doctorAppointments, loading } = useSelector(
    makeSelectDoctorAppointments()
  );

  const { formatMessage } = useIntl();

  const [activeAppointment, setActiveAppointment] = useState(null);

  const collapseHeader = (data) => (
    <div className="d-flex justify-content-between">
      <div>
        <Text strong className="text-primary">
          {data.doctor}
        </Text>
        &nbsp;
        <Text className="text-primary">({data.specialization})</Text>
      </div>
      {/* Badge goes here. */}
    </div>
  );

  const handleClick = ({ id }) => {
    setActiveAppointment(id);
  };

  const handleClose = useCallback(() => {
    setActiveAppointment(null);
  }, []);

  useEffect(() => {
    if (activeAppointment) dispatch(getSingleAppointment(activeAppointment));
  }, [activeAppointment]);

  if (loading) return <Loading defaultSpinner />;
  return (
    <div>
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
                  <List.Item
                    onClick={() => handleClick(item)}
                    className="cursor-pointer list-item-hover"
                  >
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
      {activeAppointment && <AppointmentPreview handleClose={handleClose} />}
    </div>
  );
};

export default CalendarCollapseList;
