import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { createPassword } from 'redux/actions/Auth';

import { Formik, Field } from 'formik';
import { createPasswordSchema } from 'utils/validations';
import 'assets/sass/views/auth/login.scss';
import messages from './messages';
import { useIntl } from 'react-intl';

import { passwordMinLength } from 'constants/Validation';
import FormField from 'components/custom-components/Form/FormField';
import { makeSelectLoginDetails } from 'redux/selectors/Auth';

export const CreatePassowrdForm = () => {
  const dispatch = useDispatch();

  const { loading } = useSelector(makeSelectLoginDetails());
  const { formatMessage } = useIntl();

  const onCreatePassword = (values) => {
    dispatch(createPassword(values));
  };

  const ValidPasswordFormat = (
    <div>
      <div>
        {formatMessage(messages.minimumCharacters, { min: passwordMinLength })}
      </div>
      <div>{formatMessage(messages.upperAndLowerMixture)}</div>
      <div>{formatMessage(messages.lettersAndNumberMixture)}</div>
      <div>{formatMessage(messages.specialCharacters)}</div>
      <div>{formatMessage(messages.specialCharactersExcluded)}</div>
      <div>{formatMessage(messages.notCommonPassword)}</div>
      <div>{formatMessage(messages.notEntirelyNumeric)}</div>
      <div>{formatMessage(messages.notSimilarToPersonalInfo)}</div>
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
            label={formatMessage(messages.passwordInputLabel)}
            tooltipText={ValidPasswordFormat}
            name={'password'}
            prefix={<LockOutlined className="text-primary" />}
            secureField
            errorTexts={{
              label: formatMessage(messages.passwordInputLabel),
              minValue: passwordMinLength,
              matchesLabel: formatMessage(messages.passwordValidFormat),
            }}
          />
          <Field
            component={FormField}
            label={formatMessage(messages.passwordRepeatInputLabel)}
            tooltipText={ValidPasswordFormat}
            name={'passwordRepeat'}
            prefix={<LockOutlined className="text-primary" />}
            secureField
            errorTexts={{
              label: formatMessage(messages.passwordRepeatInputLabel),
              minValue: passwordMinLength,
              matchesLabel: formatMessage(messages.passwordValidFormat),
              value: formatMessage(messages.passwordInputLabel),
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
              {formatMessage(messages.createPassword)}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Formik>
  );
};

export default CreatePassowrdForm;
