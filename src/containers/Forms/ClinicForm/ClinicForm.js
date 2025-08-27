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
import FormTimePicker from 'components/custom-components/Form/FormTimePicker';
import Checkbox from 'antd/lib/checkbox/Checkbox';

const ClinicForm = ({ clinicData = null, showSuccess, showError }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const loading = useSelector(makeSelectIsLoading());
  const [visibilityOfParkinSizeField, setVisibility] = useState(
    clinicData?.parking_availability === AVAILABLE
  );
  const [isAllDayChecked, setIsAllDayChecked] = useState(
    clinicData?.start_of_work === '00:00:00' &&
    clinicData?.end_of_work === '00:00:00'
  );
  const { isPasIntegrated } = useSelector(state => state.auth.user);

  const location = useLocation();

  const editClinicSlug = '/edit-clinic';
  const initialWorkTime = '00:00';

  const checkIsInSettingsPage = () =>
    location.pathname.endsWith(editClinicSlug);

  const handleSubmit = (values) => {
    const formData = prepareFormData({ ...values });
    if (!(values.photo instanceof File) || !values.photo)
      formData.delete('photo');
    if (!values.photo) {
      formData.append('photo', '');
    }
    formData.delete('isPasIntegrated')
    formData.append('isPasIntegrated', false)
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
          street_number: clinicData?.street_number || '',
          street_name: clinicData?.street_name || '',
          area_of_living: clinicData?.area_of_living || '',
          city: clinicData?.city || '',
          post_code: clinicData?.post_code || '',
          country: clinicData?.country || '',
          google_maps_link: clinicData?.google_maps_link || '',
          parking_availability: clinicData?.parking_availability || NO,
          parking_size: clinicData?.parking_size || 0,
          start_of_work: clinicData?.start_of_work || initialWorkTime,
          end_of_work: clinicData?.end_of_work || initialWorkTime,
          PasAPIEndpoint: clinicData?.PasAPIEndpoint || '',
          isPasIntegrated: clinicData?.isPasIntegrated || isPasIntegrated,
        }}
        enableReinitialize
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
                <Field
                  component={FormImageUpload}
                  name={'photo'}
                  removeImageLabel={formatMessage(messages.removeImageButton)}
                />
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
                <Row gutter={24}>
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
                    span={16}
                    component={FormField}
                    label={formatMessage(messages.phoneNumber)}
                    name={'phone_number'}
                    errorTexts={{
                      label: formatMessage(messages.phoneNumber),
                      matchesLabel: formatMessage(messages.phoneNumberFormat),
                      minValue: MIN_PHONE_LENGTH,
                      maxValue: MAX_PHONE_LENGTH,
                    }}
                  // disabled
                  />
                </Row>
                <Row gutter={24}>
                  <ColumnField
                    span={12}
                    component={FormField}
                    label={formatMessage(messages.streetNumber)}
                    name={'street_number'}
                    errorTexts={{
                      label: formatMessage(
                        messages.errorInputLabelStreetNumber
                      ),
                      maxValue: 8,
                    }}
                  />
                  <ColumnField
                    span={12}
                    component={FormField}
                    label={formatMessage(messages.streetName)}
                    name={'street_name'}
                    errorTexts={{
                      label: formatMessage(messages.errorInputLabelStreetName),
                      maxValue: 128,
                    }}
                    required
                  />
                </Row>
                <Row gutter={24}>
                  <ColumnField
                    span={12}
                    component={FormField}
                    label={formatMessage(messages.area)}
                    name={'area_of_living'}
                    errorTexts={{
                      label: formatMessage(messages.errorInputLabelArea),
                      maxValue: 128,
                    }}
                  />
                  <ColumnField
                    span={12}
                    component={FormField}
                    label={formatMessage(messages.city)}
                    name={'city'}
                    errorTexts={{
                      label: formatMessage(messages.errorInputLabelCity),
                      maxValue: 64,
                    }}
                    required
                  />
                </Row>
                <Row gutter={24}>
                  <ColumnField
                    span={12}
                    component={FormField}
                    label={formatMessage(messages.postCode)}
                    name={'post_code'}
                    errorTexts={{
                      label: formatMessage(messages.errorInputLabelPostCode),
                      maxValue: 16,
                    }}
                    required
                  />
                  <ColumnField
                    span={12}
                    component={FormField}
                    label={formatMessage(messages.country)}
                    name={'country'}
                    errorTexts={{
                      label: formatMessage(messages.errorInputLabelCountry),
                      maxValue: 64,
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
                  <Col>
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
                      component={FormTimePicker}
                      name="start_of_work"
                      errorTexts={{
                        label: formatMessage(messages.startOfWork),
                      }}
                      disabled={isAllDayChecked}
                    />
                    <Col span={2} className="text-center">
                      <MinusOutlined className="mt-3 text-primary" />
                    </Col>
                    <Field
                      span={6}
                      component={FormTimePicker}
                      name="end_of_work"
                      errorTexts={{
                        label: formatMessage(messages.endOfWork),
                      }}
                      disabled={isAllDayChecked}
                    />
                    <Col span={8} className="mt-2 text-center">
                      <Checkbox
                        onChange={(e) => setIsAllDayChecked(e.target.checked)}
                        checked={isAllDayChecked}
                      >
                        {formatMessage(messages.allDayWorkingHours)}
                      </Checkbox>
                    </Col>
                  </Row>
                </Form.Item>
                <Row>
                  <Col>
                    <Form.Item>
                      <Button
                        name="submit"
                        type="primary"
                        // disabled={loading || !dirty || !isValid}
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
  showSuccess: () => { },
  showError: () => { },
};

export default ClinicForm;
