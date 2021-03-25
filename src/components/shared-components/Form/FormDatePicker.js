import { DatePicker } from 'antd';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';
import moment from 'moment';
import React from 'react';

const FormDatePicker = ({
  label,
  field,
  form: { setFieldValue },
  defaultDate,
  maxDate,
}) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <DatePicker
        onChange={(_, str) => {
          setFieldValue(field.name, str);
        }}
        disabledDate={(date) => (maxDate ? date.isAfter(maxDate) : false)}
        defaultValue={moment(
          field.value ? field.value : defaultDate,
          DATE_FORMAT_MM_DD_YYYY
        )}
        format={DATE_FORMAT_MM_DD_YYYY}
      />
    </div>
  );
};

FormDatePicker.defaultProps = {
  defaultDate: new Date(),
  maxDate: false,
};

export default FormDatePicker;
