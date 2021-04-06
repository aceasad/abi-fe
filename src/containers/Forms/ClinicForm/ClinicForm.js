import { MinusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Radio, Row, Typography } from 'antd';
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
import ColumnField from 'components/custom-components/Form/ColumnField';
import localeString from 'utils/localeString';
import { prepareFormData } from 'utils/helpers';

const { Title } = Typography;

const ClinicForm = ({
  clinicData = null,
  showSuccess,
  showError,
  localization = true,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const loading = useSelector(makeSelectIsLoading());

  const [visibilityOfParkinSizeField, setVisibility] = useState(
    clinicData?.parking_availability === AVAILABLE
  );

  const handleSubmit = (values, { resetForm }) => {
    const formData = prepareFormData({ ...values });
    if (!(values.photo instanceof File)) formData.delete('photo');

    if (clinicData) {
      dispatch(
        updateClinic({
          updatedClinic: formData,
          clinicId: clinicData.id,
          showSuccess,
          showError,
        })
      );
    } else {
      dispatch(createClinic(formData));
    }
  };

  return (
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
          <Row className="mb-5 mt-4">
            <Col sm={{ span: 6, offset: 10 }} xl={{ span: 6, offset: 9 }}>
              <Field component={FormImageUpload} name={'photo'} />
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <Title type="secondary" level={2} className="mt-4 ml-2">
                {localeString(localization, 'clinic_page.side.title')}
              </Title>
            </Col>
            <Col sm={16} xl={12}>
              <Row>
                <ColumnField
                  span={24}
                  component={FormField}
                  label={formatMessage(messages.clinic_name)}
                  name={'name'}
                  errorTexts={{
                    label: formatMessage(messages.error_input_label_name),
                    maxValue: formatMessage(messages.max),
                  }}
                />
              </Row>
              <Row gutter={16}>
                <ColumnField
                  span={8}
                  component={FormField}
                  label={formatMessage(messages.phone_number)}
                  name={'phone_number'}
                  errorTexts={{
                    label: formatMessage(
                      messages.error_input_label_phone_number
                    ),
                    maxValue: formatMessage(messages.max),
                  }}
                />
                <ColumnField
                  span={16}
                  component={FormField}
                  label={formatMessage(messages.address)}
                  name={'address'}
                  errorTexts={{
                    label: formatMessage(messages.error_input_label_address),
                    maxValue: formatMessage(messages.max),
                  }}
                />
              </Row>
              <Row>
                <ColumnField
                  span={24}
                  component={FormField}
                  label={formatMessage(messages.google_maps_link)}
                  name={'google_maps_link'}
                  errorTexts={{
                    label: formatMessage(messages.google_maps_link),
                    matchesLabel: formatMessage(
                      messages.error_input_label_google_maps_link
                    ),
                    maxValue: formatMessage(messages.max_google_link),
                  }}
                />
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    name="radio-group"
                    label={formatMessage(messages.parking_availability)}
                  >
                    <Radio.Group
                      className="width-100"
                      defaultValue={values.parking_availability}
                      onChange={(event) => {
                        setVisibility(event.target.value === AVAILABLE);
                        values.parking_availability = event.target.value;
                      }}
                    >
                      <Row>
                        <Col span={8}>
                          <Radio value={NO}>
                            {formatMessage(messages.parking_no)}
                          </Radio>
                        </Col>
                        <Col span={8}>
                          <Radio value={FREE}>
                            {formatMessage(messages.parking_free)}
                          </Radio>
                        </Col>
                        <Col span={8}>
                          <Radio value={AVAILABLE}>
                            {formatMessage(messages.parking_available)}
                          </Radio>
                        </Col>
                      </Row>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col offset={16} span={6}>
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
                  <Field
                    span={6}
                    component={FormInputField}
                    name={'start_of_work'}
                    type={'time'}
                  />
                  <Col span={2} className="text-center">
                    <MinusOutlined className="mt-3 text-primary" />
                  </Col>
                  <Field
                    span={6}
                    component={FormInputField}
                    name={'end_of_work'}
                    type={'time'}
                  />
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
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

ClinicForm.defaultProps = {
  showSuccess: () => {},
  showError: () => {},
};

export default ClinicForm;
