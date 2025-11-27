import React from 'react';
import { useIntl } from 'react-intl';
import { DatePicker, Form } from 'antd';
import dayjs from 'utils/dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';

const FormDatePicker = ({
  label,
  field,
  form: { setFieldValue, setFieldTouched, touched, errors },
  required,
  errorTexts,
  ...props
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

  const defaultDisabledDate = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf('day');
  };

  // Use custom disabledDate if provided, otherwise use default if disablePastDates is true
  const getDisabledDate = () => {
    if (props.disabledDate) {
      return props.disabledDate;
    }
    if (props.disablePastDates) {
      return defaultDisabledDate;
    }
    return undefined;
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
        disabledDate={getDisabledDate()}
        format={DATE_FORMAT_DD_MM_YYYY}
        mask={DATE_FORMAT_DD_MM_YYYY}
      />
    </Form.Item>
  );
};

FormDatePicker.defaultProps = {
  defaultDate: '',
  maxDate: false,
  disablePastDates: false,
  showDefaultDate: true,
};

export default FormDatePicker;
