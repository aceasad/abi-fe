import { Card, Col, Tooltip, Typography } from 'antd';
import Flex from 'components/shared-components/Flex';
import React from 'react';
import { QuestionCircleFilled } from '@ant-design/icons';

const { Title } = Typography;

const OverviewCard = ({ span, title, tooltip, content }) => {
  return (
    <Col span={span} className="mb-3">
      <Card
        className="height-100 d-flex flex-column justify-content-between"
        title={<span className="text-wrap font-size-base">{title}</span>}
      >
        <Flex justifyContent="between" alignItems="baseline">
          <Title level={1} className="text-break">
            {content}
          </Title>
          <Tooltip title={tooltip} placement="bottom">
            <QuestionCircleFilled />
          </Tooltip>
        </Flex>
      </Card>
    </Col>
  );
};

export default OverviewCard;
