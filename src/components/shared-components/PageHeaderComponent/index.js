import React from 'react';
import { Typography, Button } from 'antd';
import { Header } from 'antd/lib/layout/layout';

const { Title } = Typography;

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
    <Header className="ant-layout-page-header border-bottom">
      <Title className="mb-0">{title}</Title>
      <div>
        <Button
          type="primary"
          danger
          key="2"
          className="mr-sm-3"
          onClick={handleSecondaryClick}
        >
          {secondaryAction}
        </Button>
        <Button
          key="1"
          type="primary"
          onClick={handlePrimaryClick}
          disabled={disablePrimary}
        >
          {primaryAction}
        </Button>
      </div>
    </Header>
  );
};

PageHeaderComponent.defaultProps = {
  subtitle: null,
  disablePrimary: false,
  handlePrimaryClick: () => {},
  handleSecondaryClick: () => {},
};

export default PageHeaderComponent;
