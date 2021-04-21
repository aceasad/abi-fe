import { PageHeader } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import StaffAppointmentsList from './StaffAppointmentsList';
import StaffAppointmentsListPast from './StaffAppointmentsListPast';

const avatarImage = '/img/avatars/thumb-14.jpg';

const StaffAppointments = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        onBack={() => {}}
        avatar={{ src: avatarImage }}
        title={formatMessage(messages.seeAppointmentsTitle, {
          staffName: 'John Smith',
        })}
      />
      <StaffAppointmentsList />
      <StaffAppointmentsListPast />
    </>
  );
};

export default StaffAppointments;
