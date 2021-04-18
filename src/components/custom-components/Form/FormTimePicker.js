import React from 'react';
import { useIntl } from 'react-intl';
import { Form, TimePicker } from 'antd';
import moment from 'moment';
import { TIME_FORMAT_HH_MM } from 'constants/TimeConstant';

const FormTimePicker = ({
  label,
  field,
  form: { setFieldValue, setFieldTouched, touched, errors },
  defaultTime,
  required,
  errorTexts,
  hourStep = 1,
  minuteStep = 15,
  showNow = false,
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

  const onChange = (_, timeString) => {
    setFieldTouched(field.name, true);
    setFieldValue(field.name, timeString);
  };

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={triggerError() && 'error'}
      help={showError()}
    >
      <TimePicker
        popupClassName="picker-time-no-after"
        defaultValue={moment(
          field.value ? field.value : defaultTime,
          TIME_FORMAT_HH_MM
        )}
        format={TIME_FORMAT_HH_MM}
        onChange={onChange}
        hourStep={hourStep}
        minuteStep={minuteStep}
        showNow={showNow}
      />
    </Form.Item>
  );
};

FormTimePicker.defaultProps = {
  defaultTime: '00:00',
};

export default FormTimePicker;
