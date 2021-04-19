import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { sendForgotPasswordEmail } from 'redux/actions/Auth';
import { motion } from 'framer-motion';
import { Field, Formik } from 'formik';
import { useSelector } from 'react-redux';
import messages from './messages';
import { useIntl } from 'react-intl';
import { forgotPasswordSchema } from 'utils/validations';
import { makeIsSendEmailUser } from 'redux/selectors/Auth';
import { success } from 'components/shared-components/MessagesAlerts/index';
import FormField from 'components/custom-components/Form/FormField';
export const ForgotPasswordForm = ({ email, showMessage }) => {
  const dispatch = useDispatch();
  const isSent = useSelector(makeIsSendEmailUser());

  const { formatMessage } = useIntl();

  const confirm = (values) => {
    dispatch(sendForgotPasswordEmail(values));
  };

  useEffect(() => {
    if (isSent) {
      success(formatMessage(messages.successfulySentEmail));
    }
  }, [isSent]);

  return (
    <>
      <motion.div
        className="authentication-motion-message"
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      ></motion.div>
      <Formik
        initialValues={{ email }}
        validationSchema={forgotPasswordSchema}
        onSubmit={confirm}
      >
        {({ values, isValid, handleChange, handleBlur, handleSubmit }) => (
          <Form layout="vertical" name="login-form">
            <Field
              autoFocus
              label={formatMessage(messages.emailInputLabel)}
              component={FormField}
              type="email"
              name="email"
              prefix={<MailOutlined className="text-primary" />}
              errorTexts={{
                label: formatMessage(messages.emailInputLabel),
              }}
              value={values.email}
            />
            <Form.Item className="mt-sm-5">
              <Button
                onClick={() => handleSubmit(values)}
                type="primary"
                htmlType="submit"
                block
                disabled={!isValid}
              >
                {formatMessage(messages.confirmButton)}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ForgotPasswordForm;
