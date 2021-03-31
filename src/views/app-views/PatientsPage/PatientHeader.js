import { Button, Typography } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';

const { Title } = Typography;

const PatientHeader = ({
  title,
  secondaryAction,
  primaryAction,
  primaryDisabled,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Header className="ant-layout-page-header border-bottom d-flex justify-content-sm-between">
      <Title className="mb-sm-0">{title}</Title>
      <div>
        <Button
          type="primary"
          danger
          className="mr-3"
          onClick={secondaryAction}
        >
          {formatMessage(messages.cancel)}
        </Button>
        <Button
          type="primary"
          onClick={primaryAction}
          disabled={primaryDisabled}
        >
          {formatMessage(messages.save)}
        </Button>
      </div>
    </Header>
  );
};

export default PatientHeader;
