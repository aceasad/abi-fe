import React from 'react';
import { ErrorMessage } from 'formik';
import { Form, Input, Popover } from 'antd';
import { useIntl } from 'react-intl';

const FormField = ({
  form: { handleBlur, handleChange },
  field,
  labelComponent: Label,
  secureField,
  errorTexts,
  label,
  Tooltip,
  ...props
}) => {
  const InputField = secureField ? Input.Password : Input;
  const { formatMessage } = useIntl();

  const defaultErrorMessage = (msg) =>
    formatMessage(msg, {
      label,
    });

  const FormItem = (
    <Form.Item>
      <InputField
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
          ? (msg) => formatMessage(msg, errorTexts)
          : defaultErrorMessage}
      </ErrorMessage>
    </div>
  );
};

export default FormField;
