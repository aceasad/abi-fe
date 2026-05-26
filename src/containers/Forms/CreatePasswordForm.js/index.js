import React from 'react';
import { interpolate } from 'utils/interpolate';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { createPassword } from 'redux/actions/Auth';

import { Formik, Field } from 'formik';
import { createPasswordSchema } from 'utils/validations';
import 'assets/sass/views/auth/login.scss';

import { passwordMinLength } from 'constants/Validation';
import FormField from 'components/custom-components/Form/FormField';
import { makeSelectLoginDetails } from 'redux/selectors/Auth';

export const CreatePassowrdForm = () => {
  const dispatch = useDispatch();

  const { loading } = useSelector(makeSelectLoginDetails());

  const onCreatePassword = (values) => {
    dispatch(createPassword(values));
  };

  const ValidPasswordFormat = (
    <div>
      <div>
        {interpolate("At least {min} characters", { min: passwordMinLength })}
      </div>
      <div>{"A mixture of both uppercase and lowercase letters"}</div>
      <div>{"A mixture of letters and numbers"}</div>
      <div>{"Inclusion of at least one special character, e.g., ! @ # ? ]"}</div>
      <div>{"Note: do not use < or > in your password, as both can cause problems in Web browsers"}</div>
      <div>{"Do not use a common password (for example: password, 12345678)."}</div>
      <div>{"Your password cannot be entirely numeric."}</div>
      <div>{"Your password must not be too similar to your personal information."}</div>
    </div>
  );

  return (
    <Formik
      initialValues={{ password: '', passwordRepeat: '' }}
      validationSchema={createPasswordSchema}
      onSubmit={onCreatePassword}
      validateOnMount={false}
    >
      {({ values, handleSubmit, dirty, isValid }) => (
        <Form layout="vertical" name="login-form">
          <Field
            component={FormField}
            label={"Password"}
            tooltipText={ValidPasswordFormat}
            name={'password'}
            prefix={<LockOutlined className="text-primary" />}
            secureField
            errorTexts={{
              label: "Password",
              minValue: passwordMinLength,
              matchesLabel: "Password must be in valid format",
            }}
          />
          <Field
            component={FormField}
            label={"Repeat password"}
            tooltipText={ValidPasswordFormat}
            name={'passwordRepeat'}
            prefix={<LockOutlined className="text-primary" />}
            secureField
            errorTexts={{
              label: "Repeat password",
              minValue: passwordMinLength,
              matchesLabel: "Password must be in valid format",
              value: "Password",
            }}
          />

          <Form.Item className="mt-sm-5">
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={!dirty || !isValid}
              loading={loading}
              onClick={() => handleSubmit(values)}
            >
              {"Create password"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Formik>
  );
};

export default CreatePassowrdForm;
