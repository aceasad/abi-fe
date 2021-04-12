import React from 'react';
import { Badge, Col, Row, Space, Typography } from 'antd';

const StaffPanelItem = ({ data }) => {
  return (
    <Row>
      <Col span={9}>{data.time}</Col>
      <Col span={15}>
        <Space>
          <Typography.Text strong>{data.patient}</Typography.Text>
          <Badge status={data.status === 1 ? 'success' : 'warning'} />
        </Space>
      </Col>
    </Row>
  );
};

export default StaffPanelItem;
