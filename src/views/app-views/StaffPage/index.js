import React, { useState } from 'react';
import StaffList from './StaffList';

export const STAFF_PAGE = {
  LIST: 0,
  CREATE: 1,
  EDIT: 2,
};

const StaffPage = () => {
  const [staffPage, setStaffPage] = useState(STAFF_PAGE.LIST);

  switch (staffPage) {
    case STAFF_PAGE.LIST:
      return <StaffList />;
    default:
      return <StaffList />;
  }
};

export default StaffPage;
