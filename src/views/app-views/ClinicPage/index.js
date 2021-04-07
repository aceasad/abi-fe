import { Button, Card, Typography } from 'antd';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
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
    <Layout>
      <Header className="ant-layout-page-header border-bottom d-flex justify-content-sm-between">
        <Title className="mb-sm-0">
          {localeString(localization, 'clinic_page.header.title')}
        </Title>
        <Button
          type="primary"
          onClick={() => {
            dispatch(signOut());
          }}
        >
          {formatMessage(messages.logout)}
        </Button>
      </Header>
      <Content>
        <Card className="m-4">
          <ClinicForm />
        </Card>
      </Content>
    </Layout>
  );
};

export default ClinicPage;
