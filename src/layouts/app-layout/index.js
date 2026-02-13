import React from 'react';
import { connect } from 'react-redux';
import SideNav from 'components/layout-components/SideNav';
import TopNav from 'components/layout-components/TopNav';
import Loading from 'components/shared-components/Loading';
import MobileNav from 'components/layout-components/MobileNav';
import HeaderNav from 'components/layout-components/HeaderNav';
import PageHeader from 'components/layout-components/PageHeader';
import Footer from 'components/layout-components/Footer';
import AppViews from 'views/app-views';
import { Layout, Grid, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { onMobileNavToggle } from 'redux/actions/Theme';

import { useNavigationConfig } from 'configs/NavigationConfig';
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_TYPE_SIDE,
  NAV_TYPE_TOP,
} from 'constants/ThemeConstant';
import utils from 'utils';
import { useThemeSwitcher } from 'react-css-theme-switcher';
const { Content } = Layout;
const { useBreakpoint } = Grid;

export const AppLayout = ({ navCollapsed, navType, location, onMobileNavToggle, mobileNav }) => {
  const navigationConfig = useNavigationConfig();
  const currentRouteInfo = utils.getRouteInfo(
    navigationConfig,
    location.pathname
  );
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isNavSide = navType === NAV_TYPE_SIDE;
  const isNavTop = navType === NAV_TYPE_TOP;
  const getLayoutGutter = () => {
    if (isNavTop || isMobile) {
      return 0;
    }
    return navCollapsed ? SIDE_NAV_COLLAPSED_WIDTH : SIDE_NAV_WIDTH;
  };

  const { status } = useThemeSwitcher();

  if (status === 'loading') {
    return <Loading cover="page" />;
  }

  return (
    <Layout>
      {/* {isNavTop && !isMobile ? <TopNav routeInfo={currentRouteInfo} /> : null} */}
      {!isMobile && <SideNav isMobile={isMobile} routeInfo={currentRouteInfo} />}

      {/* Floating hamburger button for mobile/tablet */}
      {isMobile && (
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => onMobileNavToggle(!mobileNav)}
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1000,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        />
      )}

      <Layout className="app-container">
        <Layout
          className="app-layout"
          style={{ paddingLeft: getLayoutGutter() }}
        >
          <div
            className={`app-content ${isNavTop ? 'layout-top-nav' : ''}`}
            style={{
              background: '#faf9f7',
              paddingTop: isMobile ? '70px' : '0'
            }}
          >
            <PageHeader
              display={currentRouteInfo?.breadcrumb}
              title={currentRouteInfo?.title}
            />
            <Content>
              <AppViews />
            </Content>
          </div>
          <Footer />
        </Layout>
      </Layout>
      {isMobile && <MobileNav />}
    </Layout>
  );
};

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, navType, locale, mobileNav } = theme;
  return { navCollapsed, navType, locale, mobileNav };
};

export default connect(mapStateToProps, { onMobileNavToggle })(React.memo(AppLayout));
