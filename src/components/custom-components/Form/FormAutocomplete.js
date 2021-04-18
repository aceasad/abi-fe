import React, { useState } from 'react';
import { Form, AutoComplete, Select } from 'antd';
import { useIntl } from 'react-intl';

const { Option } = Select;

const FormAutocomplete = ({
  placeholder,
  required,
  field,
  form: { setFieldValue, setFieldTouched, touched, errors },
  label,
  errorTexts,
  options,
  optionField,
  setQuery,
  defaultValue,
}) => {
  const { formatMessage } = useIntl();

  const [text, setText] = useState(defaultValue ? defaultValue : '');

  const handleSelected = (value) => {
    setFieldValue(field.name, value);
    setText(options.find((option) => option.id === value)[optionField]);
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
      <AutoComplete
        value={text}
        placeholder={placeholder}
        onChange={(value) => {
          if (!options.some((option) => option[optionField] === value)) {
            setFieldValue(field.name, '');
          }
          setText(value);
        }}
        onBlur={() => setFieldTouched(field.name, true)}
        onSearch={(value) => setQuery(value)}
        onSelect={handleSelected}
      >
        {options
          ? options.map((item) => (
              <Option key={item.id} value={item.id}>
                {item[optionField]}
              </Option>
            ))
          : null}
      </AutoComplete>
    </Form.Item>
  );
};

FormAutocomplete.defaultProps = {
  options: [],
};

export default FormAutocomplete;
