import React, { useContext, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Grid } from 'antd';
import Icon from '../util-components/Icon';
import { useNavigationConfig } from 'configs/NavigationConfig';
import { connect } from 'react-redux';
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from 'constants/ThemeConstant';
import utils from 'utils';
import { onMobileNavToggle, toggleCollapsedNav } from 'redux/actions/Theme';
import { useHistory } from 'react-router-dom';
import { beforeRoute, BeforeRouteContext } from 'utils/context';
import { generateKey } from 'utils/helpers';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { signOut } from 'redux/actions/Auth';
import { useSelector } from 'react-redux';
import { makeSelectVisibleUnreadCount } from 'redux/selectors/Notifications';
import { Badge } from 'antd';

const { SubMenu } = Menu;
const { useBreakpoint } = Grid;

const setDefaultOpen = (key) => {
  let keyList = [];
  let keyString = '';
  if (key) {
    const arr = key.split('-');
    for (let index = 0; index < arr.length; index++) {
      const elm = arr[index];
      index === 0 ? (keyString = elm) : (keyString = `${keyString}-${elm}`);
      keyList.push(keyString);
    }
  }
  return keyList;
};

const SideNavContent = ({
  sideNavTheme,
  routeInfo,
  hideGroupTitle,
  onMobileNavToggle,
  navCollapsed,
  isMobile,
  toggleCollapsedNav,
  closeMobileDrawer, // New prop for closing mobile drawer
}) => {
  const dispatch = useDispatch();
  const visibleUnreadCount = useSelector(makeSelectVisibleUnreadCount());
  const navigationConfig = useNavigationConfig();

  const history = useHistory();
  const [route, setRoute] = useState({});
  const { proceed, setContext, action } = useContext(BeforeRouteContext);

  const closeMobileNav = (e) => {
    e.preventDefault();
    setRoute({ path: e.target.pathname, key: generateKey() });
    if (isMobile) {
      onMobileNavToggle(false);
    }
  };

  // Handle menu item clicks
  const handleMenuClick = ({ key, domEvent }) => {
    // Skip if it's the logout button (handled separately)
    if (key === 'logout' || key === 'divider' || key === 'divider2') return;

    // Find the menu item path from navigationConfig
    const findMenuItem = (items, targetKey) => {
      for (const item of items) {
        if (item.key === targetKey) return item;
        if (item.submenu && item.submenu.length > 0) {
          const found = findMenuItem(item.submenu, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const menuItem = findMenuItem(navigationConfig, key);

    if (menuItem && menuItem.path) {
      // Navigate to the path first
      history.push(menuItem.path);

      // Close mobile drawer if closeMobileDrawer function exists (means we're in mobile nav)
      if (closeMobileDrawer) {
        closeMobileDrawer();
      }
    }
  };

  useEffect(() => {
    if (route && proceed) {
      setContext(beforeRoute);
      history.push(route.path);
    } else if (action.toString() == beforeRoute.action.toString()) {
      history.push(route.path);
    } else if (route) action();
  }, [proceed, route.key]);

  const onToggle = () => {
    if (!isMobile) {
      toggleCollapsedNav(!navCollapsed);
    } else {
      onMobileNavToggle(!isMobile);
    }
  };

  const convertMenuItems = (menus) => {
    return menus.map((menu) => {
      if (menu.submenu.length > 0) {
        return {
          key: menu.key,
          label: menu.title,
          type: 'group',
          children: menu.submenu.map((subMenuFirst) => {
            if (subMenuFirst.submenu.length > 0) {
              return {
                key: subMenuFirst.key,
                label: subMenuFirst.title,
                icon: subMenuFirst.icon ? <Icon type={subMenuFirst?.icon} /> : null,
                children: subMenuFirst.submenu.map((subMenuSecond) => ({
                  key: subMenuSecond.key,
                  label: (
                    <span>
                      {subMenuSecond.icon ? (
                        <Icon type={subMenuSecond?.icon} />
                      ) : null}
                      <span>
                        {subMenuSecond.title}
                      </span>
                    </span>
                  ),
                })),
              };
            } else {
              return {
                key: subMenuFirst.key,
                label: (
                  <span>
                    {subMenuFirst.icon ? <Icon type={subMenuFirst.icon} /> : null}
                    <span>{subMenuFirst.title}</span>
                  </span>
                ),
              };
            }
          }),
        };
      } else {
        return {
          key: menu.key,
          label: (
            <span>
              {menu.icon ? <Icon type={menu?.icon} /> : null}
              <span>
                {menu?.title}
              </span>
              {menu.key === 'notifications' && visibleUnreadCount > 0 && (
                <Badge
                  className="side-nav-notification-badge"
                  count={visibleUnreadCount}
                  size="default"
                />
              )}
            </span>
          ),
        };
      }
    });
  };

  const menuItems = [
    { type: 'divider', key: 'divider' },
    ...convertMenuItems(navigationConfig),
    { type: 'divider', key: 'divider2' },
    {
      key: 'logout',
      label: 'Log out',
      icon: <LogoutOutlined />,
      onClick: () => dispatch(signOut()),
    },
  ];

  return (
    <Menu
      // theme={sideNavTheme === SIDE_NAV_LIGHT ? 'light' : 'dark'}
      mode="inline"
      defaultSelectedKeys={[routeInfo?.key]}
      defaultOpenKeys={setDefaultOpen(routeInfo?.key)}
      selectedKeys={[routeInfo?.key]}
      className={`side-nav-menu ${hideGroupTitle ? 'hide-group-title' : ''}`}
      items={menuItems}
      onClick={handleMenuClick}
    />
  );
};

const TopNavContent = (props) => {
  const { topNavColor } = props;
  const navigationConfig = useNavigationConfig();

  const convertTopNavItems = (menus) => {
    return menus.map((menu) => {
      if (menu.submenu.length > 0) {
        return {
          key: menu.key,
          label: (
            <span>
              {menu.icon ? <Icon type={menu?.icon} /> : null}
              <span>{menu.title}</span>
            </span>
          ),
          popupClassName: "top-nav-menu",
          children: menu.submenu.map((subMenuFirst) => {
            if (subMenuFirst.submenu.length > 0) {
              return {
                key: subMenuFirst.key,
                label: subMenuFirst.title,
                icon: subMenuFirst.icon ? (
                  <Icon type={subMenuFirst?.icon} />
                ) : null,
                children: subMenuFirst.submenu.map((subMenuSecond) => ({
                  key: subMenuSecond.key,
                  label: (
                    <span>
                      {subMenuSecond.title}
                      <Link to={subMenuSecond.path} />
                    </span>
                  ),
                })),
              };
            } else {
              return {
                key: subMenuFirst.key,
                label: (
                  <span>
                    {subMenuFirst.icon ? (
                      <Icon type={subMenuFirst?.icon} />
                    ) : null}
                    <span>{subMenuFirst.title}</span>
                    <Link to={subMenuFirst.path} />
                  </span>
                ),
              };
            }
          }),
        };
      } else {
        return {
          key: menu.key,
          label: (
            <span>
              {menu.icon ? <Icon type={menu?.icon} /> : null}
              <span>{menu?.title}</span>
              {menu.path ? <Link to={menu.path} /> : null}
            </span>
          ),
        };
      }
    });
  };

  const topNavItems = convertTopNavItems(navigationConfig);

  return (
    <Menu
      mode="horizontal"
      style={{ backgroundColor: topNavColor }}
      items={topNavItems}
    />
  );
};

const MenuContent = (props) => {
  return props.type === NAV_TYPE_SIDE ? (
    <SideNavContent {...props} />
  ) : (
    <TopNavContent {...props} />
  );
};

const mapStateToProps = ({ theme }) => {
  const { sideNavTheme, topNavColor, navCollapsed, isMobile } = theme;
  return { sideNavTheme, topNavColor, navCollapsed, isMobile };
};

export default withRouter(
  connect(mapStateToProps, { onMobileNavToggle, toggleCollapsedNav })(MenuContent)
);
