import React, { useEffect } from 'react';
import { interpolate } from 'utils/interpolate';
import { Formik, Field } from 'formik';
import { Button, Form } from 'antd';
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
        {interpolate("At least {min} characters", { min: passwordMinLength })}
      </div>
      <div>{"A mixture of both uppercase and lowercase letters"}</div>
      <div>{"A mixture of letters and numbers"}</div>
      <div>{"Inclusion of at least one special character, e.g., ! @ # ? ]"}</div>
      <div>{"Note: do not use < or > in your password, as both can cause problems in Web browsers"}</div>
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
      success("Password successfully changed.");
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
              label={"New Password"}
              component={FormField}
              name={'password'}
              tooltipText={ValidPasswordFormat}
              secureField
              errorTexts={{
                label: "New Password",
                matchesLabel: "Password must be in valid format",
              }}
            />
            <Field
              label={"Confirm New Password"}
              component={FormField}
              name={'passwordRepeat'}
              secureField
              errorTexts={{
                label: "Confirm New Password",
                value: "New Password",
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
                {"Confirm"}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
