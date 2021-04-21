import React, { useState } from 'react';
import CreateStaff from './CreateStaff';
import StaffAppointments from './StaffAppointments';
import StaffList from './StaffList';
import UpdateStaff from './UpdateStaff';

export const STAFF_PAGE = {
  LIST: 0,
  CREATE: 1,
  EDIT: 2,
  APPOINTMENTS: 3,
};

const StaffPage = () => {
  const [staffPage, setStaffPage] = useState(STAFF_PAGE.LIST);

  const showCreate = () => setStaffPage({ id: STAFF_PAGE.CREATE });
  const showList = () => setStaffPage({ id: STAFF_PAGE.LIST });
  const editUser = (data) => setStaffPage({ id: STAFF_PAGE.EDIT, data });
  const seeAppointments = (data) =>
    setStaffPage({ id: STAFF_PAGE.APPOINTMENTS, data });

  switch (staffPage.id) {
    case STAFF_PAGE.LIST:
      return (
        <StaffList
          showCreate={showCreate}
          editUser={editUser}
          seeAppointments={seeAppointments}
        />
      );
    case STAFF_PAGE.CREATE:
      return <CreateStaff showList={showList} />;
    case STAFF_PAGE.EDIT:
      return <UpdateStaff showList={showList} staffId={staffPage.data} />;
    case STAFF_PAGE.APPOINTMENTS:
      return <StaffAppointments showList={showList} staffId={staffPage.data} />;
    default:
      return (
        <StaffList
          showCreate={showCreate}
          editUser={editUser}
          seeAppointments={seeAppointments}
        />
      );
  }
};

export default StaffPage;
