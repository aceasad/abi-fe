import { Button, PageHeader, Space } from 'antd';
import React from 'react';
import CalendarPage from '../CalendarPage';

const index = () => {
  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={'Appointments'}
        extra={[
          <Space key="0">
            <Button>{'Export'}</Button>
            <Button type="primary">{'New Appointment'}</Button>
          </Space>,
        ]}
      />
      <CalendarPage />
    </>
  );
};

export default index;
