import React from 'react';
import { Formik, Field } from 'formik';
import { Button, Form } from 'antd';
import messages from './messages';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import FormField from 'components/shared-components/Form/FormField';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../../../../redux/actions/Auth';

const { resetPasswordSchema } = require('utils/validations');

const ResetPasswordForm = (match) => {
  const dispatch = useDispatch();
  const { token, email } = useParams();
  const { formatMessage } = useIntl();

  const handleResetPassword = (values) => {
    dispatch(resetPassword(values.password, token));
  };

  return (
    <div>
      <Formik
        initialValues={{ password: '', passwordRepeat: '' }}
        validationSchema={resetPasswordSchema}
        onSubmit={handleResetPassword}
      >
        {({ values, handleSubmit, dirty, isValid }) => (
          <Form layout="vertical" name="login-form">
            <Field
              component={FormField}
              name={'password'}
              secureField
              errorTexts={{
                label: formatMessage(messages.passwordInputLabel),
                matchesLabel: formatMessage(messages.matches_password),
              }}
              autoFocus
            />
            <Field
              component={FormField}
              name={'passwordRepeat'}
              secureField
              errorTexts={{
                label: formatMessage(messages.passwordRepeatInputLabel),
                value: formatMessage(messages.passwordInputLabel),
              }}
              autoFocus
            />
            <Form.Item>
              <Button
                onClick={() => handleSubmit(values)}
                type="primary"
                htmlType="submit"
                block
                disabled={!dirty || !isValid}
              >
                {formatMessage(messages.confirmButton)}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
