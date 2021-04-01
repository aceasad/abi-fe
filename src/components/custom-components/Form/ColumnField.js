import React from 'react';
import { Field } from 'formik';
import { Col } from 'antd';

const ColumnField = ({ span, ...props }) => (
  <Col span={span}>
    <Field {...props} />
  </Col>
);

export default ColumnField;
