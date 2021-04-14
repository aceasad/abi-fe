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
  disabledTimestamps,
  availableTimestamps,
  hourStep = 1,
  minuteStep = 15,
  showNow = false,
  startTime,
  endTime,
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

  const getDisabledHours = () => {
    const hours = [...Array(24).keys()];
    let disabledHours = hours.filter((hour) => {
      // working hours: 17:00 - 05:00
      if (startTime > endTime) {
        return hour < startTime && hour > endTime;
        // working hours: 08:00 - 20:00
      } else {
        return hour > startTime;
      }
    });

    return disabledTimestamps
      ? disabledTimestamps
          .map((timestamp) => parseInt(timestamp.split(':')[0]))
          .filter((value, index, array) => array.indexOf(value) === index)
      : [];
  };

  const getDisabledMinutes = (selectedHour) => {};

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={triggerError() && 'error'}
      help={showError()}
    >
      <TimePicker
        defaultValue={moment(
          field.value ? field.value : defaultTime,
          TIME_FORMAT_HH_MM
        )}
        format={TIME_FORMAT_HH_MM}
        onChange={onChange}
        hourStep={hourStep}
        minuteStep={minuteStep}
        //disabledHours={getDisabledHours}
        showNow={showNow}
      />
    </Form.Item>
  );
};

FormTimePicker.defaultProps = {
  defaultTime: '00:00',
};

export default FormTimePicker;
