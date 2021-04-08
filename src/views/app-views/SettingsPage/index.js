import React from 'react';
import {
  FormOutlined,
  LockOutlined,
  BarChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import InnerAppLayout from 'layouts/inner-app-layout';
import EditClinic from './EditClinic';
import ChangePassword from './ChangePassword';
import messages from './messages';
import { useIntl } from 'react-intl';
import IndustryAverage from '../IndustryAveragePage';
import UserSettings from '../UserSettings';
import { useSelector } from 'react-redux';
import { makeSelectIsOrganizationOwner } from 'redux/selectors/Auth';

const SettingOption = ({ match, location, isOrganizationOwner }) => {
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
      <Menu.Item key={`${match.url}/industry-average`}>
        <BarChartOutlined />
        <span>{formatMessage(messages.industryAverageMenuLabel)}</span>
        <Link to={'industry-average'} />
      </Menu.Item>
      {isOrganizationOwner && (
        <Menu.Item key={`${match.url}/user-settings`}>
          <TeamOutlined />
          <span>{formatMessage(messages.userSettings)}</span>
          <Link to={'user-settings'} />
        </Menu.Item>
      )}
    </Menu>
  );
};

const SettingContent = ({ match, isOrganizationOwner }) => {
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/edit-clinic`} />
      <Route path={`${match.url}/edit-clinic`} component={EditClinic} />
      <Route path={`${match.url}/change-password`} component={ChangePassword} />
      <Route
        path={`${match.url}/industry-average`}
        component={IndustryAverage}
      />
      {isOrganizationOwner && (
        <Route path={`${match.url}/user-settings`} component={UserSettings} />
      )}
    </Switch>
  );
};

const SettingsPage = (props) => {
  const isOrganizationOwner = useSelector(makeSelectIsOrganizationOwner());

  return (
    <InnerAppLayout
      border
      sideContentWidth={320}
      sideContent={
        <SettingOption {...props} isOrganizationOwner={isOrganizationOwner} />
      }
      mainContent={
        <SettingContent {...props} isOrganizationOwner={isOrganizationOwner} />
      }
    />
  );
};

export default SettingsPage;
