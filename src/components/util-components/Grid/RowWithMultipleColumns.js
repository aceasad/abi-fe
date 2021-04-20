import { Col, Row } from 'antd';
import React from 'react';

const RowWithMultipleColumns = ({ children, className, gutter, spanList }) => {
  const columns = spanList.map((item, index) => (
    <Col key={index} span={item}>
      {children[index]}
    </Col>
  ));

  return (
    <Row gutter={gutter} className={className}>
      {columns}
    </Row>
  );
};

export default RowWithMultipleColumns;
