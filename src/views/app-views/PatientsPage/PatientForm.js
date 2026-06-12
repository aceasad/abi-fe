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
import { makeSelectPatientDetails } from 'redux/selectors/Patient';
import { patientSchema } from 'utils/validations';
import { MAX } from 'constants/ClinicConstants';
import { filterNumberInput, joinPhoneNumberWithCountryCode } from 'utils/helpers';
import PatientFormExistingConditions from './PatientFormExistingConditions';
import PatientFormPreviousOperationss from './PatientFormPreviousOperations';
import {
  deleteOperationTypeFromOrganization,
  resetExistingMedicalConditions,
  resetPreviousOperations,
} from 'redux/actions/Anamnesis';
import { BeforeRouteContext } from 'utils/context';
import { getPatientDetailsNewPatientForm } from 'redux/actions/Patient';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';
import dayjs from 'utils/dayjs';
import { COUNTRY_CODES } from 'constants/CountryCodesConstants';
import utils from 'utils';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const PatientForm = ({
  title,
  showList,
  handleSubmit,
  genderChoices,
  initialState,
  loading,
  id,
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

  const { education, employment, material_status, ethnicities } = useSelector(
    makeSelectPatientDetails()
  );

  const afterDelete = () => {
    message.success("Operation type successfully deleted");
  };

  const handleSubmitWrapper = (values, { setErrors }) => {
    const parsedValues = {
      ...values,
      date_of_birth: dayjs(values.date_of_birth, 'DD/MM/YYYY').format(
        DATE_FORMAT_DD_MM_YYYY
      ),
      phone_number: joinPhoneNumberWithCountryCode(
        values.country_code,
        values.phone_number
      ),
    };
    handleSubmit(parsedValues, setErrors, enableRedirect);
  };

  const deleteOperationType = ({ item, action }) => {
    Modal.confirm({
      title: interpolate("Are you sure you want to delete {name} operation type? All patients operations bound with {name} would be deleted with this action.", {
        name: item.operation_type,
      }),
      okText: "Confirm",
      okType: 'danger',
      cancelText: "Cancel",
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
    formRef.current.dirty ? setDiscardModalVisible(true) : enableRedirect();
  };

  useEffect(() => {
    if (discardModalVisible)
      Modal.confirm({
        title: "Changes not saved",
        content: "If you leave this page all changes will be discarded.",
        okText: "Discard changes",
        okType: 'danger',
        cancelText: "Cancel",
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

  return (
    <div style={{ paddingTop: isMobile ? 0 : '24px' }}>
      <Formik
        enableReinitialize
        initialValues={{
          ...initialState,
          // country_code: '44',
          operations: {
            addedOperations: [],
            deletedOperations: [],
            changedOperations: [],
          },
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
                        {"Personal details"}
                      </Title>
                    </Col>
                  )}

                  <Col xs={24} lg={18}>
                    {isMobile && (
                      <Title type="secondary" level={3} className="mb-3">
                        {"Personal details"}
                      </Title>
                    )}
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 8}
                        component={FormField}
                        label={"First name"}
                        name="first_name"
                        errorTexts={{
                          label: "First name",
                          maxValue: MAX,
                        }}
                        required
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 8}
                        component={FormField}
                        label={"Last name"}
                        name="last_name"
                        errorTexts={{
                          label: "Last name",
                          maxValue: MAX,
                        }}
                        required
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 8}
                        maxDate={new Date()}
                        component={FormDatePicker}
                        disablePastDates
                        label={"Date of birth"}
                        name="date_of_birth"
                        required
                      />
                    </Row>
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 8}
                        component={FormSelect}
                        name="gender"
                        options={genderChoices}
                        optionField="name"
                        defaultOption={values.gender}
                        label={"Gender"}
                        required
                      />

                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 8}
                        component={FormField}
                        label={"Height"}
                        name="height"
                        type={'number'}
                        onKeyDown={filterNumberInput}
                        min={0}
                        suffix="CMs"
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 8}
                        component={FormField}
                        label={"Weight"}
                        name="weight"
                        type={'number'}
                        onKeyDown={filterNumberInput}
                        min={0}
                        suffix="KGs"
                      />
                    </Row>
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 8}
                        component={FormSelect}
                        name="ethnicity"
                        options={ethnicities}
                        optionField="name"
                        defaultOption={values.ethnicity}
                        label={"Ethnicity"}
                      />
                    </Row>
                  </Col>
                </Row>

                <Row gutter={isMobile ? 12 : 16}>
                  {!isMobile && (
                    <Col xs={24} lg={6}>
                      <Title type="secondary" level={2} className="mt-4">
                        {"Address"}
                      </Title>
                    </Col>
                  )}

                  <Col xs={24} lg={18}>
                    {isMobile && (
                      <Title type="secondary" level={3} className="mb-3 mt-4">
                        {"Address"}
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
                        label={"Country code"}
                        showSearch
                        filterOption={(input, option) =>
                          `${option?.value ?? ''} ${option?.children ?? ''}`
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        errorTexts={{
                          label: "Country code",
                          matchesLabel: "Country code must be in valid format",
                          maxValue: MAX,
                        }}
                        required
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={"Phone number"}
                        name="phone_number"
                        errorTexts={{
                          label: "Phone number",
                          matchesLabel: "Phone must be in valid format",
                          maxValue: MAX,
                        }}
                        placeholder="e.g. (212) 555-1234"
                        required
                      />
                    </Row>
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={"Email"}
                        name="email"
                        required
                      />
                    </Row>
                  </Col>
                </Row>

                <Row gutter={isMobile ? 12 : 16}>
                  {!isMobile && (
                    <Col xs={24} lg={6}>
                      <Title type="secondary" level={2} className="mt-4">
                        {"Address details"}
                      </Title>
                    </Col>
                  )}

                  <Col xs={24} lg={18}>
                    {isMobile && (
                      <Title type="secondary" level={3} className="mb-3 mt-4">
                        {"Address details"}
                      </Title>
                    )}
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={"Street name"}
                        name="street_name"
                        errorTexts={{
                          label: "Street name",
                          maxValue: 128,
                        }}
                        required
                        autoComplete="new-address"
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={"Apartment/House"}
                        name="street_number"
                        errorTexts={{
                          label: "Apartment/House",
                          maxValue: 8,
                        }}
                        autoComplete="new-address"
                      />
                    </Row>
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={"Area"}
                        name="area_of_living"
                        errorTexts={{
                          label: "Area",
                          maxValue: 128,
                        }}
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={"City"}
                        name="city"
                        errorTexts={{
                          label: "City",
                          maxValue: 64,
                        }}
                        required
                      />
                    </Row>
                    <Row gutter={isMobile ? 12 : 16}>
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={"Postcode"}
                        name="post_code"
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
                        name="country"
                        errorTexts={{
                          label: "Country",
                          maxValue: 64,
                        }}
                      />
                    </Row>
                  </Col>
                </Row>

                <Row gutter={isMobile ? 12 : 16}>
                  {!isMobile && (
                    <Col xs={24} lg={6}>
                      <Title type="secondary" level={2} className="mt-4">
                        {"Other details"}
                      </Title>
                    </Col>
                  )}

                  <Col xs={24} lg={18}>
                    {isMobile && (
                      <Title type="secondary" level={3} className="mb-3 mt-4">
                        {"Other details"}
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
                        label={"Marital status"}
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormField}
                        label={"Number of dependants"}
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
                        label={"Employment status"}
                      />
                      <ColumnField
                        span={isMobile && !isTablet ? 24 : 12}
                        component={FormSelect}
                        name="education"
                        options={education}
                        optionField="name"
                        defaultOption={values.education}
                        label={"Employment status"}
                      />
                    </Row>
                    <Row gutter={isMobile ? 12 : 16}>
                      <Col xs={24} sm={isMobile && !isTablet ? 24 : 12}>
                        <Field
                          component={FormField}
                          label={"Insurance"}
                          name="insurance"
                          errorTexts={{
                            label: "Insurance",
                            maxValue: MAX,
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
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
              {"Save"}
            </Button>
          </>
        )}
      </Formik>
    </div>
  );
};

export default PatientForm;
