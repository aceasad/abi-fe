import React from 'react';
import { Radio } from 'antd';

const FormRadio = ({
  field,
  form: { setFieldValue },
  options,
  optionField,
  label,
}) => {
  return (
    <div>
      {label && <label>{label}</label>}

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
    </div>
  );
};

FormRadio.defaultProps = {
  label: false,
};

export default FormRadio;
