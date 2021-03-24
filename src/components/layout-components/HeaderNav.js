import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Menu, Layout, Divider, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Logo from './Logo';
import { toggleCollapsedNav, onMobileNavToggle } from 'redux/actions/Theme';
import {
  NAV_TYPE_TOP,
  SIDE_NAV_COLLAPSED_WIDTH,
  SIDE_NAV_WIDTH,
} from 'constants/ThemeConstant';
import utils from 'utils';
import {
  LeftOutlined,
  RightOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { signOut } from 'redux/actions/Auth';
import { useDispatch } from 'react-redux';
import LocaleString from 'components/util-components/LocaleString/LocaleString';

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
    localization = true,
  } = props;
  const [searchActive, setSearchActive] = useState(false);
  const dispatch = useDispatch();

  const dropdownMenu = (
    <Menu>
      <Menu.Item key="0">
        <LocaleString
          isLocaleOn={localization}
          localeKey={'user_menu.company_settings'}
        />
      </Menu.Item>
      <Menu.Item key="1">
        <LocaleString
          isLocaleOn={localization}
          localeKey={'user_menu.user_settings'}
        />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={() => dispatch(signOut())}>
        <LocaleString
          isLocaleOn={localization}
          localeKey={'login_page.text.log_out'}
        />
      </Menu.Item>
    </Menu>
  );

  const onSearchClose = () => {
    setSearchActive(false);
  };

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
      style={{
        backgroundColor: headerNavColor,
        width: !isMobile ? 'auto' : '',
      }}
    >
      <div className={`app-header-wrapper ${isNavTop ? 'layout-top-nav' : ''}`}>
        <Dropdown overlay={dropdownMenu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            <Logo logoType={navMode} />
          </a>
        </Dropdown>
        <Divider type="vertical" className="nav-divider" />
        {!isMobile && (
          <div
            className="nav-collapse-button"
            onClick={() => {
              onToggle();
            }}
          >
            {navCollapsed ? (
              <RightOutlined className="text-primary" />
            ) : (
              <LeftOutlined className="text-primary" />
            )}
          </div>
        )}
        {isMobile && (
          <div
            className="nav"
            style={{ width: `calc(100% - ${getNavWidth()})` }}
          >
            {isNavTop && !isMobile ? null : (
              <div className="nav-left">
                <Menu mode="horizontal">
                  <Menu.Item
                    key="0"
                    onClick={() => {
                      onToggle();
                    }}
                  >
                    {navCollapsed || isMobile ? (
                      <MenuUnfoldOutlined className="nav-icon ml-2" />
                    ) : (
                      <MenuFoldOutlined className="nav-icon ml-2" />
                    )}
                  </Menu.Item>
                </Menu>
              </div>
            )}
            <Dropdown overlay={dropdownMenu} trigger={['click']}>
              <div className="ellipsis-dropdown align-self-center mr-3">
                <EllipsisOutlined />
              </div>
            </Dropdown>
          </div>
        )}
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
