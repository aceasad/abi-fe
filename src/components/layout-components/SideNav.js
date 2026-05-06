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
    >
      <div className="side-nav-content">
        <div className="side-nav-header">
          <Logo logoType={sideNavTheme === SIDE_NAV_DARK ? 'light' : 'dark'} />
        </div>
        <div className="side-nav-scroll-container">
          <Scrollbars autoHide>
            <MenuContent type={NAV_TYPE_SIDE} {...props} />
          </Scrollbars>
        </div>
      </div>
      <div
        className="sider-trigger"
        onClick={handleTriggerClick}
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
