import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { sendForgotPasswordEmail } from 'redux/actions/Auth';
import { motion } from 'framer-motion';
import { Field, Formik } from 'formik';
import { useSelector } from 'react-redux';
import { forgotPasswordSchema } from 'utils/validations';
import { makeIsSendEmailUser } from 'redux/selectors/Auth';
import { success } from 'components/shared-components/MessagesAlerts/index';
import FormField from 'components/custom-components/Form/FormField';
import { Link } from 'react-router-dom';
import { ROUTES } from 'routes';
export const ForgotPasswordForm = ({ email, showMessage }) => {
  const dispatch = useDispatch();
  const isSent = useSelector(makeIsSendEmailUser());

  const confirm = (values) => {
    dispatch(sendForgotPasswordEmail(values));
  };

  useEffect(() => {
    if (isSent) {
      success("Email sent successfully");
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
        {({ values, isValid, handleSubmit }) => (
          <Form layout="vertical" name="login-form">
            <Field
              autoFocus
              label={"Email Address"}
              component={FormField}
              type="email"
              name="email"
              prefix={<MailOutlined className="text-primary" />}
              errorTexts={{
                label: "Email Address",
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
                {"Confirm"}
              </Button>
            </Form.Item>
            <div className="text-center">
              <Link to={ROUTES.LOGIN}>
                {"Back to login"}
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ForgotPasswordForm;
