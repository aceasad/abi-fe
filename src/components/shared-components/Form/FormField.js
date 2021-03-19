import React from "react";
import { ErrorMessage } from "formik";
import { Form, Input } from "antd";

const FormField = ({
  handleChange,
  handleBlur,
  value,
  label,
  autoFocus,
  name,
  errorMessage,
  prefix,
  labelComponent: Label,
  secureField
}) => {
  const InputField = secureField ? Input.Password : Input;

  return (
    <>
      {Label && <Label />}
      {label && <label>{label}</label>}
      <Form.Item>
        <InputField
          autoFocus={autoFocus}
          name={name}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          prefix={prefix}
        />
        <ErrorMessage name={name}>{errorMessage}</ErrorMessage>
      </Form.Item>
    </>
  );
};

export default FormField;
