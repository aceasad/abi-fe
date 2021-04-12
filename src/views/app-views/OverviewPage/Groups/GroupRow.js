import { Row } from 'antd';
import React from 'react';

const GroupRow = ({ children, appointments }) => {
  if (appointments) {
    return <div className="border rounded pt-3 pl-3 pr-3">{children}</div>;
  }
  return (
    <Row gutter={16} className="border rounded pt-3 pl-2 pr-2">
      {children}
    </Row>
  );
};

export default GroupRow;
