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
  disablePastDates,
  showDefaultDate,
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

  const disabledDates = (date) => {
    if (
      (maxDate && date.isAfter(maxDate)) ||
      (disablePastDates && date < moment().startOf('day'))
    ) {
      return true;
    }
    return false;
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
        disabledDate={disabledDates}
        defaultValue={
          showDefaultDate
            ? moment(
                field.value ? field.value : defaultDate,
                DATE_FORMAT_DD_MMM_YYYY
              )
            : ''
        }
        format={DATE_FORMAT_DD_MMM_YYYY}
      />
    </Form.Item>
  );
};

FormDatePicker.defaultProps = {
  defaultDate: new Date(),
  maxDate: false,
  disablePastDates: false,
  showDefaultDate: true,
};

export default FormDatePicker;
