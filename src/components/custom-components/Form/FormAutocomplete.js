import React, { useMemo, useState } from 'react';
import { Form, AutoComplete, Select } from 'antd';
import { useIntl } from 'react-intl';
import Loading from 'components/shared-components/Loading';

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
        onChange={(value) => setText(value)}
        onBlur={() => setFieldTouched(field.name, true)}
        onSearch={setQuery}
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
      {loading ? (
        <div style={{ position: 'absolute', top: 5, right: 10 }}>
          <Loading fontSize={25} />
        </div>
      ) : null}
    </Form.Item>
  );
};

FormAutocomplete.defaultProps = {
  options: [],
};

export default FormAutocomplete;
