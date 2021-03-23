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
import '../../../../assets/sass/views/auth/forgotPassword.scss';

const confirmButtonStyle = {
  backgroundColor: '#5c5cd6',
  borderRadius: '5px',
  border: 'none',
  outline: 'none',
};

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
            <label>{formatMessage(messages.emailInputLabel)}</label>
            <Form.Item>
              <Input
                autoFocus
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                prefix={<MailOutlined className="text-primary" />}
              />
              <ErrorMessage name="email">
                {(msg) =>
                  formatMessage(msg, {
                    label: formatMessage(messages.emailInputLabel),
                  })
                }
              </ErrorMessage>
            </Form.Item>
            <Form.Item>
              <Button
                style={confirmButtonStyle}
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
