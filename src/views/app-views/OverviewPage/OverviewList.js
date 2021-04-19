import { Card, Typography, List } from 'antd';
import React from 'react';

const OverviewList = ({ title, listData }) => {
  return (
    <div className="mb-5">
      <Typography.Title level={2} className="mb-4">
        {title}
      </Typography.Title>
      <Card>
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
    </div>
  );
};

export default OverviewList;
