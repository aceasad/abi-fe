import { Button, PageHeader, Space } from 'antd';
import React, { useState } from 'react';
import CalendarPage from '../CalendarPage';
import { useIntl } from 'react-intl';
import CreateAppointment from './CreateAppointment';
import AppointmentFormWrapper from './AppointmentFormWrapper';

const AppointmentsPage = () => {
  const { formatMessage } = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={formatMessage({ id: 'appointments_page.title' })}
        extra={[
          <Space key="0">
            <Button>
              {formatMessage({ id: 'appointments_page.button.export' })}
            </Button>
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
