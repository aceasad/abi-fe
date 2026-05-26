import React from 'react';
import { interpolate } from 'utils/interpolate';
import { DatePicker, Form } from 'antd';
import dayjs from 'utils/dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';

const PASFormDatePicker = ({
  label,
  field,
  form: { setFieldValue, setFieldTouched, touched, errors },
  required,
  errorTexts,
  ...props
}) => {

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

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf('day');
  };

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
        disabledDate={props.disablePastDates && disabledDate}
        format={DATE_FORMAT_DD_MM_YYYY}
        mask={DATE_FORMAT_DD_MM_YYYY}
      />
    </Form.Item>
  );
};

PASFormDatePicker.defaultProps = {
  defaultDate: '',
  maxDate: false,
  disablePastDates: false,
  showDefaultDate: true,
};

export default PASFormDatePicker;
