import React from 'react';
import { Drawer } from 'antd';
import { connect } from 'react-redux';
import { NAV_TYPE_SIDE } from 'constants/ThemeConstant';
import { Scrollbars } from 'react-custom-scrollbars';
import MenuContent from './MenuContent';
import { onMobileNavToggle } from 'redux/actions/Theme';
import Logo from './Logo';
import Flex from 'components/shared-components/Flex';
import { ArrowLeftOutlined } from '@ant-design/icons';

export const MobileNav = ({
  sideNavTheme,
  mobileNav,
  onMobileNavToggle,
  routeInfo,
  hideGroupTitle,
  localization = true,
}) => {
  const onClose = () => {
    onMobileNavToggle(false);
  };

  const props = {
    sideNavTheme,
    routeInfo,
    hideGroupTitle,
    localization,
    isMobile: true, // Explicitly set isMobile to true for mobile drawer
    onMobileNavToggle, // Pass the toggle function
    closeMobileDrawer: onClose, // Pass the close function directly
  };

  return (
    <Drawer
      placement="left"
      closable={false}
      onClose={onClose}
      open={mobileNav}
      styles={{ body: { padding: 5 } }}
    >
      <Flex flexDirection="column" className="h-100">
        <Flex justifyContent="between" alignItems="center">
          <Logo mobileLogo={true} />
          <div className="nav-close" onClick={() => onClose()}>
            <ArrowLeftOutlined />
          </div>
        </Flex>
        <div className="mobile-nav-menu">
          <Scrollbars autoHide>
            <MenuContent type={NAV_TYPE_SIDE} {...props} />
          </Scrollbars>
        </div>
      </Flex>
    </Drawer>
  );
};

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, sideNavTheme, mobileNav } = theme;
  return { navCollapsed, sideNavTheme, mobileNav };
};

export default connect(mapStateToProps, { onMobileNavToggle })(MobileNav);
