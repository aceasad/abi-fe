import React, { useEffect, useState } from 'react';
import LoginForm from 'containers/Forms/LoginForm/LoginForm';
import messages from './messages';
import { useIntl } from 'react-intl';
import AuthFormWrapper from 'components/layout-components/AuthFormWrapper';
import { API_BASE_URL } from 'configs/AppConfig';

const LoginPage = (props) => {
  const { formatMessage } = useIntl();

  const [apiHealthy, setApiHealthy] = useState('');
  const [rasaHealthy, setRasaHealthy] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/errors/api-health/`)
      .then((res) => setApiHealthy(res.ok))
      .catch(() => setApiHealthy(false));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/errors/rasa-health/`)
      .then((res) => setRasaHealthy(res.ok))
      .catch(() => setRasaHealthy(false));
  }, []);

  return (
    <>
      <AuthFormWrapper title={formatMessage(messages.loginTitle)}>
        <LoginForm {...props} />
        <div style={{ textAlign: 'center' }}>
          <h3>{!apiHealthy ? 'API services are down for maintenance' : ''}</h3>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3>
            {!rasaHealthy
              ? 'Communication with Asa AI is down for maintenance'
              : ''}
          </h3>
        </div>
      </AuthFormWrapper>
    </>
  );
};

export default LoginPage;
