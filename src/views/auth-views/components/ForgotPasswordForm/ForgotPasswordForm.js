import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { sendForgotPasswordEmail } from 'redux/actions/Auth';
import { motion } from 'framer-motion';
import { ErrorMessage, Formik } from 'formik';
import messages from './messages';
import { useIntl } from 'react-intl';
import { forgotPasswordSchema } from 'utils/validations';

export const ForgotPasswordForm = (props) => {
  const dispatch = useDispatch();

  const { loading, showMessage } = props;

  const { formatMessage } = useIntl();

  const confirm = (values) => {
    dispatch(sendForgotPasswordEmail(values));
  };

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
        initialValues={{ email: '' }}
        validationSchema={forgotPasswordSchema}
        onSubmit={(values) => {
          confirm(values);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <Form layout="vertical" name="login-form">
            <Form.Item label={formatMessage(messages.emailInputLabel)}>
              <Input
                autoFocus
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                prefix={<MailOutlined className="text-primary" />}
              />
              <div className="authentication-error">
                <ErrorMessage name="email">
                  {(msg) =>
                    formatMessage(msg, {
                      label: formatMessage(messages.emailInputLabel),
                    })
                  }
                </ErrorMessage>
              </div>
            </Form.Item>
            <Form.Item className="mt-sm-5">
              <Button
                onClick={() => handleSubmit(values)}
                type="primary"
                htmlType="submit"
                block
                loading={loading}
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
