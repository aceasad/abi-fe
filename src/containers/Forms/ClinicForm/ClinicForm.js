import { MinusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Radio, Row } from 'antd';
import FormField from 'components/custom-components/Form/FormField';
import FormImageUpload from 'components/custom-components/Form/FormImageUpload';
import FormInputField from 'components/custom-components/Form/FormInputField';
import { Field, Formik } from 'formik';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { createClinic, updateClinic } from 'redux/actions/Clinic';
import { makeSelectIsLoading } from 'redux/selectors/Clinic';
import { clinicSchema } from 'utils/validations';
import { AVAILABLE, FREE, NO } from '../../../constants/ClinicConstants';
import messages from './messages';

const ClinicForm = ({ clinicData = null, showSuccess, showError }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const loading = useSelector(makeSelectIsLoading());

  const [visibilityOfParkinSizeField, setVisibility] = useState(
    clinicData?.parking_availability === AVAILABLE
  );

  const handleSubmit = (values, { resetForm }) => {
    if (clinicData) {
      dispatch(
        updateClinic({
          updatedClinic: { ...values },
          clinicId: clinicData.id,
          showSuccess,
          showError,
        })
      );
    } else {
      dispatch(createClinic(values));
    }
  };

  return (
    <Card className="p-3">
      <Formik
        initialValues={{
          photo: clinicData?.photo?.thumbnail || null,
          name: clinicData?.name || '',
          phone_number: clinicData?.phone_number || '',
          address: clinicData?.address || '',
          google_maps_link: clinicData?.google_maps_link || '',
          parking_availability: clinicData?.parking_availability || null,
          parking_size: clinicData?.parking_size || 0,
          start_of_work: clinicData?.start_of_work || null,
          end_of_work: clinicData?.end_of_work || null,
        }}
        validationSchema={clinicSchema}
        onSubmit={handleSubmit}
      >
        {({ dirty, isValid, values, handleSubmit }) => (
          <Form layout="vertical" name="clinic-form" onSubmit={handleSubmit}>
            <Row justify="center" className="mb-5 mt-4">
              <Col span={6}>
                <Field component={FormImageUpload} name={'photo'}></Field>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Field
                  component={FormField}
                  label={formatMessage(messages.clinic_name)}
                  name={'name'}
                  errorTexts={{
                    label: formatMessage(messages.error_input_label_name),
                  }}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Field
                  component={FormField}
                  label={formatMessage(messages.phone_number)}
                  name={'phone_number'}
                  errorTexts={{
                    label: formatMessage(
                      messages.error_input_label_phone_number
                    ),
                  }}
                />
              </Col>
              <Col span={16}>
                <Field
                  component={FormField}
                  label={formatMessage(messages.address)}
                  name={'address'}
                  errorTexts={{
                    label: formatMessage(messages.error_input_label_address),
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Field
                  component={FormField}
                  label={formatMessage(messages.google_maps_link)}
                  name={'google_maps_link'}
                  errorTexts={{
                    label: formatMessage(
                      messages.error_input_label_google_maps_link
                    ),
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={18}>
                <Form.Item
                  name="radio-group"
                  label={formatMessage(messages.parking_availability)}
                >
                  <Radio.Group
                    defaultValue={values.parking_availability}
                    onChange={(event) => {
                      setVisibility(event.target.value === AVAILABLE);
                      values.parking_availability = event.target.value;
                    }}
                  >
                    <Radio value={NO}>
                      {formatMessage(messages.parking_no)}
                    </Radio>
                    <Radio value={FREE}>
                      {formatMessage(messages.parking_free)}
                    </Radio>
                    <Radio value={AVAILABLE}>
                      {formatMessage(messages.parking_available)}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={6}>
                {visibilityOfParkinSizeField ? (
                  <Form.Item label={formatMessage(messages.parking_size)}>
                    <Field
                      component={FormInputField}
                      name={'parking_size'}
                      type={'number'}
                      min={1}
                    />
                  </Form.Item>
                ) : null}
              </Col>
            </Row>
            <Form.Item label={formatMessage(messages.working_hours)}>
              <Row gutter={8}>
                <Col xs={10} md={6}>
                  <Field
                    component={FormInputField}
                    name={'start_of_work'}
                    type={'time'}
                  />
                </Col>
                <Col md={4} className="text-center">
                  <MinusOutlined className="mt-3 text-primary" />
                </Col>
                <Col xs={10} md={6}>
                  <Field
                    component={FormInputField}
                    name={'end_of_work'}
                    type={'time'}
                  />
                </Col>
              </Row>
            </Form.Item>

            <Row>
              <Col>
                <Form.Item>
                  <Button
                    name="submit"
                    type="primary"
                    disabled={loading || !dirty || !isValid}
                    onClick={handleSubmit}
                  >
                    {formatMessage(
                      clinicData
                        ? messages.update_button
                        : messages.create_button
                    )}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

ClinicForm.defaultProps = {
  showSuccess: () => {},
  showError: () => {},
};

export default ClinicForm;
