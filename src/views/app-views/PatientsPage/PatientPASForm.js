import React, { useContext, useEffect, useRef, useState } from 'react';
import { interpolate } from 'utils/interpolate';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Formik } from 'formik';
import { Button, Card, Col, message, Row, Typography, Modal, Grid } from 'antd';
import Form from 'antd/lib/form/Form';

import PatientHeader from './PatientHeader';
import FormField from 'components/custom-components/Form/FormField';
import FormDatePicker from 'components/custom-components/Form/FormDatePicker';
import FormSelect from 'components/custom-components/Form/FormSelect';
import ColumnField from 'components/custom-components/Form/ColumnField';
import messages from './messages';
import {
  makeSelectPatientDetails,
  makeSelectPatientLocations,
} from 'redux/selectors/Patient';
import { makeSelectAppointmentTypes } from 'redux/selectors/Appointment';
import { patientSchema } from 'utils/validations';
import { MAX, NHS_MAX } from 'constants/ClinicConstants';
import { filterNumberInput } from 'utils/helpers';
import PatientFormExistingConditions from './PatientFormExistingConditions';
import PatientFormPreviousOperationss from './PatientFormPreviousOperations';
import {
  deleteOperationTypeFromOrganization,
  resetExistingMedicalConditions,
  resetPreviousOperations,
} from 'redux/actions/Anamnesis';
import { BeforeRouteContext } from 'utils/context';
import {
  getPatientDetailsNewPatientForm,
  getPatientLocations,
} from 'redux/actions/Patient';
import { getAppointmentTypes } from 'redux/actions/Appointment';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';
import dayjs from 'utils/dayjs';
import { COUNTRY_CODES } from 'constants/CountryCodesConstants';
import utils from 'utils';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const PatientPASForm = ({
  title,
  showList,
  handleSubmit,
  genderChoices,
  initialState,
  loading,
  id,
  pasProvider,
}) => {
  const headerRef = useRef(null);
  const [isSaveVisible, setIsSaveVisible] = useState(false);
  const dispatch = useDispatch();
  const { setContext, ...rest } = useContext(BeforeRouteContext);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);
  const formRef = useRef();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isTablet = screens.includes('md') && !screens.includes('lg');
  const isMedbridge = pasProvider === 'medbridge';
  const { education, employment, material_status, ethnicities } = useSelector(
    makeSelectPatientDetails()
  );
  const { locations } = useSelector(makeSelectPatientLocations());
  const { appointmentTypes, appointmentTypesLoading } = useSelector(
    makeSelectAppointmentTypes()
  );

  const afterDelete = () => {
    message.success(messages.operationTypeDeleted);
  };

  const handleSubmitWrapper = (values, { setErrors }) => {
    if (isMedbridge && !values.appointment_type) {
      setErrors({
        appointment_type: messages.appointmentType,
      });
      return;
    }
    const locationsById = locations.reduce((acc, location) => {
      if (location?.location_id) {
        acc[String(location.location_id)] = location;
      }
      return acc;
    }, {});
    const parsedValues = {
      ...values,
      phone_number: values.country_code + values.phone_number,
    };
    delete parsedValues.pas_provider;
    if (isMedbridge) {
      // ensure appointment_type is null or a primitive id
      if (!parsedValues.appointment_type) {
        parsedValues.appointment_type = null;
      }

      if (parsedValues.home_location) {
        parsedValues.home_location =
          locationsById[String(parsedValues.home_location)] || {
            location_id: parsedValues.home_location,
          };
      }

      if (Array.isArray(parsedValues.available_location_ids)) {
        parsedValues.available_location_ids =
          parsedValues.available_location_ids
            .map(
              (location_id) =>
                locationsById[String(location_id)] || { location_id: location_id }
            )
            .filter(Boolean);
      }
    }

    // Include date_of_birth only when provided and valid.
    if (values.date_of_birth) {
      const formattedDate = dayjs(values.date_of_birth, 'DD/MM/YYYY');
      if (formattedDate.isValid()) {
        parsedValues.date_of_birth = formattedDate.format(
          DATE_FORMAT_DD_MM_YYYY
        );
      } else {
        delete parsedValues.date_of_birth;
      }
    } else {
      delete parsedValues.date_of_birth;
    }

    console.log('Patient submit payload (PAS)', parsedValues);
    handleSubmit(parsedValues, setErrors, enableRedirect);
  };

  const deleteOperationType = ({ item, action }) => {
    Modal.confirm({
      title: interpolate(messages.deleteOperationType, {
        name: item.operation_type,
      }),
      okText: messages.formConfirmationButton,
      okType: 'danger',
      cancelText: messages.cancel,
      onOk() {
        dispatch(
          deleteOperationTypeFromOrganization({
            item,
            afterDelete: () => {
              afterDelete();
              action(item);
            },
          })
        );
      },
    });
  };

  const showDiscardModal = () => {
    formRef.current?.dirty ? setDiscardModalVisible(true) : enableRedirect();
  };

  useEffect(() => {
    if (discardModalVisible)
      Modal.confirm({
        title: messages.discardTitle,
        content: messages.discardText,
        okText: messages.discardButton,
        okType: 'danger',
        cancelText: messages.cancel,
        onCancel() {
          setDiscardModalVisible(false);
        },
        onOk() {
          showList();
          enableRedirect();
        },
      });
  }, [discardModalVisible]);

  useEffect(() => {
    setContext({ ...rest, proceed: false, action: showDiscardModal });
    const observerOptions = {
      threshold: 1.0,
    };
    const observerCallback = (entries) => {
      setIsSaveVisible(!entries[0].isIntersecting);
    };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    headerRef.current && observer.observe(headerRef.current);

    return () => {
      headerRef.current && observer.unobserve(headerRef.current);
      dispatch(resetPreviousOperations());
      dispatch(resetExistingMedicalConditions());
    };
  }, []);

  const enableRedirect = () => setContext({ ...rest, proceed: true });

  useEffect(() => {
    dispatch(getPatientDetailsNewPatientForm());
  }, []);

  useEffect(() => {
    if (isMedbridge) {
      dispatch(getPatientLocations());
    }
  }, [dispatch, isMedbridge]);

  useEffect(() => {
    if (isMedbridge && !appointmentTypes?.length && !appointmentTypesLoading) {
      dispatch(getAppointmentTypes());
    }
  }, [dispatch, isMedbridge, appointmentTypes?.length, appointmentTypesLoading]);

  const locationOptions = locations
    .map((location) => {
      if (!location?.location_id) return null;
      const id = String(location.location_id);
      const name = location.location_name || id;
      return {
        id,
        name: `${name} (${id})`,
      };
    })
    .filter(Boolean);

  const appointmentTypeOptions = (appointmentTypes || []).map((type) => ({
    id: type.id,
    name: type.name,
  }));

  return (
    <div style={{ paddingTop: isMobile ? 0 : '24px' }}>
      <Formik
        enableReinitialize
        initialValues={{
          ...initialState,
          // country_code: '44',
        }}
        innerRef={formRef}
        onSubmit={handleSubmitWrapper}
        validationSchema={patientSchema}
      >
        {({ values, dirty, isValid, handleSubmit, setFieldValue }) => (
          <>
            <div ref={headerRef}>
              <PatientHeader
                title={title}
                secondaryAction={() => {
                  showDiscardModal(true);
                }}
                primaryAction={() => {
                  handleSubmit();
                }}
                primaryDisabled={!dirty || loading}
              />
            </div>
            <Card className={isMobile ? 'p-2' : 'p-4'}>
              <Form layout="vertical" style={{ marginBottom: 0 }}>
                <Row gutter={isMobile ? 12 : 16}>
                  {!isMobile && (
                    <Col xs={24} lg={6}>
                      <Title type="secondary" level={2} className="mt-4">
                        {messages.personalDetails}
                      </Title>
                    </Col>
                  )}

                  <Col xs={24} lg={18}>
                    {isMobile && (
                      <Title type="secondary" level={3} className="mb-3">
                        {messages.personalDetails}
                      </Title>
                    )}
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 8}
                        component={FormField}
                        label={messages.firstName}
                        name="first_name"
                        errorTexts={{
                          label: messages.firstName,
                          maxValue: MAX,
                        }}
                        required
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 8}
                        component={FormField}
                        label={messages.lastName}
                        name="last_name"
                        errorTexts={{
                          label: messages.lastName,
                          maxValue: MAX,
                        }}
                        required
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 8}
                        component={FormField}
                        label={messages.patientIdent}
                        name="ExternalIdentificationNumber"
                        errorTexts={{
                          label: messages.patientIdent,
                          matchesLabel: messages.patientIdentFormat,
                          maxValue: NHS_MAX,
                        }}
                        required
                      />
                      {isMedbridge && (
                        <>
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 8}
                            component={FormField}
                            label={messages.caseId}
                            name="case_id"
                            errorTexts={{
                              label: messages.caseId,
                              maxValue: 20,
                            }}
                            required={isMedbridge}
                          />
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 8}
                            component={FormSelect}
                            label={messages.homeLocation}
                            name="home_location"
                            options={locationOptions}
                            optionField="name"
                            showSearch
                            filterOption={(input, option) =>
                              `${option?.value ?? ''} ${option?.children ?? ''}`
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            errorTexts={{
                              label: messages.homeLocation,
                              maxValue: 20,
                            }}
                            required={isMedbridge}
                          />
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 8}
                            component={FormSelect}
                            label={messages.appointmentType}
                            name="appointment_type"
                            options={appointmentTypeOptions}
                            optionField="name"
                            errorTexts={{
                              label: messages.appointmentType,
                            }}
                            required={isMedbridge}
                          />
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 8}
                            component={FormSelect}
                            label={messages.availableLocations}
                            name="available_location_ids"
                            options={locationOptions}
                            optionField="name"
                            mode="multiple"
                            showSearch
                            filterOption={(input, option) =>
                              `${option?.value ?? ''} ${option?.children ?? ''}`
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            errorTexts={{
                              label: messages.availableLocations,
                              maxValue: 20,
                            }}
                          />
                        </>
                      )}
                      {/* <ColumnField
                      span={8}
                      maxDate={new Date()}
                      component={FormDatePicker}
                      disablePastDates
                      label={messages.dateOfBirth}
                      name="date_of_birth"
                      required
                    /> */}
                      {/* <ColumnField
                      span={8}
                      component={FormSelect}
                      name="gender"
                      options={genderChoices}
                      optionField="name"
                      defaultOption={values.gender}
                      label={messages.sex}
                      required
                    /> */}
                    </Row>
                    {/* <Row gutter={16}>


                    <ColumnField
                      span={8}
                      component={FormField}
                      label={messages.height}
                      name="height"
                      type={'number'}
                      onKeyDown={filterNumberInput}
                      min={0}
                      suffix="CMs"
                    />
                    <ColumnField
                      span={8}
                      component={FormField}
                      label={messages.weight}
                      name="weight"
                      type={'number'}
                      onKeyDown={filterNumberInput}
                      min={0}
                      suffix="KGs"
                    />
                  </Row> */}
                    {/* <Row gutter={16}>
                    <ColumnField
                      span={8}
                      component={FormSelect}
                      name="ethnicity"
                      options={ethnicities}
                      optionField="name"
                      defaultOption={values.ethnicity}
                      label={messages.ethnicity}
                    />
                  </Row> */}
                  </Col>
                </Row>

                <Row gutter={isMobile ? 12 : 16}>
                  {!isMobile && (
                    <Col xs={24} lg={6}>
                      <Title type="secondary" level={2} className="mt-4">
                        {messages.contactDetails}
                      </Title>
                    </Col>
                  )}

                  <Col xs={24} lg={18}>
                    {isMobile && (
                      <Title type="secondary" level={3} className="mb-3 mt-4">
                        {messages.contactDetails}
                      </Title>
                    )}
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 8}
                        component={FormSelect}
                        name="country_code"
                        options={COUNTRY_CODES}
                        optionField="name"
                        defaultOption={values.country_code}
                        label={messages.countryCode}
                        showSearch
                        filterOption={(input, option) =>
                          `${option?.value ?? ''} ${option?.children ?? ''}`
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        errorTexts={{
                          label: messages.countryCode,
                          matchesLabel: messages.countryCodeFormat,
                          maxValue: 4,
                        }}
                        required
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={messages.phoneNumber}
                        name="phone_number"
                        errorTexts={{
                          label: messages.phoneNumber,
                          matchesLabel: messages.phoneNumberFormat,
                          maxValue: 10,
                        }}
                        required
                      />
                    </Row>
                    {/* <Row gutter={16}>
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={messages.email}
                      name="email"
                      required
                    />
                  </Row> */}
                  </Col>
                </Row>
                {/* 
                <Row gutter={isMobile ? 12 : 16}>
                  {!isMobile && (
                    <Col xs={24} lg={6}>
                      <Title type="secondary" level={2} className="mt-4">
                        {messages.addressDetails}
                      </Title>
                    </Col>
                  )}

                  <Col xs={24} lg={18}>
                    {isMobile && (
                      <Title type="secondary" level={3} className="mb-3 mt-4">
                        {messages.addressDetails}
                      </Title>
                    )}
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={messages.streetName}
                        name="street_name"
                        errorTexts={{
                          label: messages.streetName,
                          maxValue: 128,
                        }}
                        required
                        autoComplete="new-address"
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={messages.streetNumber}
                        name="street_number"
                        errorTexts={{
                          label: messages.streetNumber,
                          maxValue: 8,
                        }}
                        autoComplete="new-address"
                      />
                    </Row>
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={messages.areaOfLiving}
                        name="area_of_living"
                        errorTexts={{
                          label: messages.areaOfLiving,
                          maxValue: 128,
                        }}
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={messages.city}
                        name="city"
                        errorTexts={{
                          label: messages.city,
                          maxValue: 64,
                        }}
                        required
                      />
                    </Row>
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={messages.postCode}
                        name="post_code"
                        errorTexts={{
                          label: messages.postCode,
                          maxValue: 16,
                        }}
                        required
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={messages.country}
                        name="country"
                        errorTexts={{
                          label: messages.country,
                          maxValue: 64,
                        }}
                      />
                  </Row>
                </Col>
              </Row> */}
                {/* 
                <Row gutter={isMobile ? 12 : 16}>
                  {!isMobile && (
                    <Col xs={24} lg={6}>
                      <Title type="secondary" level={2} className="mt-4">
                        {messages.otherDetails}
                      </Title>
                    </Col>
                  )}

                  <Col xs={24} lg={18}>
                    {isMobile && (
                      <Title type="secondary" level={3} className="mb-3 mt-4">
                        {messages.otherDetails}
                      </Title>
                    )}
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormSelect}
                        name="material_status"
                        options={material_status}
                        optionField="name"
                        defaultOption={values.material_status}
                        label={messages.materialStatus}
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={messages.numberOfDependants}
                        name="number_of_dependants"
                        onKeyDown={filterNumberInput}
                        type={'number'}
                        min={0}
                      />
                    </Row>
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormSelect}
                        name="employment"
                        options={employment}
                        optionField="name"
                        defaultOption={values.employment}
                        label={messages.employmentStatus}
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormSelect}
                        name="education"
                        options={education}
                        optionField="name"
                        defaultOption={values.education}
                        label={messages.education}
                      />
                  </Row>
                  <Row gutter={isMobile ? 12 : 16}>
                    <Col xs={24} sm={isMobile && !isTablet ? 24 : 12}>
                      <Field
                        component={FormField}
                        label={messages.insurance}
                        name="insurance"
                        errorTexts={{
                          label: messages.insurance,
                          maxValue: MAX,
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row> */}
              </Form>
            </Card>

            {/* <PatientFormExistingConditions
            setFieldValue={setFieldValue}
            id={id}
          />

          <PatientFormPreviousOperationss
            id={id}
            setOperations={(callback) =>
              setFieldValue('operations', callback(values.operations))
            }
            deleteOperationType={deleteOperationType}
          /> */}

            <Button
              onClick={() => {
                handleSubmit();
              }}
              type="primary"
              className={`floating-button ${!dirty || loading || !isSaveVisible ? '' : 'active'
                }`}
            >
              {messages.save}
            </Button>
          </>
        )}
      </Formik>
    </div>
  );
};

export default PatientPASForm;
