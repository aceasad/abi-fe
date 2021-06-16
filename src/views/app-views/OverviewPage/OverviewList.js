import React, { useState } from 'react';
import { Card, Typography, List, Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const OverviewList = ({ title, listData, startOpen }) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const collapseHeader = (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <Typography.Title level={3} className="text-primary mb-0">
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
      defaultActiveKey={startOpen ? ['1'] : null}
    >
      <Panel
        key="1"
        className="overview-collapse"
        header={collapseHeader}
        showArrow={false}
      >
        <Card className="mt-4 shadow-basic">
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
