import React from 'react';
import FormField from './FormField';
import {
  formatUsInternationalPhone,
  formatUsLocalPhone,
} from 'utils/helpers';

const FormPhoneField = ({
  usFormat = false,
  withCountryPrefix = false,
  form,
  field,
  ...props
}) => {
  const formatValue = (value) => {
    if (!usFormat) {
      return value;
    }
    return withCountryPrefix
      ? formatUsInternationalPhone(value)
      : formatUsLocalPhone(value);
  };

  if (!usFormat) {
    return <FormField form={form} field={field} {...props} />;
  }

  return (
    <FormField
      {...props}
      form={form}
      field={field}
      onChange={(event) => {
        form.setFieldValue(field.name, formatValue(event.target.value));
      }}
    />
  );
};

export default FormPhoneField;
