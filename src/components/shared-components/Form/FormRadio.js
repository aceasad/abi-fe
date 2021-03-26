import React from 'react';
import { Radio, Form } from 'antd';

const FormRadio = ({
  field,
  form: { setFieldValue },
  options,
  optionField,
  label,
}) => {
  return (
    <Form.Item label={label}>
      <Radio.Group
        onChange={(e) => setFieldValue(field.name, e.target.value)}
        value={field.value}
      >
        {options.map((opt) => (
          <Radio key={opt.id} value={opt.id}>
            {opt[optionField]}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

FormRadio.defaultProps = {
  label: false,
};

export default FormRadio;
