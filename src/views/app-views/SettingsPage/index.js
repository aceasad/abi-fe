import React from 'react';
import {
  FormOutlined,
  LockOutlined,
  BarChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Layout, Menu, Typography, Grid, Select } from 'antd';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import EditClinic from './EditClinic';
import ProfileSettings from './ProfileSettings';
import messages from './messages';
import { useIntl } from 'react-intl';
import IndustryAverage from '../IndustryAveragePage';
import UserSettings from '../UserSettings';
import { useSelector } from 'react-redux';
import { makeSelectIsOrganizationOwner } from 'redux/selectors/Auth';
import utils from 'utils';

const { Title } = Typography;
const { useBreakpoint } = Grid;
const { Option } = Select;

const SettingOption = ({ match, location, isOrganizationOwner, isMobile, isTablet }) => {
  const { formatMessage } = useIntl();
  const history = useHistory();

  const menuItems = [
    {
      key: `${match.url}/edit-clinic`,
      icon: <FormOutlined />,
      label: formatMessage(messages.editClinicMenuLabel),
      path: 'edit-clinic'
    },
    {
      key: `${match.url}/profile-settings`,
      icon: <LockOutlined />,
      label: formatMessage(messages.profileSettingsTitle),
      path: 'profile-settings'
    },
    ...(isOrganizationOwner ? [{
      key: `${match.url}/user-settings`,
      icon: <TeamOutlined />,
      label: formatMessage(messages.userSettings),
      path: 'user-settings'
    }] : []),
    {
      key: `${match.url}/industry-average`,
      icon: <BarChartOutlined />,
      label: formatMessage(messages.industryAverageMenuLabel),
      path: 'industry-average'
    },
  ];

  if (isMobile) {
    // Mobile/Tablet: Dropdown selector
    const currentItem = menuItems.find(item => item.key === location.pathname);

    return (
      <Select
        value={location.pathname}
        onChange={(value) => {
          const item = menuItems.find(i => i.key === value);
          if (item) {
            history.push(`${match.url}/${item.path}`);
          }
        }}
        style={{ width: '100%', maxWidth: isMobile && !isTablet ? '100%' : '400px' }}
        size="large"
      >
        {menuItems.map(item => (
          <Option key={item.key} value={item.key}>
            {item.icon} {item.label}
          </Option>
        ))}
      </Select>
    );
  }

  // Desktop: Horizontal menu
  return (
    <Menu
      defaultSelectedKeys={`${match.url}/edit-clinic`}
      mode="horizontal"
      selectedKeys={[location.pathname]}
    >
      {menuItems.map(item => (
        <Menu.Item key={item.key}>
          {item.icon}
          <span>{item.label}</span>
          <Link to={item.path} />
        </Menu.Item>
      ))}
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
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isTablet = screens.includes('md') && !screens.includes('lg');

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <div className="mb-4" style={{ paddingTop: isMobile ? 0 : '24px' }}>
        <Typography.Title level={2} style={{ margin: 0, marginBottom: '16px' }}>
          Settings
        </Typography.Title>
      </div>

      <Layout>
        <Card styles={{ body: { padding: isMobile ? '16px' : '24px' } }}>
          <SettingOption {...props} isOrganizationOwner={isOrganizationOwner} isMobile={isMobile} isTablet={isTablet} />
          <div style={{ marginTop: isMobile ? '16px' : '24px' }} />
          <SettingContent
            {...props}
            isOrganizationOwner={isOrganizationOwner}
          />
        </Card>
      </Layout>
    </div>
  );
};

export default SettingsPage;
