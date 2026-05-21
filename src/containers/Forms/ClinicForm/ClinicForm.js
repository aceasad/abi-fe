import { MinusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Radio, Row, Space, Typography, Grid } from 'antd';
import FormField from 'components/custom-components/Form/FormField';
import FormImageUpload from 'components/custom-components/Form/FormImageUpload';
import { Field, Formik } from 'formik';
import React, { useState } from 'react';
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
import ColumnField from 'components/custom-components/Form/ColumnField';
import { isUsCountry, prepareFormData } from 'utils/helpers';
import { useLocation } from 'react-router-dom';
import FormTimePicker from 'components/custom-components/Form/FormTimePicker';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import utils from 'utils';

const { useBreakpoint } = Grid;

const ClinicForm = ({ clinicData = null, showSuccess, showError }) => {
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
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isTablet = screens.includes('md') && !screens.includes('lg');

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
    formData.append('isPasIntegrated', true)
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
        {({ dirty, isValid, values, handleSubmit, setFieldValue }) => {
          const workingHoursDisplayFormat = isUsCountry(values.country || '')
            ? 'h:mm A'
            : 'HH:mm';
          const isWorkingHours12h = workingHoursDisplayFormat === 'h:mm A';
          return (
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
                  removeImageLabel={"Remove Image"}
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
                    Clinic details
                  </Typography.Title>
                </Col>
              )}
              <Col span={checkIsInSettingsPage() ? 24 : 18} xl={18}>
                <Row gutter={24}>
                  <ColumnField
                    span={24}
                    component={FormField}
                    label={"Clinic Name"}
                    name={'name'}
                    errorTexts={{
                      label: "Name",
                      maxValue: 100,
                    }}
                  />
                </Row>

                <Row gutter={16}>
                  <ColumnField
                    span={16}
                    component={FormField}
                    label={"Phone number"}
                    name={'phone_number'}
                    errorTexts={{
                      label: "Phone number",
                      matchesLabel: "Phone number format is +xxxxxxxxxxxxxxx",
                      minValue: MIN_PHONE_LENGTH,
                      maxValue: MAX_PHONE_LENGTH,
                    }}
                  // disabled
                  />
                </Row>
                <Row gutter={isMobile ? 16 : 24}>
                  <ColumnField
                    span={isMobile && !isTablet ? 24 : 12}
                    component={FormField}
                    label={"Street number"}
                    name={'street_number'}
                    errorTexts={{
                      label: "Street number",
                      maxValue: 8,
                    }}
                  />
                  <ColumnField
                    span={isMobile && !isTablet ? 24 : 12}
                    component={FormField}
                    label={"Street name"}
                    name={'street_name'}
                    errorTexts={{
                      label: "Street name",
                      maxValue: 128,
                    }}
                    required
                  />
                </Row>
                <Row gutter={isMobile ? 16 : 24}>
                  <ColumnField
                    span={isMobile && !isTablet ? 24 : 12}
                    component={FormField}
                    label={"Area"}
                    name={'area_of_living'}
                    errorTexts={{
                      label: "Area",
                      maxValue: 128,
                    }}
                  />
                  <ColumnField
                    span={isMobile && !isTablet ? 24 : 12}
                    component={FormField}
                    label={"City"}
                    name={'city'}
                    errorTexts={{
                      label: "City",
                      maxValue: 64,
                    }}
                    required
                  />
                </Row>
                <Row gutter={isMobile ? 16 : 24}>
                  <ColumnField
                    span={isMobile && !isTablet ? 24 : 12}
                    component={FormField}
                    label={"Postcode"}
                    name={'post_code'}
                    errorTexts={{
                      label: "Postcode",
                      maxValue: 16,
                    }}
                    required
                  />
                  <ColumnField
                    span={isMobile && !isTablet ? 24 : 12}
                    component={FormField}
                    label={"Country"}
                    name={'country'}
                    errorTexts={{
                      label: "Country",
                      maxValue: 64,
                    }}
                  />
                </Row>
                <Row>
                  <ColumnField
                    span={24}
                    component={FormField}
                    label={"Google maps link"}
                    name={'google_maps_link'}
                    errorTexts={{
                      label: "Google maps link",
                      matchesLabel: "Google maps link",
                      maxValue: 500,
                    }}
                  />
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="radio-group"
                      label={"Parking availability"}
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
                        <Space direction={isMobile && !isTablet ? 'vertical' : 'horizontal'}>
                          <Radio value={NO}>
                            {"No parking"}
                          </Radio>
                          <Radio value={FREE}>
                            {"Free"}
                          </Radio>
                          <Radio value={AVAILABLE}>
                            {"Parking available"}
                          </Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    {visibilityOfParkinSizeField ? (
                      <Form.Item
                        label={"Parking space"}
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
                <Form.Item label={"Working hours"}>
                  <Row gutter={8}>
                    <Field
                      span={isMobile && !isTablet ? 24 : 6}
                      component={FormTimePicker}
                      name="start_of_work"
                      displayFormat={workingHoursDisplayFormat}
                      use12Hours={isWorkingHours12h}
                      errorTexts={{
                        label: "Start of Work",
                      }}
                      disabled={isAllDayChecked}
                    />
                    {!isMobile && (
                      <Col span={2} className="text-center">
                        <MinusOutlined className="mt-3 text-primary" />
                      </Col>
                    )}
                    <Field
                      span={isMobile && !isTablet ? 24 : 6}
                      component={FormTimePicker}
                      name="end_of_work"
                      displayFormat={workingHoursDisplayFormat}
                      use12Hours={isWorkingHours12h}
                      errorTexts={{
                        label: "End of Work",
                      }}
                      disabled={isAllDayChecked}
                    />
                    <Col span={isMobile && !isTablet ? 24 : 8} className={isMobile && !isTablet ? 'mt-2' : 'mt-2 text-center'}>
                      <Checkbox
                        onChange={(e) => setIsAllDayChecked(e.target.checked)}
                        checked={isAllDayChecked}
                      >
                        {"Working hours 00-24"}
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
                        {clinicData
                            ? "Update"
                            : "Create"}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
          );
        }}
      </Formik>
    </div>
  );
};

ClinicForm.defaultProps = {
  showSuccess: () => { },
  showError: () => { },
};

export default ClinicForm;
