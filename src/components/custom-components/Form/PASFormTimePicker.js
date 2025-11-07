import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, TimePicker } from 'antd';
import dayjs from 'utils/dayjs';
import { TIME_FORMAT_HH_MM } from 'constants/TimeConstant';

const PASFormTimePicker = ({
  label,
  field,
  form: { setFieldValue, setFieldTouched, touched, errors },
  defaultTime,
  required,
  errorTexts,
  hourStep = 1,
  minuteStep = 15,
  showNow = false,
  disabled = false,
}) => {
  const { formatMessage } = useIntl();

  const [time, setTime] = useState(
    dayjs(field.value ? field.value : defaultTime, TIME_FORMAT_HH_MM)
  );

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

  const onChange = (timeMoment, timeString) => {
    setTime(timeMoment);
    setFieldTouched(field.name, true);
    setFieldValue(field.name, timeString);
  };

  useEffect(() => {
    if (disabled) {
      setTime(dayjs('00:00', TIME_FORMAT_HH_MM));
      setFieldValue(field.name, '00:00');
    }
  }, [disabled]);

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={triggerError() && 'error'}
      help={showError()}
    >
      <TimePicker
        value={time}
        popupClassName="picker-time-no-after"
        defaultValue={dayjs(
          field.value ? field.value : defaultTime,
          TIME_FORMAT_HH_MM
        )}
        format={TIME_FORMAT_HH_MM}
        onChange={onChange}
        hourStep={hourStep}
        minuteStep={minuteStep}
        showNow={showNow}
        disabled={disabled}
      />
    </Form.Item>
  );
};

PASFormTimePicker.defaultProps = {
  defaultTime: '00:00',
};

export default PASFormTimePicker;
