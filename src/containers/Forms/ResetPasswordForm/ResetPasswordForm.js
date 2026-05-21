import React, { useEffect } from 'react';
import { interpolate } from 'utils/interpolate';
import { Formik, Field } from 'formik';
import { Button, Form } from 'antd';
import messages from './messages';
import { useDispatch, useSelector } from 'react-redux';
import FormField from 'components/custom-components/Form/FormField';
import { useHistory, useParams } from 'react-router-dom';
import { resetPassword } from 'redux/actions/Auth';
import { passwordMinLength } from 'constants/Validation';
import { makeIsResetPassword } from 'redux/selectors/Auth';
import { success } from 'components/shared-components/MessagesAlerts/index';
import { ROUTES } from 'routes';
const { resetPasswordSchema } = import('utils/validations');

export const ValidPasswordFormat = () => {

  return (
    <div>
      <div>
        {interpolate(messages.minimumCharacters, { min: passwordMinLength })}
      </div>
      <div>{messages.upperAndLowerMixture}</div>
      <div>{messages.lettersAndNumberMixture}</div>
      <div>{messages.specialCharacters}</div>
      <div>{messages.specialCharactersExcluded}</div>
    </div>
  );
};

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const isReset = useSelector(makeIsResetPassword());
  const { token } = useParams();

  const history = useHistory();

  useEffect(() => {
    if (isReset) {
      success(messages.passwordSuccessfullyChanged);
      history.push(ROUTES.LOGIN);
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
              label={messages.passwordInputLabel}
              component={FormField}
              name={'password'}
              tooltipText={ValidPasswordFormat}
              secureField
              errorTexts={{
                label: messages.passwordInputLabel,
                matchesLabel: messages.matches_password,
              }}
            />
            <Field
              label={messages.passwordRepeatInputLabel}
              component={FormField}
              name={'passwordRepeat'}
              secureField
              errorTexts={{
                label: messages.passwordRepeatInputLabel,
                value: messages.passwordInputLabel,
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
                {messages.confirmButton}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
