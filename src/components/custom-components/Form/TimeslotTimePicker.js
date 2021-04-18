import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, TimePicker } from 'antd';
import moment from 'moment';
import { TIME_FORMAT_HH_MM } from 'constants/TimeConstant';
import { useGetAvailableTimeslots } from 'queries/shared';
import { TIMESLOTS, TIMESLOT_HOURS } from 'constants/TimeslotConstants';

const TimeslotTimePicker = ({
  label,
  field,
  form: { setFieldValue, setFieldTouched, touched, errors, values },
  required,
  errorTexts,
  hourStep = 1,
  minuteStep = 15,
  showNow = false,
  defaultTime,
  showDefaultTime,
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

  const [disabledTimeslots, setDisabledTimeslots] = useState([]);

  const setDisabledSlots = (available) => {
    const disabled = getDisabledSlots(available);
    setDisabledTimeslots(disabled);
  };

  const { isFetching } = useGetAvailableTimeslots(
    values.doctor,
    values.patient,
    values.appointmentType,
    values.date,
    setDisabledSlots
  );

  const getDisabledSlots = ({ data }) => {
    return TIMESLOTS.filter((slot) => !data.includes(slot));
  };

  const getDisabledHours = () => {
    const disabled = TIMESLOT_HOURS.filter(
      (hour) =>
        disabledTimeslots.filter((slot) => slot.split(':')[0] === hour)
          .length === 4
    ).map((disabledSlot) => parseInt(disabledSlot));

    return disabled;
  };

  const getDisabledMinutes = (selectedHour) => {
    const disabledHourSlots = disabledTimeslots.filter(
      (slot) => parseInt(slot.split(':')[0]) === selectedHour
    );

    return disabledHourSlots.map((slot) => parseInt(slot.split(':')[1]));
  };

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={triggerError() && 'error'}
      help={showError()}
    >
      {isFetching ? null : (
        <TimePicker
          popupClassName="picker-time-no-after"
          format={TIME_FORMAT_HH_MM}
          onChange={onChange}
          hourStep={hourStep}
          minuteStep={minuteStep}
          disabledHours={getDisabledHours}
          disabledMinutes={getDisabledMinutes}
          showNow={showNow}
          defaultValue={
            showDefaultTime
              ? moment(
                  field.value ? field.value : defaultTime,
                  TIME_FORMAT_HH_MM
                )
              : ''
          }
        />
      )}
    </Form.Item>
  );
};

TimeslotTimePicker.defaultProps = {
  defaultTime: '00:00',
  showDefaultTime: false,
};

export default TimeslotTimePicker;
