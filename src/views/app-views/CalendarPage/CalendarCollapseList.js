import React, { useCallback, useEffect, useState } from 'react';
import { Collapse, List, Typography } from 'antd';

import { makeSelectDoctorAppointments } from 'redux/selectors/Appointment';
import StaffPanelItem from './StaffPanelItem';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'components/shared-components/Loading';
import { getSingleAppointment } from 'redux/actions/Appointment';
import AppointmentPreview from './AppointmentPreview';

const { Text } = Typography;

const CalendarCollapseList = () => {
  const dispatch = useDispatch();
  const { doctorAppointments, loading } = useSelector(
    makeSelectDoctorAppointments()
  );

  const [activeAppointment, setActiveAppointment] = useState(null);
  const { isPasIntegrated, PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const isInternal = PASProvider?.toLowerCase() === 'internal';
  // Internal appointments have no doctor assigned, so group like MedBridge (flat list).
  const hideDoctorGrouping = isMedbridge || isInternal;

  const collapseHeader = (data) => (
    <div className="d-flex justify-content-between">
      <div>
        <Text strong className="text-primary">
          {data.doctor}
        </Text>
        &nbsp;
        {isPasIntegrated || isInternal ? (<></>) : (<Text className="text-primary">({data.specialization})</Text>)}
        {/*  */}
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

  const collapseItems = doctorAppointments.map((item, index) => ({
    key: index,
    label: collapseHeader(item),
    className: "staff-collapse",
    children: (
      <List
        itemLayout="horizontal"
        dataSource={item.appointments}
        renderItem={(appointment) => (
          <List.Item
            onClick={() => handleClick(appointment)}
            className="cursor-pointer list-item-hover"
          >
            <List.Item.Meta
              description={<StaffPanelItem data={appointment} />}
            />
          </List.Item>
        )}
      />
    ),
  }));

  const allAppointments = doctorAppointments.flatMap((item) => item.appointments);

  return (
    <div>
      {allAppointments.length ? (
        hideDoctorGrouping ? (
          <List
            itemLayout="horizontal"
            dataSource={allAppointments}
            renderItem={(appointment) => (
              <List.Item
                onClick={() => handleClick(appointment)}
                className="cursor-pointer list-item-hover"
              >
                <List.Item.Meta
                  description={<StaffPanelItem data={appointment} />}
                />
              </List.Item>
            )}
          />
        ) : (
          <Collapse expandIconPosition="end" items={collapseItems} />
        )
      ) : (
        <div>{"No appointments for selected date"}</div>
      )}
      {activeAppointment && <AppointmentPreview handleClose={handleClose} />}
    </div>
  );
};

export default CalendarCollapseList;
