import React from 'react';
import { interpolate } from 'utils/interpolate';
import { InputNumber } from 'antd';
import { ErrorMessage } from 'formik';
import { Form, Tooltip } from 'antd';

function FormNumberField({
  form: { handleBlur, setFieldValue },
  field,
  labelComponent: Label,
  errorTexts,
  label,
  labelBlock,
  tooltipText,
  required,
  decimals = 0,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ...props
}) {

  const getLabel = () => {
    if (Label) {
      return <Label />;
    }
    return label;
  };
  const defaultErrorMessage = (msg) =>
    interpolate(msg, {
      label,
    });

  const handleNumberChange = (num) => {
    setFieldValue(field.name, Number(num).toFixed(decimals));
  };

  const FormItem = (
    <Form.Item
      className={labelBlock ? 'label-block' : ''}
      label={getLabel()}
      required={required}
    >
      <InputNumber
        name={field.name}
        onChange={handleNumberChange}
        onBlur={handleBlur}
        value={field.value}
        min={min}
        max={max}
        {...props}
      />
      <div className="authentication-error">
        <ErrorMessage name={field.name}>
          {errorTexts
            ? (msg) => interpolate(msg, errorTexts)
            : defaultErrorMessage}
        </ErrorMessage>
      </div>
    </Form.Item>
  );

  return (
    <div>
      {Tooltip ? (
        <Tooltip placement="bottomRight" title={tooltipText}>
          {FormItem}
        </Tooltip>
      ) : (
        FormItem
      )}
    </div>
  );
}

export default FormNumberField;
