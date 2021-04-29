import React, { useMemo, useState } from 'react';
import { Form, AutoComplete, Select } from 'antd';
import { useIntl } from 'react-intl';
import MiniLoader from 'components/shared-components/Loading/MiniLoader';

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
  loading,
  ...props
}) => {
  const { formatMessage } = useIntl();

  const [text, setText] = useState(defaultValue ? defaultValue : '');

  const handleSelected = (value) => {
    setFieldValue(field.name, value);
    setText(options.find((option) => option.id === value)[optionField]);
  };

  const handleSearch = (value) => {
    setFieldValue(field.name, '');
    setQuery(value);
  };

  const defaultErrorMessage = () =>
    formatMessage(errors[field.name], {
      label,
    });

  const hasError = useMemo(() => touched[field.name] && errors[field.name], [
    touched[field.name],
    errors[field.name],
  ]);

  const showError = () =>
    hasError &&
    (errorTexts
      ? formatMessage(errors[field.name], errorTexts)
      : defaultErrorMessage());

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={hasError && 'error'}
      help={showError()}
    >
      <AutoComplete
        value={text}
        placeholder={placeholder}
        onChange={setText}
        onBlur={() => setFieldTouched(field.name, true)}
        onSearch={handleSearch}
        onSelect={handleSelected}
        {...props}
      >
        {options
          ? options.map((item) => (
              <Option key={item.id} value={item.id}>
                {item[optionField]}
              </Option>
            ))
          : null}
      </AutoComplete>
      {loading && <MiniLoader />}
    </Form.Item>
  );
};

FormAutocomplete.defaultProps = {
  options: [],
};

export default FormAutocomplete;
