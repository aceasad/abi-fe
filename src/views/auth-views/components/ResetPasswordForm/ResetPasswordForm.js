import React from "react";
import { ErrorMessage, Formik } from "formik";
import { Button, Form, Input } from "antd";
import messages from "./messages";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { resetPassword } from "../../../../redux/actions/Auth";

const { resetPasswordSchema } = require("utils/validations");

const confirmButtonStyle = {
  backgroundColor: "#5c5cd6",
  borderRadius: "5px",
  border: "none",
  outline: "none",
};

const ResetPasswordForm = (match) => {
  const dispatch = useDispatch();
  const { token, email } = useParams();
  const { formatMessage } = useIntl();

  const resetPasswordFun = (values) => {
    dispatch(resetPassword(values.password, token, email));
  };

  return (
    <div>
      <Formik
        initialValues={{ password: "", passwordRepeat: "" }}
        validationSchema={resetPasswordSchema}
        onSubmit={(values) => {
          resetPasswordFun(values);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <Form layout="vertical" name="login-form">
            <Form.Item>
              <Input
                autoFocus
                name="password"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              <ErrorMessage name="password">
                {(msg) =>
                  formatMessage(msg, {
                    label: formatMessage(messages.passwordInputLabel),
                    matchesLabel: formatMessage(messages.matches_password),
                  })
                }
              </ErrorMessage>
            </Form.Item>
            <Form.Item>
              <Input
                autoFocus
                name="passwordRepeat"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.passwordRepeat}
              />
              <ErrorMessage name="passwordRepeat">
                {(msg) =>
                  formatMessage(msg, {
                    label: formatMessage(messages.passwordRepeatInputLabel),
                    value: formatMessage(messages.passwordInputLabel),
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
              >
                {formatMessage(messages.confirmButton)}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
