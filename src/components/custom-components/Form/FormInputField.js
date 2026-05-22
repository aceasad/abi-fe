import React from 'react';
import { interpolate } from 'utils/interpolate';
import { ErrorMessage } from 'formik';
import { Form, Input, Popover } from 'antd';

const FormInputField = ({
  form: { handleBlur, handleChange, min },
  field,
  labelComponent: Label,
  errorTexts,
  label,
  Tooltip,
  ...props
}) => {

  const defaultErrorMessage = (msg) =>
    interpolate(msg, {
      label,
    });

  const FormItem = (
    <Form.Item>
      <Input
        name={field.name}
        onChange={handleChange}
        onBlur={handleBlur}
        value={field.value}
        {...props}
      />
    </Form.Item>
  );

  return (
    <div>
      {Label && <Label />}
      {label && <label>{label}</label>}
      {Tooltip ? <Popover content={Tooltip}>{FormItem}</Popover> : FormItem}
      <ErrorMessage name={field.name}>
        {errorTexts
          ? (msg) => interpolate(msg, errorTexts)
          : defaultErrorMessage}
      </ErrorMessage>
    </div>
  );
};

export default FormInputField;
