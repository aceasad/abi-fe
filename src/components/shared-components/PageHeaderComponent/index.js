import React from 'react';
import { Button, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-components';

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
      title={
        <Typography.Title level={2} className="mb-0">
          {title}
        </Typography.Title>
      }
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
  handlePrimaryClick: () => { },
  handleSecondaryClick: () => { },
};

export default PageHeaderComponent;
