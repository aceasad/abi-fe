import React from 'react';
import { Field } from 'formik';
import { Row, Col } from 'antd';

const IndustryAverageFormField = (props) => (
  <Row>
    <Col span={props.span}>
      <Field
        component={props.component}
        label={props.label}
        name={props.name}
        type={props.type}
        min={props.min}
      />
    </Col>
  </Row>
);

export default IndustryAverageFormField;
