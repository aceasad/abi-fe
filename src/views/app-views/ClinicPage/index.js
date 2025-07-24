import { Button, Card, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import ClinicForm from 'containers/Forms/ClinicForm/ClinicForm';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import localeString from 'utils/localeString';
import { signOut } from 'redux/actions/Auth';
import messages from './messages';

const ClinicPage = ({ localization = true }) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  return (
    <>
      <PageHeader
        title={
          <Typography.Title level={2} className="mb-0">
            {localeString(localization, 'clinic_page.header.title')}
          </Typography.Title>
        }
        extra={[
          <Button
            key="0"
            type="primary"
            onClick={() => {
              dispatch(signOut());
            }}
          >
            {formatMessage(messages.logout)}
          </Button>,
        ]}
      />
      <Card className="m-4">
        <ClinicForm />
      </Card>
    </>
  );
};

export default ClinicPage;
