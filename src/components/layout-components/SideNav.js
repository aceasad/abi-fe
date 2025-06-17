import React from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_DARK,
  NAV_TYPE_SIDE,
} from 'constants/ThemeConstant';
import { Scrollbars } from 'react-custom-scrollbars';
import MenuContent from './MenuContent';
import Logo from './Logo';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { toggleCollapsedNav } from 'redux/actions/Theme';

const { Sider } = Layout;

export const SideNav = ({
  navCollapsed,
  sideNavTheme,
  routeInfo,
  hideGroupTitle,
  localization = true,
  mobileNav,
  isMobile,
  toggleCollapsedNav,
}) => {
  const props = { sideNavTheme, routeInfo, hideGroupTitle, localization, navCollapsed, isMobile };

  const handleTriggerClick = () => {
    toggleCollapsedNav(!navCollapsed);
  };

  return (
    <Sider
      collapsible
      collapsed={navCollapsed}
      className={`side-nav ${sideNavTheme === SIDE_NAV_DARK ? 'side-nav-dark' : ''}`}
      width={SIDE_NAV_WIDTH}
      trigger={null}
      style={{
        position: 'fixed',
        top: 0,
        height: '100vh',
        background: sideNavTheme === SIDE_NAV_DARK ? '#001529' : '#fff'
      }}
    >
      <div className="side-nav-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="side-nav-header" style={{ padding: 0, margin: 0 }}>
          <Logo logoType={sideNavTheme === SIDE_NAV_DARK ? 'light' : 'dark'} />
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Scrollbars autoHide>
            <MenuContent type={NAV_TYPE_SIDE} {...props} />
          </Scrollbars>
        </div>
      </div>
      <div
        className="sider-trigger"
        onClick={handleTriggerClick}
        style={{
          position: 'absolute',
          right: '-12px',
          top: '72px',
          width: '24px',
          height: '24px',
          background: sideNavTheme === SIDE_NAV_DARK ? '#001529' : '#fff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          zIndex: 1,
          color: sideNavTheme === SIDE_NAV_DARK ? '#fff' : '#001529'
        }}
      >
        {navCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </Sider>
  );
};

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, sideNavTheme, mobileNav, isMobile } = theme;
  return { navCollapsed, sideNavTheme, mobileNav, isMobile };
};

export default connect(mapStateToProps, { toggleCollapsedNav })(SideNav);
