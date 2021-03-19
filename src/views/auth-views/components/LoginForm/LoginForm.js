import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Form } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  showLoading,
  showAuthMessage,
  hideAuthMessage,
  authenticated,
  signIn
} from "redux/actions/Auth";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { Formik } from "formik";
import { loginSchema } from "../../../../utils/validations";
import "../../../../assets/sass/views/auth/login.scss";
import messages from "./messages";
import { useIntl } from "react-intl";
import { ROUTES } from "routes";
import { passwordMinLength } from "constants/Validation";
import FormField from "components/shared-components/Form/FormField";

const linkStyle = {
  color: "#5c5cd6",
  textDecoration: "underline",
  textDecorationColor: "#ccb3ff",
  cursor: "pointer"
};

const loginButtonStyle = {
  backgroundColor: "#5c5cd6",
  borderRadius: "5px",
  border: "none",
  outline: "none"
};

export const LoginForm = (props) => {
  let history = useHistory();
  const dispatch = useDispatch();

  const {
    loading,
    showMessage,
    message,
    token,
    redirect,
    allowRedirect
  } = props;

  const { formatMessage } = useIntl();

  const onLogin = (values) => {
    dispatch(signIn(values));
  };

  useEffect(() => {
    if (token && allowRedirect) {
      history.push(redirect);
    }
  }, [token]);

  const PasswordLabel = () => (
    <div className={"d-flex justify-content-between w-100 align-items-center"}>
      <span>{formatMessage(messages.passwordInputLabel)}</span>

      <span
        className="login-underlined"
        style={linkStyle}
        onClick={() => history.push(ROUTES.FORGOT_PASSWORD)}
      >
        {formatMessage(messages.forgotPasswordLink)}
      </span>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0
        }}
      >
        {showMessage && formatMessage(message)}
      </motion.div>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          onLogin(values);
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          dirty,
          isValid
        }) => (
          <Form layout="vertical" name="login-form">
            <FormField
              label={formatMessage(messages.emailInputLabel)}
              name={"username"}
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.email}
              prefix={<MailOutlined className="text-primary" />}
              errorMessage={(msg) =>
                formatMessage(msg, {
                  label: formatMessage(messages.emailInputLabel)
                })
              }
              autoFocus
            />
            <FormField
              labelComponent={PasswordLabel}
              name={"password"}
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.email}
              prefix={<LockOutlined className="text-primary" />}
              errorMessage={(msg) =>
                formatMessage(msg, {
                  label: formatMessage(messages.passwordInputLabel),
                  minValue: passwordMinLength,
                  matchesLabel: formatMessage(
                    messages.passwordCantStartWithSpace
                  )
                })
              }
              secureField
            />
            <Form.Item>
              <Button
                style={loginButtonStyle}
                onClick={() => handleSubmit(values)}
                type="primary"
                htmlType="submit"
                block
                disabled={!dirty || !isValid}
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
  extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

LoginForm.defaultProps = {
  otherSignIn: true
};

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect } = auth;
  return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  authenticated
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
