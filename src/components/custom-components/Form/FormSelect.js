import React from 'react';
import { interpolate } from 'utils/interpolate';
import { Form, Select } from 'antd';

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
  mode,
  showSearch,
  optionFilterProp,
  filterOption,
}) => {

  const placeholderText = placeholder || "Select option";

  const handleSelected = (value) => {
    setFieldValue(field.name, value);
    afterSelectChange(setFieldValue, afterSelectChangeFieldName, value);
  };

  const defaultErrorMessage = () =>
    interpolate(errors[field.name], {
      label,
    });

  const triggerError = () => touched[field.name] && errors[field.name];

  const showError = () =>
    triggerError() &&
    (errorTexts
      ? interpolate(errors[field.name], errorTexts)
      : defaultErrorMessage());

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={triggerError() && 'error'}
      help={showError()}
    >
      <Select
        value={
          field.value ??
          defaultOption ??
          (mode === 'multiple' ? [] : null)
        }
        placeholder={placeholderText}
        onChange={handleSelected}
        onBlur={() => setFieldTouched(field.name, true)}
        mode={mode}
        showSearch={showSearch}
        optionFilterProp={optionFilterProp}
        filterOption={filterOption}
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
