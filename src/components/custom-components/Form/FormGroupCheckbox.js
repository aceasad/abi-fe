import { Checkbox, Form } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';

const FormGroupCheckbox = ({
  field,
  form: { setFieldValue, errors, touched, setFieldTouched },
  label,
  options,
  errorTexts,
  required,
}) => {
  const { formatMessage } = useIntl();
  const onChange = (checkedValues) => {
    setFieldValue(field.name, checkedValues);
  };

  const defaultErrorMessage = () =>
    formatMessage(errors[field.name], {
      label,
    });

  const shouldShowError = () => {
    return touched[field.name] && errors[field.name];
  };

  const showError = () => {
    return (
      shouldShowError() &&
      (errorTexts
        ? formatMessage(errors[field.name], errorTexts)
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
