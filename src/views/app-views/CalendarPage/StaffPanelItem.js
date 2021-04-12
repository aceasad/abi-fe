import React from 'react';
import { Badge, Col, Row, Space, Typography, Tooltip } from 'antd';
import { useIntl } from 'react-intl';

const StaffPanelItem = ({ data }) => {
  const { formatMessage } = useIntl();
  const likelyToMiss = formatMessage({ id: 'appointments_page.tooltip.miss' });
  const likelyToAttend = formatMessage({
    id: 'appointments_page.tooltip.attend',
  });

  return (
    <Row className="pl-2">
      <Col span={9}>{data.time}</Col>
      <Col span={15}>
        <Space>
          <Typography.Text strong>{data.patient}</Typography.Text>
          <Tooltip
            placement="bottomRight"
            title={data.status === 1 ? likelyToAttend : likelyToMiss}
          >
            <Badge status={data.status === 1 ? 'success' : 'warning'} />
          </Tooltip>
        </Space>
      </Col>
    </Row>
  );
};

export default StaffPanelItem;
