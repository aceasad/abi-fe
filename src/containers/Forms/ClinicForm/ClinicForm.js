import { MinusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Radio, Row, Typography } from 'antd';
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
import {
  AVAILABLE,
  FREE,
  NO,
  MIN_PHONE_LENGTH,
  MAX_PHONE_LENGTH,
} from 'constants/ClinicConstants';
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

  const handleSubmit = (values) => {
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
    <Card className="m-4">
      <Formik
        initialValues={{
          photo: clinicData?.photo?.thumbnail || null,
          name: clinicData?.name || '',
          phone_number: clinicData?.phone_number || '',
          address: clinicData?.address || '',
          google_maps_link: clinicData?.google_maps_link || '',
          parking_availability: clinicData?.parking_availability || NO,
          parking_size: clinicData?.parking_size || 0,
          start_of_work: clinicData?.start_of_work || '',
          end_of_work: clinicData?.end_of_work || '',
        }}
        validationSchema={clinicSchema}
        onSubmit={handleSubmit}
      >
        {({ dirty, isValid, values, handleSubmit, setFieldValue }) => (
          <Form layout="vertical" name="clinic-form" onSubmit={handleSubmit}>
            <Row className="mb-5 mt-4">
              <ColumnField
                offset={7}
                span={6}
                component={FormImageUpload}
                name={'photo'}
              />
            </Row>

            <Row>
              <Col span={6}>
                <Title type="secondary" level={2} className="mt-4 ml-2">
                  {localeString(localization, 'clinic_page.side.title')}
                </Title>
              </Col>
              <Col span={12}>
                <Row>
                  <ColumnField
                    span={24}
                    component={FormField}
                    label={formatMessage(messages.clinicName)}
                    name={'name'}
                    errorTexts={{
                      label: formatMessage(messages.errorInputLabelName),
                      maxValue: formatMessage(messages.max),
                    }}
                  />
                </Row>
                <Row gutter={16}>
                  <ColumnField
                    span={8}
                    component={FormField}
                    label={formatMessage(messages.phoneNumber)}
                    name={'phone_number'}
                    errorTexts={{
                      label: formatMessage(messages.phoneNumber),
                      matchesLabel: formatMessage(messages.phoneNumberFormat),
                      minValue: MIN_PHONE_LENGTH,
                      maxValue: MAX_PHONE_LENGTH,
                    }}
                  />
                  <ColumnField
                    span={16}
                    component={FormField}
                    label={formatMessage(messages.address)}
                    name={'address'}
                    errorTexts={{
                      label: formatMessage(messages.errorInputLabelAddress),
                      maxValue: formatMessage(messages.max),
                    }}
                  />
                </Row>
                <Row>
                  <ColumnField
                    span={24}
                    component={FormField}
                    label={formatMessage(messages.googleMapsLink)}
                    name={'google_maps_link'}
                    errorTexts={{
                      label: formatMessage(messages.googleMapsLink),
                      matchesLabel: formatMessage(
                        messages.errorInputLabelGoogleMapsLink
                      ),
                      maxValue: formatMessage(messages.maxGoogleLink),
                    }}
                  />
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name="radio-group"
                      label={formatMessage(messages.parkingAvailability)}
                    >
                      <Radio.Group
                        className="width-100"
                        defaultValue={values.parking_availability}
                        onChange={(event) => {
                          setVisibility(event.target.value === AVAILABLE);
                          setFieldValue(
                            'parking_availability',
                            event.target.value
                          );
                        }}
                      >
                        <Row>
                          <Col span={8}>
                            <Radio value={NO}>
                              {formatMessage(messages.parkingNo)}
                            </Radio>
                          </Col>
                          <Col span={8}>
                            <Radio value={FREE}>
                              {formatMessage(messages.parkingFree)}
                            </Radio>
                          </Col>
                          <Col span={8}>
                            <Radio value={AVAILABLE}>
                              {formatMessage(messages.parkingAvailable)}
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
                      <Form.Item label={formatMessage(messages.parkingSize)}>
                        <Field
                          component={FormField}
                          name={'parking_size'}
                          type={'number'}
                          min={1}
                        />
                      </Form.Item>
                    ) : null}
                  </Col>
                </Row>
                <Form.Item label={formatMessage(messages.workingHours)}>
                  <Row gutter={8}>
                    <Field
                      span={6}
                      component={FormField}
                      name="start_of_work"
                      type="time"
                      errorTexts={{
                        label: formatMessage(messages.startOfWork),
                      }}
                    />
                    <Col span={2} className="text-center">
                      <MinusOutlined className="mt-3 text-primary" />
                    </Col>
                    <Field
                      span={6}
                      component={FormField}
                      name="end_of_work"
                      type="time"
                      errorTexts={{
                        label: formatMessage(messages.endOfWork),
                      }}
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
                            ? messages.updateButton
                            : messages.createButton
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
    </Card>
  );
};

ClinicForm.defaultProps = {
  showSuccess: () => {},
  showError: () => {},
};

export default ClinicForm;
