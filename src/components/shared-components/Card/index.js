import React from 'react';
import { Card, Avatar } from 'antd';
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
      style={{ width: 240 }}
      cover={
        <div>
          <Options />
          <Avatar size={64} src={avatar} icon={<UserOutlined />} />
        </div>
      }
    >
      <Card.Meta
        title={<div>{title}</div>}
        description={
          <div>
            <p>{description}</p>
            {action && <button onClick={handleClick}>{action}</button>}
          </div>
        }
      />
    </Card>
  );
}

export default CardComponent;
