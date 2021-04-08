import { MinusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Radio, Row, Space, Typography } from 'antd';
import FormField from 'components/custom-components/Form/FormField';
import FormImageUpload from 'components/custom-components/Form/FormImageUpload';
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
import { prepareFormData } from 'utils/helpers';
import { useLocation } from 'react-router-dom';

const ClinicForm = ({ clinicData = null, showSuccess, showError }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const loading = useSelector(makeSelectIsLoading());
  const [visibilityOfParkinSizeField, setVisibility] = useState(
    clinicData?.parking_availability === AVAILABLE
  );
  const location = useLocation();

  const editClinicSlug = '/edit-clinic';

  const checkIsInSettingsPage = () =>
    location.pathname.endsWith(editClinicSlug);

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
    <div
      style={
        !checkIsInSettingsPage()
          ? {
              maxWidth: '60rem',
              margin: 'auto',
            }
          : {}
      }
    >
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
          <Form
            layout="vertical"
            name="clinic-form"
            onSubmit={handleSubmit}
            className="p-2"
          >
            <Row
              className="mb-5 mt-4"
              justify={checkIsInSettingsPage() ? 'start' : 'center'}
            >
              <Col>
                <Field component={FormImageUpload} name={'photo'} />
              </Col>
            </Row>

            <Row gutter={16}>
              {!checkIsInSettingsPage() && (
                <Col span={6}>
                  <Typography.Title
                    type="secondary"
                    level={2}
                    className="mt-4 ml-2"
                  >
                    {formatMessage({ id: 'clinic_page.side.title' })}
                  </Typography.Title>
                </Col>
              )}
              <Col span={checkIsInSettingsPage() ? 24 : 18} xl={18}>
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
                <Row gutter={16}>
                  <Col className="mb-1">
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
                        <Space>
                          <Radio value={NO}>
                            {formatMessage(messages.parkingNo)}
                          </Radio>
                          <Radio value={FREE}>
                            {formatMessage(messages.parkingFree)}
                          </Radio>
                          <Radio value={AVAILABLE}>
                            {formatMessage(messages.parkingAvailable)}
                          </Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col>
                    {visibilityOfParkinSizeField ? (
                      <Form.Item
                        label={formatMessage(messages.parkingSize)}
                        className="mb-0"
                      >
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
    </div>
  );
};

ClinicForm.defaultProps = {
  showSuccess: () => {},
  showError: () => {},
};

export default ClinicForm;
