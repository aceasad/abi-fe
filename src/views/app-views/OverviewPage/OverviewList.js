import { Card, Typography, List, Collapse, Badge } from 'antd';
import React from 'react';

const { Panel } = Collapse;

const OverviewList = ({ title, listData }) => {
  const collapseHeader = (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <Typography.Title level={2} className="mb-0">
          {title}
        </Typography.Title>
        <Badge className="badge-color" count={7} />
      </div>
    </>
  );

  return (
    <Collapse expandIconPosition="right" ghost className="mb-4">
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
