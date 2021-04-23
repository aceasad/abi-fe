import { PageHeader } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { makeSelectStaff } from 'redux/selectors/Staff';
import StaffAppointmentsList from './StaffAppointmentsList';
import StaffAppointmentsListPast from './StaffAppointmentsListPast';

const StaffAppointments = ({ staffId, showList }) => {
  const { staff } = useSelector(makeSelectStaff());
  const staffData = staff.find((obj) => {
    return obj.id === staffId;
  });

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        onBack={() => showList()}
        avatar={{ src: staffData.profile_picture }}
        title={`${staffData.first_name} ${staffData.last_name}`}
        subTitle={`${staffData.seniority} ${staffData.specialization}`}
      />
      <StaffAppointmentsList />
      <StaffAppointmentsListPast />
    </>
  );
};

export default StaffAppointments;
