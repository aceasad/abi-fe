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

const { Sider } = Layout;

export const SideNav = ({
  navCollapsed,
  sideNavTheme,
  routeInfo,
  hideGroupTitle,
  localization = true,
  mobileNav,
  isMobile,
}) => {
  const props = { sideNavTheme, routeInfo, hideGroupTitle, localization, navCollapsed, isMobile };

  return (
    <Sider
      collapsible
      collapsed={navCollapsed}
      className={`side-nav ${sideNavTheme === SIDE_NAV_DARK ? 'side-nav-dark' : ''}`}
      width={SIDE_NAV_WIDTH}
      trigger={null}
      style={{ position: 'fixed', top: 0, height: '100vh' }}
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
    </Sider>
  );
};

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, sideNavTheme, mobileNav, isMobile } = theme;
  return { navCollapsed, sideNavTheme, mobileNav, isMobile };
};

export default connect(mapStateToProps)(SideNav);
