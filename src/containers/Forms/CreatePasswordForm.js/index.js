import React from 'react';
import { interpolate } from 'utils/interpolate';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { createPassword } from 'redux/actions/Auth';

import { Formik, Field } from 'formik';
import { createPasswordSchema } from 'utils/validations';
import 'assets/sass/views/auth/login.scss';
import messages from './messages';

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
        {interpolate(messages.minimumCharacters, { min: passwordMinLength })}
      </div>
      <div>{messages.upperAndLowerMixture}</div>
      <div>{messages.lettersAndNumberMixture}</div>
      <div>{messages.specialCharacters}</div>
      <div>{messages.specialCharactersExcluded}</div>
      <div>{messages.notCommonPassword}</div>
      <div>{messages.notEntirelyNumeric}</div>
      <div>{messages.notSimilarToPersonalInfo}</div>
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
            label={messages.passwordInputLabel}
            tooltipText={ValidPasswordFormat}
            name={'password'}
            prefix={<LockOutlined className="text-primary" />}
            secureField
            errorTexts={{
              label: messages.passwordInputLabel,
              minValue: passwordMinLength,
              matchesLabel: messages.passwordValidFormat,
            }}
          />
          <Field
            component={FormField}
            label={messages.passwordRepeatInputLabel}
            tooltipText={ValidPasswordFormat}
            name={'passwordRepeat'}
            prefix={<LockOutlined className="text-primary" />}
            secureField
            errorTexts={{
              label: messages.passwordRepeatInputLabel,
              minValue: passwordMinLength,
              matchesLabel: messages.passwordValidFormat,
              value: messages.passwordInputLabel,
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
              {messages.createPassword}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Formik>
  );
};

export default CreatePassowrdForm;
