import { LockOutlined } from '@ant-design/icons';
import { Button, Col, Form, message, Row, Typography, Grid } from 'antd';
import FormField from 'components/custom-components/Form/FormField';
import ValidPasswordFormatTooltip from 'components/custom-components/Tooltips/ValidPasswordFormatTooltip';
import { passwordMinLength } from 'constants/Validation';
import { Field, Formik } from 'formik';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from 'redux/actions/Auth';
import { makeSelectLoading } from 'redux/selectors/Auth';
import { changePasswordSchema } from 'utils/validations';
import messages from './messages';
import utils from 'utils';

const { useBreakpoint } = Grid;

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isTablet = screens.includes('md') && !screens.includes('lg');

  const loading = useSelector(makeSelectLoading());

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
        {formatMessage(messages.changePasswordMenuLabel)}
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
                />

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
    </div>
  );
};

export default ChangePassword;
