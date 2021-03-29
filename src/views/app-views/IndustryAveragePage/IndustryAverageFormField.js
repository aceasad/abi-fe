import React from 'react';
import { Field } from 'formik';
import { Row, Col } from 'antd';

const IndustryAverageFormField = ({ span, ...props }) => (
  <Row>
    <Col span={span}>
      <Field {...props} />
    </Col>
  </Row>
);

export default IndustryAverageFormField;
