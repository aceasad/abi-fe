import { Button, Typography, Grid } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import utils from 'utils';

const { useBreakpoint } = Grid;

const PatientHeader = ({
  title,
  secondaryAction,
  primaryAction,
  primaryDisabled,
}) => {
  const { formatMessage } = useIntl();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  return (
    <PageHeader
      className="p-0 mb-4"
      title={
        isMobile ? (
          <Typography.Title level={3} className="mb-0">
            {title}
          </Typography.Title>
        ) : (
          ''
        )
      }
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
