import React from 'react';
import FormField from './FormField';
import FormSelect from './FormSelect';
import { useCityOptions } from 'utils/useCityOptions';

const CityFormSelect = ({
  country,
  state,
  form,
  field,
  label,
  required,
  errorTexts,
}) => {
  const { options, loading, disabled, useDropdown } = useCityOptions({
    country,
    state,
    currentCity: field.value,
  });

  if (!useDropdown) {
    return (
      <FormField
        form={form}
        field={field}
        label={label}
        required={required}
        errorTexts={errorTexts}
      />
    );
  }

  return (
    <FormSelect
      form={form}
      field={field}
      label={label}
      required={required}
      errorTexts={errorTexts}
      options={options}
      optionField="name"
      showSearch
      optionFilterProp="children"
      loading={loading}
      disabled={disabled}
      allowClear
      placeholder={disabled ? 'Select state first' : 'Select city'}
    />
  );
};

export default CityFormSelect;
