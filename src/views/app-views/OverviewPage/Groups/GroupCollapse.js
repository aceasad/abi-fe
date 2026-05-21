import { Collapse, Typography } from 'antd';
import React, { useState } from 'react';

import { DownOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';

const { Panel } = Collapse;

const CollapseHeader = ({ title, isOpen }) => (
  <Flex justifyContent="between" alignItems="center" className="mb-4">
    <Typography.Title level={3} className={`text-primary mb-0`}>
      {title}
    </Typography.Title>

    <DownOutlined className={`collapse-arrow-custom ${isOpen ? 'open' : ''}`} />
  </Flex>
);

const GroupCollapse = ({ title, group, startOpen }) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(startOpen);

  return (
    <Collapse
      expandIconPosition="right"
      ghost
      onChange={() => setIsCollapseOpen(!isCollapseOpen)}
      defaultActiveKey={startOpen ? ['1'] : null}
    >
      <Panel
        key="1"
        className="overview-collapse"
        header={<CollapseHeader title={title} isOpen={isCollapseOpen} />}
        showArrow={false}
      >
        {group}
      </Panel>
    </Collapse>
  );
};

export default GroupCollapse;
