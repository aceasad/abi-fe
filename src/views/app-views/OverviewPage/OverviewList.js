import React, { useState } from 'react';
import { Card, Typography, List, Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const OverviewList = ({ title, listData }) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const collapseHeader = (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <Typography.Title level={4} className="text-primary mb-0">
          {title}
        </Typography.Title>
        <DownOutlined
          className={`collapse-arrow-custom ${isCollapseOpen ? 'open' : ''}`}
        />
      </div>
    </>
  );

  return (
    <Collapse
      expandIconPosition="right"
      ghost
      className="mb-4"
      onChange={() => setIsCollapseOpen(!isCollapseOpen)}
    >
      <Panel
        className="overview-collapse"
        header={collapseHeader}
        showArrow={false}
      >
        <Card className="mt-4">
          <List
            itemLayout="horizontal"
            dataSource={listData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      </Panel>
    </Collapse>
  );
};

export default OverviewList;
