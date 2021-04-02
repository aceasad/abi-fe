import React, { useState } from 'react';
import { Button, Form } from 'antd';
import { Checkbox } from 'antd';

const FormCheckbox = ({
  field,
  form: { setFieldValue, handleSubmit },
  label,
  checked = false,
  isSubmit,
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const onChange = (e) => {
    setIsChecked(!isChecked);
    setFieldValue(field.name, !isChecked);
    isSubmit && handleSubmit();
  };

  return (
    <Form.Item label={label}>
      <Checkbox onChange={onChange} checked={isChecked} />
    </Form.Item>
  );
};

FormCheckbox.defaultProps = {
  label: false,
};

export default FormCheckbox;
