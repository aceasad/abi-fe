import { Card, Col, Tooltip, Typography } from 'antd';
import Flex from 'components/shared-components/Flex';
import React from 'react';
import { QuestionCircleFilled } from '@ant-design/icons';

const { Title } = Typography;

const OverviewCard = ({ span, title, tooltip, content, styleTitle, icon }) => {
  const getClassTitle = () => styleTitle.split(' ').join('-').toLowerCase();

  return (
    <Col span={span} className="mb-3">
      <Card
        className="height-100 d-flex flex-column justify-content-between m-0"
        bodyStyle={{ height: '100%' }}
      >
        <Flex flexDirection="column height-100">
          <div
            className={`overview-card__icon overview-card__icon--${getClassTitle()}`}
          >
            {icon}
          </div>
          <Title level={4} type="secondary" className="text-wrap">
            {title}
          </Title>
          <Flex
            justifyContent="between"
            alignItems="baseline"
            className="mt-auto"
          >
            <Title level={1} className="text-break font-weight-bolder mb-0">
              {content}
            </Title>
            <Tooltip title={tooltip} placement="bottom">
              <QuestionCircleFilled />
            </Tooltip>
          </Flex>
        </Flex>
      </Card>
    </Col>
  );
};

export default OverviewCard;
