import React from 'react';
import { Button, PageHeader } from 'antd';

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
      className="p-0 mb-4"
      title={title}
      extra={[
        <Button key="10" onClick={handleSecondaryClick}>
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
