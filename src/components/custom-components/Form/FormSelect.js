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
  afterSelectChange,
  afterSelectChangeFieldName,
}) => {
  const { formatMessage } = useIntl();

  const placeholderText = placeholder || formatMessage(messages.selectOption);

  const handleSelected = (value) => {
    setFieldValue(field.name, value);
    afterSelectChange(setFieldValue, afterSelectChangeFieldName, value);
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
        value={field.value || defaultOption || null}
        placeholder={placeholderText}
        onChange={handleSelected}
        onBlur={() => setFieldTouched(field.name, true)}
      >
        {options.map((item, index) => (
          <Option key={index} value={item.id}>
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
  afterSelectChange: () => { },
};

export default FormSelect;
