import React from 'react';
import {
  FormOutlined,
  LockOutlined,
  BarChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Layout, Menu, Typography } from 'antd';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import EditClinic from './EditClinic';
import ProfileSettings from './ProfileSettings';
import messages from './messages';
import { useIntl } from 'react-intl';
import IndustryAverage from '../IndustryAveragePage';
import UserSettings from '../UserSettings';
import { useSelector } from 'react-redux';
import { makeSelectIsOrganizationOwner } from 'redux/selectors/Auth';
const { Title } = Typography;

const SettingOption = ({ match, location, isOrganizationOwner }) => {
  const { formatMessage } = useIntl();

  return (
    <Menu
      defaultSelectedKeys={`${match.url}/edit-clinic`}
      mode="horizontal"
      selectedKeys={[location.pathname]}
    >
      <Menu.Item key={`${match.url}/edit-clinic`}>
        <FormOutlined />
        <span>{formatMessage(messages.editClinicMenuLabel)}</span>
        <Link to={'edit-clinic'} />
      </Menu.Item>
      <Menu.Item key={`${match.url}/profile-settings`}>
        <LockOutlined />
        <span>{formatMessage(messages.profileSettingsTitle)}</span>
        <Link to={'profile-settings'} />
      </Menu.Item>
      {isOrganizationOwner && (
        <Menu.Item key={`${match.url}/user-settings`}>
          <TeamOutlined />
          <span>{formatMessage(messages.userSettings)}</span>
          <Link to={'user-settings'} />
        </Menu.Item>
      )}
      <Menu.Item key={`${match.url}/industry-average`}>
        <BarChartOutlined />
        <span>{formatMessage(messages.industryAverageMenuLabel)}</span>
        <Link to={'industry-average'} />
      </Menu.Item>
    </Menu>
  );
};

const SettingContent = ({ match, isOrganizationOwner }) => {
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/edit-clinic`} />
      <Route path={`${match.url}/edit-clinic`} component={EditClinic} />
      <Route
        path={`${match.url}/profile-settings`}
        component={ProfileSettings}
      />
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
    <>
      <Layout>
        <Card>
          <Title level={2} type="primary" className="text-wrap">
            Settings
          </Title>
          <div style={{ marginTop: '20px' }} />
          <SettingOption {...props} isOrganizationOwner={isOrganizationOwner} />
          <div style={{ marginTop: '20px' }} />
          <SettingContent
            {...props}
            isOrganizationOwner={isOrganizationOwner}
          />
        </Card>
      </Layout>
    </>
  );
};

export default SettingsPage;
