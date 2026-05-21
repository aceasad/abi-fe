import { LockOutlined } from '@ant-design/icons';
import { Button, Col, Form, message, Row, Typography, Grid } from 'antd';
import FormField from 'components/custom-components/Form/FormField';
import ValidPasswordFormatTooltip from 'components/custom-components/Tooltips/ValidPasswordFormatTooltip';
import { passwordMinLength } from 'constants/Validation';
import { Field, Formik } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from 'redux/actions/Auth';
import { makeSelectLoading } from 'redux/selectors/Auth';
import { changePasswordSchema } from 'utils/validations';
import messages from './messages';
import utils from 'utils';

const { useBreakpoint } = Grid;

const ChangePassword = () => {
  const dispatch = useDispatch();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isTablet = screens.includes('md') && !screens.includes('lg');

  const loading = useSelector(makeSelectLoading());

  const showSuccess = () =>
    message.success({
      content: messages.passwordChanged,
      duration: 2,
    });

  const showError = () =>
    message.error({
      content: messages.changePasswordError,
      duration: 2,
    });

  const handleSubmit = (changePasswordData, { resetForm, setErrors }) => {
    dispatch(
      changePassword({
        data: {
          old_password: changePasswordData.oldPassword.trim(),
          new_password: changePasswordData.newPassword.trim(),
        },
        showSuccess,
        showError,
        resetForm,
        setErrors,
      })
    );
  };

  return (
    <div className="p-2">
      <Typography.Title level={3} className="mb-4">
        {messages.changePasswordMenuLabel}
      </Typography.Title>
      <Row>
        <Col xs={24} sm={24} md={isTablet ? 16 : 12} lg={10} xl={8}>
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
              <Form layout="vertical">
                <Field
                  component={FormField}
                  label={messages.oldPasswordInputLabel}
                  tooltipText={ValidPasswordFormatTooltip}
                  name={'oldPassword'}
                  prefix={<LockOutlined className="text-primary" />}
                  secureField
                  errorTexts={{
                    label: messages.oldPasswordInputLabel,
                    minValue: passwordMinLength,
                    matchesLabel: messages.passwordValidFormat,
                  }}
                />

                <Field
                  component={FormField}
                  label={messages.newPasswordInputLabel}
                  tooltipText={ValidPasswordFormatTooltip}
                  name={'newPassword'}
                  prefix={<LockOutlined className="text-primary" />}
                  secureField
                  errorTexts={{
                    label: messages.newPasswordInputLabel,
                    minValue: passwordMinLength,
                    matchesLabel: messages.passwordValidFormat,
                  }}
                />
                <Field
                  component={FormField}
                  label={messages.newPasswordConfirmInputLabel}
                  tooltipText={ValidPasswordFormatTooltip}
                  name={'newPasswordConfirm'}
                  prefix={<LockOutlined className="text-primary" />}
                  secureField
                  errorTexts={{
                    label: messages.newPasswordConfirmInputLabel,
                    minValue: passwordMinLength,
                    matchesLabel: messages.passwordValidFormat,
                    value: messages.newPasswordInputLabel,
                  }}
                />
                <Form.Item className="mt-sm-5">
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={loading || !dirty || !isValid}
                    onClick={handleSubmit}
                  >
                    {messages.changePasswordBtn}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </div>
  );
};

export default ChangePassword;
