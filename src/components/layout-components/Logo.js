import React from 'react';
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_TYPE_TOP,
} from 'constants/ThemeConstant';
import { APP_NAME } from 'configs/AppConfig';
import { connect } from 'react-redux';
import utils from 'utils';
import { Grid } from 'antd';
import { URL_PREFIX_PATH } from 'configs/AppConfig';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { useSelector } from 'react-redux';

const { useBreakpoint } = Grid;

const getLogoWidthGutter = (props, isMobile) => {
  const { navCollapsed, navType } = props;
  const isNavTop = navType === NAV_TYPE_TOP ? true : false;
  if (isMobile && !props.mobileLogo) {
    return 0;
  }
  if (isNavTop) {
    return 'auto';
  }
  if (navCollapsed) {
    return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
  } else {
    return `${SIDE_NAV_WIDTH}px`;
  }
};

const getLogo = (props) => {
  const { logoType } = props;
  if (logoType === 'light') {
    return `${URL_PREFIX_PATH}/img/logo-sm-white.png`;
  }
  return `${URL_PREFIX_PATH}/img/logo-sm.png`;
};

const getLogoDisplay = (isMobile, mobileLogo) => {
  if (isMobile && !mobileLogo) {
    return 'd-none';
  } else {
    return 'logo';
  }
};

export const Logo = (props) => {
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
  const clinic = useSelector(makeSelectClinic());
  const organizationName = clinic?.name || '';

  return (
    <div
      className={getLogoDisplay(isMobile, props.mobileLogo)}
      style={{ width: `${getLogoWidthGutter(props, isMobile)}` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
        <img
          src={getLogo(props)}
          alt={`${APP_NAME} logo`}
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
        />
        {!props.navCollapsed && (
          <span
            style={{
              marginLeft: '12px',
              color: props.logoType === 'light' ? '#fff' : '#000',
              fontSize: '16px',
              fontWeight: '500',
              letterSpacing: '0.5px'
            }}
          >
            {organizationName}
          </span>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, navType } = theme;
  return { navCollapsed, navType };
};

export default connect(mapStateToProps)(Logo);
