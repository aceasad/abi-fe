import { Button, PageHeader, Space, Typography, Grid } from 'antd';
import React, { useState } from 'react';
import CalendarPage from '../CalendarPage';
import { useIntl } from 'react-intl';
import CreateAppointment from './CreateAppointment';
import AppointmentFormWrapper from './AppointmentFormWrapper';
import utils from 'utils';

const { useBreakpoint } = Grid;

const AppointmentsPage = () => {
  const { formatMessage } = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={
          isMobile ? (
            <Typography.Title level={2} className="mb-0">
              {formatMessage({ id: 'appointments_page.title' })}
            </Typography.Title>
          ) : (
            ''
          )
        }
        extra={[
          <Space key="0">
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              {formatMessage({
                id: 'appointments_page.button.new_appointment',
              })}
            </Button>
          </Space>,
        ]}
      />
      {isModalVisible && (
        <AppointmentFormWrapper
          Component={CreateAppointment}
          isEditForm={false}
          closeModal={closeModal}
          isModalVisible={isModalVisible}
        />
      )}

      <CalendarPage />
    </>
  );
};

export default AppointmentsPage;
