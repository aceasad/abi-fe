import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Menu, Layout, Button, Space } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Logo from './Logo';
import { toggleCollapsedNav, onMobileNavToggle } from 'redux/actions/Theme';
import {
  NAV_TYPE_TOP,
  SIDE_NAV_COLLAPSED_WIDTH,
  SIDE_NAV_WIDTH,
} from 'constants/ThemeConstant';
import { LogoutOutlined } from '@ant-design/icons';
import utils from 'utils';
import { useIntl } from 'react-intl';
import { signOut } from 'redux/actions/Auth';
import { useDispatch } from 'react-redux';

const { Header } = Layout;

export const HeaderNav = (props) => {
  const {
    navCollapsed,
    mobileNav,
    navType,
    headerNavColor,
    toggleCollapsedNav,
    onMobileNavToggle,
    isMobile,
    currentTheme,
  } = props;
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const onToggle = () => {
    if (!isMobile) {
      toggleCollapsedNav(!navCollapsed);
    } else {
      onMobileNavToggle(!mobileNav);
    }
  };

  const isNavTop = navType === NAV_TYPE_TOP ? true : false;
  const mode = () => {
    if (!headerNavColor) {
      return utils.getColorContrast(
        currentTheme === 'dark' ? '#00000' : '#ffffff'
      );
    }
    return utils.getColorContrast(headerNavColor);
  };
  const navMode = mode();
  const getNavWidth = () => {
    if (isNavTop || isMobile) {
      return '0px';
    }
    if (navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
    } else {
      return `${SIDE_NAV_WIDTH}px`;
    }
  };
  return (
    <Header
      className={`app-header ${navMode}`}
      style={{ backgroundColor: headerNavColor }}
    >
      <div className={`app-header-wrapper ${isNavTop ? 'layout-top-nav' : ''}`}>
        <Logo logoType={navMode} />
        <div className="nav" style={{ width: `calc(100% - ${getNavWidth()})` }}>
          <div className="nav-left">
            <Menu mode="horizontal">
              {isNavTop && !isMobile ? null : (
                <Menu.Item
                  key="0"
                  onClick={() => {
                    onToggle();
                  }}
                >
                  {navCollapsed || isMobile ? (
                    <MenuUnfoldOutlined className="nav-icon" />
                  ) : (
                    <MenuFoldOutlined className="nav-icon" />
                  )}
                </Menu.Item>
              )}
            </Menu>
          </div>
          <Space className="nav-right">
            <Button onClick={() => dispatch(signOut())}>
              <LogoutOutlined />
              {formatMessage({ id: 'login_page.text.log_out' })}
            </Button>
          </Space>
        </div>
      </div>
    </Header>
  );
};

const mapStateToProps = ({ theme }) => {
  const {
    navCollapsed,
    navType,
    headerNavColor,
    mobileNav,
    currentTheme,
  } = theme;
  return { navCollapsed, navType, headerNavColor, mobileNav, currentTheme };
};

export default connect(mapStateToProps, {
  toggleCollapsedNav,
  onMobileNavToggle,
})(HeaderNav);
