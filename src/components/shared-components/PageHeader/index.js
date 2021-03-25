import React from 'react';
import { PageHeader, Button } from 'antd';

const PageHeaderComponent = ({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  handlePrimaryClick,
  handleSecondaryClick,
  disablePrimary,
}) => {
  return (
    <PageHeader
      ghost={false}
      title={title}
      subTitle={subtitle}
      extra={[
        <Button key="2" onClick={handleSecondaryClick}>
          {secondaryAction}
        </Button>,
        <Button
          key="1"
          type="primary"
          onClick={handlePrimaryClick}
          disabled={disablePrimary}
        >
          {primaryAction}
        </Button>,
      ]}
    />
  );
};

PageHeaderComponent.defaultProps = {
  subtitle: null,
  disablePrimary: false,
  handlePrimaryClick: () => {},
  handleSecondaryClick: () => {},
};

export default PageHeaderComponent;
