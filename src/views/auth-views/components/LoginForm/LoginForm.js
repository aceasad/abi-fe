import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Form, Input } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  showLoading,
  showAuthMessage,
  hideAuthMessage,
  authenticated,
  signIn,
} from "redux/actions/Auth";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { ErrorMessage, Formik } from "formik";
import { loginSchema } from "../../../../utils/validations";
import "../../../../assets/sass/views/auth/login.scss";
import messages from "./messages";
import { useIntl } from "react-intl";

const linkStyle = {
  color: "#5c5cd6",
  textDecoration: "underline",
  textDecorationColor: "#ccb3ff",
  cursor: "pointer",
};

const loginButtonStyle = {
  backgroundColor: "#5c5cd6",
  borderRadius: "5px",
  border: "none",
  outline: "none",
};

export const LoginForm = (props) => {
  let history = useHistory();
  const dispatch = useDispatch();

  const {
    showForgetPassword,
    hideAuthMessage,
    onForgetPasswordClick,
    loading,
    showMessage,
    token,
    redirect,
    allowRedirect,
  } = props;

  const { formatMessage } = useIntl();

  const onLogin = (values) => {
    const data = { username: values.email, password: values.password };
    dispatch(signIn(data));
  };

  useEffect(() => {
    if (token !== null && allowRedirect) {
      history.push(redirect);
    }
    if (showMessage) {
      setTimeout(() => {
        hideAuthMessage();
      }, 3000);
    }
  });

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
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          onLogin(values);
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
            <div
              className={`${
                showForgetPassword
                  ? "d-flex justify-content-between w-100 align-items-center"
                  : ""
              }`}
            >
              <span>{formatMessage(messages.passwordInputLabel)}</span>
              {showForgetPassword && (
                <span
                  className="login-underlined"
                  style={linkStyle}
                  onClick={() => onForgetPasswordClick}
                >
                  {formatMessage(messages.forgotPasswordLink)}
                </span>
              )}
            </div>
            <Form.Item>
              <Input.Password
                onChange={handleChange}
                onBlur={handleBlur}
                name="password"
                value={values.password}
                prefix={<LockOutlined className="text-primary" />}
              />
              <ErrorMessage name="password">
                {(msg) =>
                  formatMessage(msg, {
                    label: formatMessage(messages.passwordInputLabel),
                  })
                }
              </ErrorMessage>
            </Form.Item>
            <Form.Item>
              <Button
                style={loginButtonStyle}
                onClick={() => handleSubmit(values)}
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                {formatMessage(messages.loginButton)}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </>
  );
};

LoginForm.propTypes = {
  otherSignIn: PropTypes.bool,
  showForgetPassword: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

LoginForm.defaultProps = {
  otherSignIn: true,
  showForgetPassword: true,
};

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect } = auth;
  return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  authenticated,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
