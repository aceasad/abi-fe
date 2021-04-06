import React from 'react';
import { FormOutlined, LockOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import InnerAppLayout from 'layouts/inner-app-layout';
import EditClinic from './EditClinic';
import ChangePassword from './ChangePassword';
import messages from './messages';
import { useIntl } from 'react-intl';

const SettingOption = ({ match, location }) => {
  const { formatMessage } = useIntl();

  return (
    <Menu
      defaultSelectedKeys={`${match.url}/edit-clinic`}
      mode="inline"
      selectedKeys={[location.pathname]}
    >
      <Menu.Item key={`${match.url}/edit-clinic`}>
        <FormOutlined />
        <span>{formatMessage(messages.editClinicMenuLabel)}</span>
        <Link to={'edit-clinic'} />
      </Menu.Item>
      <Menu.Item key={`${match.url}/change-password`}>
        <LockOutlined />
        <span>{formatMessage(messages.changePasswordMenuLabel)}</span>
        <Link to={'change-password'} />
      </Menu.Item>
    </Menu>
  );
};

const SettingContent = ({ match }) => {
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/edit-clinic`} />
      <Route path={`${match.url}/edit-clinic`} component={EditClinic} />
      <Route path={`${match.url}/change-password`} component={ChangePassword} />
    </Switch>
  );
};

const SettingsPage = (props) => {
  return (
    <InnerAppLayout
      sideContentWidth={320}
      sideContent={<SettingOption {...props} />}
      mainContent={<SettingContent {...props} />}
    />
  );
};

export default SettingsPage;
