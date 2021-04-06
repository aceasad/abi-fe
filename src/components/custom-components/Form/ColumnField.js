import React from 'react';
import { Field } from 'formik';
import { Col } from 'antd';

const ColumnField = ({ span, offset, ...props }) => (
  <Col span={span} offset={offset}>
    <Field {...props} />
  </Col>
);

export default ColumnField;
