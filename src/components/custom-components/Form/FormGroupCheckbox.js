import { Checkbox, Form } from 'antd';
import { interpolate } from 'utils/interpolate';
import React from 'react';

const FormGroupCheckbox = ({
  field,
  form: { setFieldValue, errors, touched, setFieldTouched },
  label,
  options,
  errorTexts,
  required,
}) => {
  const onChange = (checkedValues) => {
    setFieldValue(field.name, checkedValues);
  };

  const defaultErrorMessage = () =>
    interpolate(errors[field.name], {
      label,
    });

  const shouldShowError = () => {
    return touched[field.name] && errors[field.name];
  };

  const showError = () => {
    return (
      shouldShowError() &&
      (errorTexts
        ? interpolate(errors[field.name], errorTexts)
        : defaultErrorMessage())
    );
  };

  return (
    <Form.Item
      required={required}
      label={label}
      validateStatus={shouldShowError() && 'error'}
      help={showError()}
    >
      <Checkbox.Group options={options} onChange={onChange} />
    </Form.Item>
  );
};

FormGroupCheckbox.defaultProps = {
  label: false,
  errorTexts: false,
  options: [],
  required: false,
};

export default FormGroupCheckbox;
