import React, { useMemo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Form, TimePicker } from 'antd';
import moment from 'moment';
import { TIME_FORMAT_HH_MM } from 'constants/TimeConstant';
import { useGetAvailableTimeslots } from 'queries/shared';
import { TIMESLOTS, TIMESLOT_HOURS } from 'constants/TimeslotConstants';
import { formHasError } from 'utils/helpers';
import { DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';

const FIELDS_TO_CHECK = [
  'patient',
  'doctor',
  'appointmentType',
  'price',
  'date',
];

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

  const hasError = useMemo(() => touched[field.name] && errors[field.name], [
    touched[field.name],
    errors[field.name],
  ]);

  const showError = () =>
    hasError &&
    (errorTexts
      ? formatMessage(errors[field.name], errorTexts)
      : defaultErrorMessage());

  const onChange = (_, timeString) => {
    setFieldTouched(field.name, true);
    setFieldValue(field.name, timeString);
  };

  const [disabledTimeslots, setDisabledTimeslots] = useState([]);

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsDisabled(formHasError(FIELDS_TO_CHECK, errors));
  }, [touched, errors]);

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
    const nowMoment = moment();
    let [nowHour, nowMinutes] = nowMoment.format('HH:mm').split(':');
    nowHour = parseInt(nowHour);
    nowMinutes = parseInt(nowMinutes);

    const selectedDateMoment = moment(values.date, DATE_FORMAT_DD_MMM_YYYY);

    // if selected date is today, disable all timslots that are passed
    // if not, return all disabled slots
    return selectedDateMoment.isSame(nowMoment, 'day')
      ? TIMESLOTS.filter((slot) => {
          const [slotHour, slotMinute] = slot.split(':');
          return (
            !data.includes(slot) ||
            parseInt(slotHour) < nowHour ||
            (parseInt(slotHour) === nowHour &&
              parseInt(slotMinute) < nowMinutes)
          );
        })
      : TIMESLOTS.filter((slot) => !data.includes(slot));
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
      validateStatus={hasError && 'error'}
      help={showError()}
    >
      {!isFetching && (
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
          hideDisabledOptions
          disabled={isDisabled}
          inputReadOnly
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
