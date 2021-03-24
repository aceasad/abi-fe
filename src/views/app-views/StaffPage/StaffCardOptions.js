import React from 'react';
import { Menu, Dropdown } from 'antd';
import { useIntl } from 'react-intl';
import messages from './messages';
import { OPTION_KEYS } from './StaffList';

function StaffCardOptions({ styles = {}, handleMenuClick }) {
  const { formatMessage } = useIntl();

  return (
    <div style={styles}>
      <Dropdown.Button
        overlay={
          <Menu onClick={handleMenuClick}>
            <Menu.Item key={OPTION_KEYS.EDIT}>
              {formatMessage(messages.edit)}
            </Menu.Item>
            <Menu.Item key={OPTION_KEYS.DELETE}>
              {formatMessage(messages.delete)}
            </Menu.Item>
          </Menu>
        }
      />
    </div>
  );
}

export default StaffCardOptions;
