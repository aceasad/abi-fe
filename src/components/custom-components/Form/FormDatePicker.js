import React from 'react';
import { useIntl } from 'react-intl';
import { DatePicker, Form } from 'antd';
import moment from 'moment';
import { ErrorMessage } from 'formik';

import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';

const FormDatePicker = ({
  label,
  field,
  form: { setFieldValue, setFieldTouched },
  defaultDate,
  maxDate,
  required,
  errorTexts,
}) => {
  const { formatMessage } = useIntl();

  const defaultErrorMessage = (msg) =>
    formatMessage(msg, {
      label,
    });

  return (
    <Form.Item label={label} required={required}>
      <DatePicker
        onChange={(_, str) => {
          setFieldTouched(field.name, true);
          setFieldValue(field.name, str);
        }}
        disabledDate={(date) => (maxDate ? date.isAfter(maxDate) : false)}
        defaultValue={moment(
          field.value ? field.value : defaultDate,
          DATE_FORMAT_MM_DD_YYYY
        )}
        format={DATE_FORMAT_MM_DD_YYYY}
      />
      <div className="authentication-error">
        <ErrorMessage name={field.name}>
          {errorTexts
            ? (msg) => formatMessage(msg, errorTexts)
            : defaultErrorMessage}
        </ErrorMessage>
      </div>
    </Form.Item>
  );
};

FormDatePicker.defaultProps = {
  defaultDate: new Date(),
  maxDate: false,
};

export default FormDatePicker;
