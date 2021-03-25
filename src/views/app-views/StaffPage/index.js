import React, { useState } from 'react';
import CreateStaff from './CreateStaff';
import StaffList from './StaffList';
import UpdateStaff from './UpdateStaff';

export const STAFF_PAGE = {
  LIST: 0,
  CREATE: 1,
  EDIT: 2,
};

const StaffPage = () => {
  const [staffPage, setStaffPage] = useState(STAFF_PAGE.LIST);

  const showCreate = () => setStaffPage({ id: STAFF_PAGE.CREATE });
  const showList = () => setStaffPage({ id: STAFF_PAGE.LIST });
  const editUser = (data) => setStaffPage({ id: STAFF_PAGE.EDIT, data });

  switch (staffPage.id) {
    case STAFF_PAGE.LIST:
      return <StaffList showCreate={showCreate} editUser={editUser} />;
    case STAFF_PAGE.CREATE:
      return <CreateStaff showList={showList} />;
    case STAFF_PAGE.EDIT:
      return <UpdateStaff showList={showList} staffId={staffPage.data} />;
    default:
      return <StaffList showCreate={showCreate} editUser={editUser} />;
  }
};

export default StaffPage;
