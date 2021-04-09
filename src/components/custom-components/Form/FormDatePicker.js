import React from 'react';
import { useIntl } from 'react-intl';
import { DatePicker, Form } from 'antd';
import moment from 'moment';
import { DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';

const FormDatePicker = ({
  label,
  field,
  form: { setFieldValue, setFieldTouched, touched, errors },
  defaultDate,
  maxDate,
  required,
  errorTexts,
}) => {
  const { formatMessage } = useIntl();

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
      <DatePicker
        onChange={(_, str) => {
          setFieldTouched(field.name, true);
          setFieldValue(field.name, str);
        }}
        disabledDate={(date) => (maxDate ? date.isAfter(maxDate) : false)}
        defaultValue={moment(
          field.value ? field.value : defaultDate,
          DATE_FORMAT_DD_MMM_YYYY
        )}
        format={DATE_FORMAT_DD_MMM_YYYY}
      />
    </Form.Item>
  );
};

FormDatePicker.defaultProps = {
  defaultDate: new Date(),
  maxDate: false,
};

export default FormDatePicker;
