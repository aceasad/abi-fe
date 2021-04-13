import { Button, PageHeader, Space } from 'antd';
import React from 'react';
import CalendarPage from '../CalendarPage';
import { useIntl } from 'react-intl';

const AppointmentsPage = () => {
  const { formatMessage } = useIntl();

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
            <Button type="primary">
              {formatMessage({
                id: 'appointments_page.button.new_appointment',
              })}
            </Button>
          </Space>,
        ]}
      />
      <CalendarPage />
    </>
  );
};

export default AppointmentsPage;
