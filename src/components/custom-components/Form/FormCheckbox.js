import React, { useState } from 'react';
import { Button, Form } from 'antd';
import { Checkbox } from 'antd';

const FormCheckbox = ({
  field,
  form: { setFieldValue, handleSubmit },
  label,
  isSubmit,
}) => {
  const onChange = () => {
    setFieldValue(field.name, !field.value);
    isSubmit && handleSubmit();
  };

  return (
    <Form.Item label={label}>
      <Checkbox onChange={onChange} checked={field.value} />
    </Form.Item>
  );
};

FormCheckbox.defaultProps = {
  label: false,
};

export default FormCheckbox;
