import { Col, Row } from 'antd';
import React from 'react';

const RowWithTwoColumns = ({
  children,
  className,
  gutter,
  spanLeft,
  spanRight,
}) => {
  return (
    <Row gutter={gutter} className={className}>
      <Col span={spanLeft}>{children[0]}</Col>
      <Col span={spanRight}>{children[1]}</Col>
    </Row>
  );
};

export default RowWithTwoColumns;
