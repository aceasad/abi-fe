import React from 'react';
import { Card, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function CardComponent({
  avatar,
  title,
  description,
  action = false,
  handleClick,
  Options = null,
}) {
  return (
    <Card
      hoverable
      className="text-center"
      cover={
        <div className="ant-card-staff-header">
          <Options />
          <Avatar size={96} src={avatar} icon={<UserOutlined />} />
        </div>
      }
      actions={[<Button onClick={handleClick}>{action}</Button>]}
    >
      <Card.Meta title={title} description={description} />
    </Card>
  );
}

export default CardComponent;
