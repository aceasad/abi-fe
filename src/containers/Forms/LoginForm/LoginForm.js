import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { signIn } from 'redux/actions/Auth';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Formik, Field } from 'formik';
import { loginSchema } from 'utils/validations';
import 'assets/sass/views/auth/login.scss';
import messages from './messages';
import { useIntl } from 'react-intl';
import { ROUTES } from 'routes';
import { passwordMinLength } from 'constants/Validation';
import FormField from 'components/custom-components/Form/FormField';
import { makeSelectLoginDetails } from 'redux/selectors/Users';

export const LoginForm = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const { loading, message, showMessage, token } = useSelector(
    makeSelectLoginDetails()
  );
  const { formatMessage } = useIntl();

  const onLogin = (values) => {
    dispatch(signIn(values));
  };

  useEffect(() => {
    if (token) {
      history.push(ROUTES.DASHBOARD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const PasswordLabel = ({ email }) => (
    <div className={'d-flex justify-content-between w-100 align-items-center'}>
      <span>{formatMessage(messages.passwordInputLabel)}</span>

      <span
        className="authentication-label-link"
        onClick={() => history.push(ROUTES.FORGOT_PASSWORD, email)}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
      >
        {formatMessage(messages.forgotPasswordLink)}
      </span>
    </div>
  );

  const ValidPasswordFormat = (
    <div>
      <div>
        {formatMessage(messages.minimumCharacters, { min: passwordMinLength })}
      </div>
      <div>{formatMessage(messages.upperAndLowerMixture)}</div>
      <div>{formatMessage(messages.lettersAndNumberMixture)}</div>
      <div>{formatMessage(messages.specialCharacters)}</div>
      <div>{formatMessage(messages.specialCharactersExcluded)}</div>
    </div>
  );

  return (
    <>
      <motion.div
        className="authentication-motion-message"
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      >
        {showMessage && formatMessage(message)}
      </motion.div>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          onLogin(values);
        }}
        validateOnMount={false}
      >
        {({ values, handleSubmit, dirty, isValid }) => (
          <Form layout="vertical" name="login-form">
            <Field
              component={FormField}
              label={formatMessage(messages.emailInputLabel)}
              name={'username'}
              prefix={<MailOutlined className="text-primary" />}
              errorTexts={{
                label: formatMessage(messages.emailInputLabel),
              }}
              autoFocus
            />
            <Field
              component={FormField}
              labelComponent={() => <PasswordLabel email={values.username} />}
              tooltipText={ValidPasswordFormat}
              name={'password'}
              prefix={<LockOutlined className="text-primary" />}
              secureField
              errorTexts={{
                label: formatMessage(messages.passwordInputLabel),
                minValue: passwordMinLength,
                matchesLabel: formatMessage(messages.passwordValidFormat),
              }}
              labelBlock={true}
            />

            <Form.Item className="mt-sm-5">
              <Button
                onClick={() => handleSubmit(values)}
                type="primary"
                htmlType="submit"
                block
                disabled={!dirty || !isValid}
                loading={loading}
              >
                {formatMessage(messages.loginButton)}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
