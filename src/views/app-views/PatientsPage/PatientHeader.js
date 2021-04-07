import { Button, PageHeader } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';

const PatientHeader = ({
  title,
  secondaryAction,
  primaryAction,
  primaryDisabled,
}) => {
  const { formatMessage } = useIntl();

  return (
    <PageHeader
      className="p-0 mb-4"
      title={title}
      extra={[
        <Button key="0" onClick={secondaryAction}>
          {formatMessage(messages.cancel)}
        </Button>,
        <Button
          key="1"
          type="primary"
          onClick={primaryAction}
          disabled={primaryDisabled}
        >
          {formatMessage(messages.save)}
        </Button>,
      ]}
    />
  );
};

export default PatientHeader;
