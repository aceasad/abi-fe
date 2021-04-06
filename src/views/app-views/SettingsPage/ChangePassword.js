import { LockOutlined } from '@ant-design/icons';
import { Button, Col, Form, message, Row } from 'antd';
import FormField from 'components/custom-components/Form/FormField';
import ValidPasswordFormatTooltip from 'components/custom-components/Tooltips/ValidPasswordFormatTooltip';
import { passwordMinLength } from 'constants/Validation';
import { Field, Formik } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from 'redux/actions/Auth';
import { setInvalidOldPasswordError } from 'redux/actions/Error';
import { makeSelectLoading } from 'redux/selectors/Auth';
import { makeSelectInvalidOldPasswordError } from 'redux/selectors/Error';
import { changePasswordSchema } from 'utils/validations';
import messages from './messages';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const loading = useSelector(makeSelectLoading());
  const invalidOldPasswordError = useSelector(
    makeSelectInvalidOldPasswordError()
  );

  const hideInvalidPasswordError = () => {
    if (invalidOldPasswordError) dispatch(setInvalidOldPasswordError(false));
  };

  const showSuccess = () =>
    message.success({
      content: formatMessage(messages.passwordChanged),
      duration: 2,
    });

  const showError = () =>
    message.error({
      content: formatMessage(messages.changePasswordError),
      duration: 2,
    });

  const handleSubmit = (changePasswordData, { resetForm }) => {
    dispatch(
      changePassword({
        data: {
          old_password: changePasswordData.oldPassword.trim(),
          new_password: changePasswordData.newPassword.trim(),
        },
        showSuccess,
        showError,
        resetForm,
      })
    );
  };

  return (
    <>
      <h2 className="mb-4">
        {formatMessage(messages.changePasswordMenuLabel)}
      </h2>
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
                  tooltipText={ValidPasswordFormatTooltip}
                  name={'oldPassword'}
                  prefix={<LockOutlined className="text-primary" />}
                  secureField
                  errorTexts={{
                    label: formatMessage(messages.oldPasswordInputLabel),
                    minValue: passwordMinLength,
                    matchesLabel: formatMessage(messages.passwordValidFormat),
                  }}
                  onFocus={hideInvalidPasswordError}
                />

                {invalidOldPasswordError && (
                  <p className="authentication-error">
                    {formatMessage(messages.invalidOldPassword)}
                  </p>
                )}
                <Field
                  component={FormField}
                  label={formatMessage(messages.newPasswordInputLabel)}
                  tooltipText={ValidPasswordFormatTooltip}
                  name={'newPassword'}
                  prefix={<LockOutlined className="text-primary" />}
                  secureField
                  errorTexts={{
                    label: formatMessage(messages.newPasswordInputLabel),
                    minValue: passwordMinLength,
                    matchesLabel: formatMessage(messages.passwordValidFormat),
                  }}
                />
                <Field
                  component={FormField}
                  label={formatMessage(messages.newPasswordConfirmInputLabel)}
                  tooltipText={ValidPasswordFormatTooltip}
                  name={'newPasswordConfirm'}
                  prefix={<LockOutlined className="text-primary" />}
                  secureField
                  errorTexts={{
                    label: formatMessage(messages.newPasswordConfirmInputLabel),
                    minValue: passwordMinLength,
                    matchesLabel: formatMessage(messages.passwordValidFormat),
                    value: formatMessage(messages.newPasswordInputLabel),
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
