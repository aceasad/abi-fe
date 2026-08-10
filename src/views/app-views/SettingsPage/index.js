import React from 'react';
import {
  FormOutlined,
  LockOutlined,
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Card, Layout, Menu, Typography, Grid, Select } from 'antd';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import EditClinic from './EditClinic';
import ProfileSettings from './ProfileSettings';
import IndustryAverage from '../IndustryAveragePage';
import UserSettings from '../UserSettings';
import AdvancedSettings from './AdvancedSettings';
import ClinicLocations from './ClinicLocations';
import { useSelector } from 'react-redux';
import { makeSelectIsOrganizationOwner } from 'redux/selectors/Auth';
import utils from 'utils';

const { Title } = Typography;
const { useBreakpoint } = Grid;
const { Option } = Select;

const SettingOption = ({ match, location, isOrganizationOwner, isMobile, isTablet, showLocations }) => {
  const history = useHistory();

  const menuItems = [
    {
      key: `${match.url}/edit-clinic`,
      icon: <FormOutlined />,
      label: "Edit Clinic",
      path: 'edit-clinic'
    },
    {
      key: `${match.url}/profile-settings`,
      icon: <LockOutlined />,
      label: "Profile Settings",
      path: 'profile-settings'
    },
    ...(isOrganizationOwner ? [
      {
        key: `${match.url}/user-settings`,
        icon: <TeamOutlined />,
        label: "User Settings",
        path: 'user-settings'
      },
      {
        key: `${match.url}/advanced-settings`,
        icon: <SettingOutlined />,
        label: "Advanced Settings",
        path: 'advanced-settings'
      },
    ] : []),
    ...(showLocations ? [
      {
        key: `${match.url}/clinic-locations`,
        icon: <EnvironmentOutlined />,
        label: "Clinic Locations",
        path: 'clinic-locations'
      },
    ] : []),
    {
      key: `${match.url}/industry-average`,
      icon: <BarChartOutlined />,
      label: "Industry Average",
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

const SettingContent = ({ match, isOrganizationOwner, showLocations }) => {
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
      {showLocations && (
        <Route
          path={`${match.url}/clinic-locations`}
          component={ClinicLocations}
        />
      )}
      {isOrganizationOwner && (
        <>
          <Route path={`${match.url}/user-settings`} component={UserSettings} />
          <Route
            path={`${match.url}/advanced-settings`}
            component={AdvancedSettings}
          />
        </>
      )}
    </Switch>
  );
};

const SettingsPage = (props) => {
  const isOrganizationOwner = useSelector(makeSelectIsOrganizationOwner());
  const { PASProvider, isPasIntegrated } = useSelector((state) => state.auth.user || {});
  const showLocations =
    (PASProvider || '').toLowerCase() === 'internal' && !isPasIntegrated;
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isTablet = screens.includes('md') && !screens.includes('lg');

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <div className="mb-4" style={{ paddingTop: isMobile ? 0 : '24px' }}>
        <Typography.Title level={3} style={{ margin: 0, marginBottom: '16px' }}>
          Settings
        </Typography.Title>
      </div>

      <Layout>
        <Card styles={{ body: { padding: isMobile ? '16px' : '24px' } }}>
          <SettingOption
            {...props}
            isOrganizationOwner={isOrganizationOwner}
            isMobile={isMobile}
            isTablet={isTablet}
            showLocations={showLocations}
          />
          <div style={{ marginTop: isMobile ? '16px' : '24px' }} />
          <SettingContent
            {...props}
            isOrganizationOwner={isOrganizationOwner}
            showLocations={showLocations}
          />
        </Card>
      </Layout>
    </div>
  );
};

export default SettingsPage;
