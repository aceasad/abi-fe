import { Button, Card, PageHeader, Typography } from 'antd';
import ClinicForm from 'containers/Forms/ClinicForm/ClinicForm';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import localeString from 'utils/localeString';
import { signOut } from 'redux/actions/Auth';
import messages from './messages';

const { Title } = Typography;

const ClinicPage = ({ localization = true }) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  return (
    <>
      <PageHeader
        title={localeString(localization, 'clinic_page.header.title')}
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
      <Card>
        <ClinicForm />
      </Card>
    </>
  );
};

export default ClinicPage;
