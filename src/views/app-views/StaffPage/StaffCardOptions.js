import React from 'react';
import { Menu, Dropdown } from 'antd';
import messages from './messages';
import { OPTION_KEYS } from './StaffList';
import { EllipsisOutlined } from '@ant-design/icons';

function StaffCardOptions({ handleMenuClick }) {

  const dropdownMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key={OPTION_KEYS.EDIT}>
        {messages.edit}
      </Menu.Item>
      <Menu.Item key={OPTION_KEYS.DELETE}>
        {messages.delete}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={dropdownMenu}
      placement="bottomRight"
      trigger={['click']}
      className="ant-card-staff-options"
    >
      <div className="ellipsis-dropdown align-self-center">
        <EllipsisOutlined />
      </div>
    </Dropdown>
  );
}

export default StaffCardOptions;
