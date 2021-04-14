import React, { useEffect } from 'react';
import { Formik, Field } from 'formik';
import { Button, Form } from 'antd';
import messages from './messages';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import FormField from 'components/custom-components/Form/FormField';
import { useParams } from 'react-router-dom';
import { resetPassword } from 'redux/actions/Auth';
import { passwordMinLength } from 'constants/Validation';
import { makeIsResetPassword } from 'redux/selectors/Auth';
import { success } from 'components/shared-components/MessagesAlerts/index';
const { resetPasswordSchema } = require('utils/validations');

export const ValidPasswordFormat = () => {
  const { formatMessage } = useIntl();

  return (
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
};

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const isReset = useSelector(makeIsResetPassword());
  const { token } = useParams();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (isReset) {
      success(formatMessage(messages.passwordSuccessfullyChanged));
    }
  }, [isReset]);

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
              label={formatMessage(messages.passwordInputLabel)}
              component={FormField}
              name={'password'}
              tooltipText={ValidPasswordFormat}
              secureField
              errorTexts={{
                label: formatMessage(messages.passwordInputLabel),
                matchesLabel: formatMessage(messages.matches_password),
              }}
            />
            <Field
              label={formatMessage(messages.passwordRepeatInputLabel)}
              component={FormField}
              name={'passwordRepeat'}
              secureField
              errorTexts={{
                label: formatMessage(messages.passwordRepeatInputLabel),
                value: formatMessage(messages.passwordInputLabel),
              }}
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
