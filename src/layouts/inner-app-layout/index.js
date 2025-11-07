import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Drawer, Button } from 'antd';
import utils from 'utils';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

const SideContent = (props) => {
  const { sideContent, sideContentWidth = 250, border } = props;
  return (
    <div
      className={`side-content ${border ? 'with-border' : ''}`}
      style={{ width: `${sideContentWidth}px` }}
    >
      {sideContent}
    </div>
  );
};

const SideContentMobile = (props) => {
  const { sideContent, open, onSideContentClose } = props;
  return (
    <Drawer
      width={320}
      placement="left"
      closable={false}
      onClose={onSideContentClose}
      open={open}
      styles={{ body: { paddingLeft: 0, paddingRight: 0 } }}
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onSideContentClose}
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
        />
      }
    >
      <div className="h-100">{sideContent}</div>
    </Drawer>
  );
};

export const InnerAppLayout = (props) => {
  const { mainContent, pageHeader, sideContentGutter = true, border } = props;
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
  const [visible, setVisible] = useState(false);

  const close = (e) => {
    setVisible(false);
  };

  const openSideContentMobile = () => {
    setVisible(true);
  };

  // Clone sideContent and inject closeMobileDrawer prop if it's a valid React element
  const sideContentWithProps = isMobile && React.isValidElement(props.sideContent)
    ? React.cloneElement(props.sideContent, { closeMobileDrawer: close, isMobile: true })
    : props.sideContent;

  return (
    <div className={`${border ? 'border' : ''} inner-app-layout`}>
      {isMobile ? (
        <SideContentMobile
          sideContent={sideContentWithProps}
          open={visible}
          onSideContentClose={close}
        />
      ) : (
        <SideContent {...props} />
      )}
      <div
        className={`main-content ${pageHeader ? 'has-page-header' : ''} ${sideContentGutter ? 'gutter' : 'no-gutter'
          }`}
      >
        {isMobile ? (
          <div
            className={`font-size-lg mb-3 ${!sideContentGutter ? 'pt-3 px-3' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            <MenuOutlined
              onClick={() => openSideContentMobile()}
              style={{ fontSize: '20px' }}
            />
          </div>
        ) : null}
        {mainContent}
      </div>
    </div>
  );
};

InnerAppLayout.propTypes = {
  sideContent: PropTypes.node,
  mainContent: PropTypes.node,
  pageHeader: PropTypes.bool,
  sideContentWidth: PropTypes.number,
  border: PropTypes.bool,
  sideContentGutter: PropTypes.bool,
};

export default InnerAppLayout;
