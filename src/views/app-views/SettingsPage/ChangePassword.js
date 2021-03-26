import React from 'react';
import { Form, Button, Row, Col, message } from 'antd';
import { Field, Formik } from 'formik';
import FormField from 'components/shared-components/Form/FormField';
import messages from './messages';
import { useIntl } from 'react-intl';
import { LockOutlined } from '@ant-design/icons';
import { changePasswordSchema } from 'utils/validations';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from 'redux/actions/Auth';
import { makeSelectLoading } from 'redux/selectors/Auth';

const ChangePassword = () => {
  const dispatch = useDispatch();

  const loading = useSelector(makeSelectLoading());

  const showSuccess = () =>
    message.success({
      content: 'Password Changed!',
      duration: 2,
    });

  const showError = () =>
    message.error({
      content: 'Invalid old password. Try again.',
      duration: 2,
    });

  const handleSubmit = (changePasswordData, { resetForm }) => {
    console.log(changePasswordData);
    // TO DO - BE
    // ....
    dispatch(
      changePassword({
        data: {
          old_password: changePasswordData.oldPassword,
          new_password: changePasswordData.newPassword,
        },
        showSuccess,
        showError,
        resetForm,
      })
    );
  };
  const passwordMinLength = 8;
  const { formatMessage } = useIntl();

  const validPasswordFormat = (
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
      <h2 className="mb-4">Change Password</h2>
      <Row>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Formik
            initialValues={{
              oldPassword: '',
              newPassword: '',
              newPasswordConfirm: '',
            }}
            onSubmit={handleSubmit}
            validationSchema={changePasswordSchema}
          >
            {({ handleSubmit, dirty, isValid }) => (
              <Form>
                <Field
                  component={FormField}
                  label={formatMessage(messages.oldPasswordInputLabel)}
                  tooltipText={validPasswordFormat}
                  name={'oldPassword'}
                  prefix={<LockOutlined className="text-primary" />}
                  secureField
                  errorTexts={{
                    label: formatMessage(messages.oldPasswordInputLabel),
                    minValue: 8,
                    matchesLabel: 'Invalid password',
                  }}
                />
                <Field
                  component={FormField}
                  label={formatMessage(messages.newPasswordInputLabel)}
                  tooltipText={validPasswordFormat}
                  name={'newPassword'}
                  prefix={<LockOutlined className="text-primary" />}
                  secureField
                  errorTexts={{
                    label: formatMessage(messages.newPasswordInputLabel),
                    minValue: 8,
                    matchesLabel: 'Invalid password',
                  }}
                />
                <Field
                  component={FormField}
                  label={formatMessage(messages.newPasswordConfirmInputLabel)}
                  tooltipText={validPasswordFormat}
                  name={'newPasswordConfirm'}
                  prefix={<LockOutlined className="text-primary" />}
                  secureField
                  errorTexts={{
                    label: formatMessage(messages.newPasswordConfirmInputLabel),
                    minValue: 8,
                    matchesLabel: 'Invalid password',
                  }}
                />
                <Form.Item className="mt-sm-5">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    disabled={loading || !dirty || !isValid}
                    onClick={handleSubmit}
                  >
                    {formatMessage(messages.changePasswordBtn)}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </>
  );
};

export default ChangePassword;
