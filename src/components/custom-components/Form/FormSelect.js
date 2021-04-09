import React from 'react';
import { Form, Select } from 'antd';
import messages from 'views/app-views/StaffPage/messages';
import { useIntl } from 'react-intl';

const { Option } = Select;

const FormSelect = ({
  defaultOption,
  options,
  form: { setFieldValue, setFieldTouched, touched, errors },
  field,
  label,
  optionField,
  placeholder,
  errorTexts,
  required,
}) => {
  const { formatMessage } = useIntl();

  const placeholderText = placeholder || formatMessage(messages.selectOption);

  const handleSelected = (value) => {
    setFieldValue(field.name, value);
  };

  const defaultErrorMessage = () =>
    formatMessage(errors[field.name], {
      label,
    });

  const triggerError = () => touched[field.name] && errors[field.name];

  const showError = () =>
    triggerError() &&
    (errorTexts
      ? formatMessage(errors[field.name], errorTexts)
      : defaultErrorMessage());

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={triggerError() && 'error'}
      help={showError()}
    >
      <Select
        placeholder={
          defaultOption ? defaultOption[optionField] : placeholderText
        }
        onChange={handleSelected}
        onBlur={() => setFieldTouched(field.name, true)}
      >
        {options.map((item) => (
          <Option key={item.id} value={item.id}>
            {item[optionField]}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

FormSelect.defaultProps = {
  options: [],
  errorTexts: false,
};

export default FormSelect;
