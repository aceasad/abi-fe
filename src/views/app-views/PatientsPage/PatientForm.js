import React, { useContext, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Formik } from 'formik';
import { Button, Card, Col, message, Row, Typography, Modal } from 'antd';
import Form from 'antd/lib/form/Form';

import PatientHeader from './PatientHeader';
import FormField from 'components/custom-components/Form/FormField';
import FormDatePicker from 'components/custom-components/Form/FormDatePicker';
import FormSelect from 'components/custom-components/Form/FormSelect';
import ColumnField from 'components/custom-components/Form/ColumnField';
import messages from './messages';
import { makeSelectPatientDetails } from 'redux/selectors/Patient';
import { patientSchema } from 'utils/validations';
import { MAX } from 'constants/ClinicConstants';
import { filterNumberInput } from 'utils/helpers';
import PatientFormExistingConditions from './PatientFormExistingConditions';
import PatientFormPreviousOperationss from './PatientFormPreviousOperations';
import {
  deleteOperationTypeFromOrganization,
  resetExistingMedicalConditions,
  resetPreviousOperations,
} from 'redux/actions/Anamnesis';
import { BeforeRouteContext } from 'utils/context';
import { getPatientDetailsNewPatientForm } from 'redux/actions/Patient';
import { DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';
import moment from 'moment';
import { COUNTRY_CODES } from 'constants/CountryCodesConstants';

const { Title } = Typography;

const PatientForm = ({
  title,
  showList,
  handleSubmit,
  genderChoices,
  initialState,
  loading,
  id,
}) => {
  const { formatMessage } = useIntl();
  const headerRef = useRef(null);
  const [isSaveVisible, setIsSaveVisible] = useState(false);
  const dispatch = useDispatch();
  const { setContext, ...rest } = useContext(BeforeRouteContext);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);
  const formRef = useRef();

  const { education, employment, material_status, ethnicities } = useSelector(
    makeSelectPatientDetails()
  );

  const afterDelete = () => {
    message.success(formatMessage(messages.operationTypeDeleted));
  };

  const handleSubmitWrapper = (values, { setErrors }) => {
    const parsedValues = {
      ...values,
      date_of_birth: moment(values.date_of_birth, 'DD/MM/YYYY').format(
        DATE_FORMAT_DD_MMM_YYYY
      ),
      phone_number: values.country_code + values.phone_number,
    };

    handleSubmit(parsedValues, setErrors, enableRedirect);
  };

  const deleteOperationType = ({ item, action }) => {
    Modal.confirm({
      title: formatMessage(messages.deleteOperationType, {
        name: item.operation_type,
      }),
      okText: formatMessage(messages.formConfirmationButton),
      okType: 'danger',
      cancelText: formatMessage(messages.cancel),
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
        title: formatMessage(messages.discardTitle),
        content: formatMessage(messages.discardText),
        okText: formatMessage(messages.discardButton),
        okType: 'danger',
        cancelText: formatMessage(messages.cancel),
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
    <Formik
      enableReinitialize
      initialValues={{
        ...initialState,
        country_code: '44',
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
              primaryDisabled={!isValid || !dirty || loading}
            />
          </div>
          <Card className="p-4">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={6}>
                  <Title type="secondary" level={2} className="mt-4">
                    {formatMessage(messages.personalDetails)}
                  </Title>
                </Col>

                <Col span={18}>
                  <Row gutter={16}>
                    <ColumnField
                      span={8}
                      component={FormField}
                      label={formatMessage(messages.firstName)}
                      name="first_name"
                      errorTexts={{
                        label: formatMessage(messages.firstName),
                        maxValue: MAX,
                      }}
                      required
                    />
                    <ColumnField
                      span={8}
                      component={FormField}
                      label={formatMessage(messages.lastName)}
                      name="last_name"
                      errorTexts={{
                        label: formatMessage(messages.lastName),
                        maxValue: MAX,
                      }}
                      required
                    />
                    <ColumnField
                      span={8}
                      maxDate={new Date()}
                      component={FormDatePicker}
                      disablePastDates
                      label={formatMessage(messages.dateOfBirth)}
                      name="date_of_birth"
                      required
                    />
                  </Row>
                  <Row gutter={16}>
                    <ColumnField
                      span={8}
                      component={FormSelect}
                      name="gender"
                      options={genderChoices}
                      optionField="name"
                      defaultOption={values.gender}
                      label={formatMessage(messages.sex)}
                      required
                    />

                    <ColumnField
                      span={8}
                      component={FormField}
                      label={formatMessage(messages.height)}
                      name="height"
                      type={'number'}
                      onKeyDown={filterNumberInput}
                      min={0}
                      suffix="CMs"
                    />
                    <ColumnField
                      span={8}
                      component={FormField}
                      label={formatMessage(messages.weight)}
                      name="weight"
                      type={'number'}
                      onKeyDown={filterNumberInput}
                      min={0}
                      suffix="KGs"
                    />
                  </Row>
                  <Row gutter={16}>
                    <ColumnField
                      span={8}
                      component={FormSelect}
                      name="ethnicity"
                      options={ethnicities}
                      optionField="name"
                      defaultOption={values.ethnicity}
                      label={formatMessage(messages.ethnicity)}
                    />
                  </Row>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={6}>
                  <Title type="secondary" level={2} className="mt-4">
                    {formatMessage(messages.contactDetails)}
                  </Title>
                </Col>

                <Col span={18}>
                  <Row gutter={16}>
                    <ColumnField
                      span={8}
                      component={FormSelect}
                      name="country_code"
                      options={COUNTRY_CODES}
                      optionField="name"
                      defaultOption={values.country_code}
                      label={formatMessage(messages.countryCode)}
                      errorTexts={{
                        label: formatMessage(messages.countryCode),
                        matchesLabel: formatMessage(messages.countryCodeFormat),
                        maxValue: MAX,
                      }}
                      required
                    />
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.phoneNumber)}
                      name="phone_number"
                      errorTexts={{
                        label: formatMessage(messages.phoneNumber),
                        matchesLabel: formatMessage(messages.phoneNumberFormat),
                        maxValue: MAX,
                      }}
                      required
                    />
                  </Row>
                  <Row gutter={16}>
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.email)}
                      name="email"
                      required
                    />
                  </Row>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={6}>
                  <Title type="secondary" level={2} className="mt-4">
                    {formatMessage(messages.addressDetails)}
                  </Title>
                </Col>

                <Col span={18}>
                  <Row gutter={16}>
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.streetName)}
                      name="street_name"
                      errorTexts={{
                        label: formatMessage(messages.streetName),
                        maxValue: 128,
                      }}
                      required
                      autoComplete="new-address"
                    />
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.streetNumber)}
                      name="street_number"
                      errorTexts={{
                        label: formatMessage(messages.streetNumber),
                        maxValue: 8,
                      }}
                      autoComplete="new-address"
                    />
                  </Row>
                  <Row gutter={16}>
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.areaOfLiving)}
                      name="area_of_living"
                      errorTexts={{
                        label: formatMessage(messages.areaOfLiving),
                        maxValue: 128,
                      }}
                    />
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.city)}
                      name="city"
                      errorTexts={{
                        label: formatMessage(messages.city),
                        maxValue: 64,
                      }}
                      required
                    />
                  </Row>
                  <Row gutter={16}>
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.postCode)}
                      name="post_code"
                      errorTexts={{
                        label: formatMessage(messages.postCode),
                        maxValue: 16,
                      }}
                      required
                    />
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.country)}
                      name="country"
                      errorTexts={{
                        label: formatMessage(messages.country),
                        maxValue: 64,
                      }}
                    />
                  </Row>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={6}>
                  <Title type="secondary" level={2} className="mt-4">
                    {formatMessage(messages.otherDetails)}
                  </Title>
                </Col>

                <Col span={18}>
                  <Row gutter={16}>
                    <ColumnField
                      span={12}
                      component={FormSelect}
                      name="material_status"
                      options={material_status}
                      optionField="name"
                      defaultOption={values.material_status}
                      label={formatMessage(messages.materialStatus)}
                    />
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.numberOfDependants)}
                      name="number_of_dependants"
                      onKeyDown={filterNumberInput}
                      type={'number'}
                      min={0}
                    />
                  </Row>
                  <Row gutter={16}>
                    <ColumnField
                      span={12}
                      component={FormSelect}
                      name="employment"
                      options={employment}
                      optionField="name"
                      defaultOption={values.employment}
                      label={formatMessage(messages.employmentStatus)}
                    />
                    <ColumnField
                      span={12}
                      component={FormSelect}
                      name="education"
                      options={education}
                      optionField="name"
                      defaultOption={values.education}
                      label={formatMessage(messages.education)}
                    />
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Field
                        component={FormField}
                        label={formatMessage(messages.insurance)}
                        name="insurance"
                        errorTexts={{
                          label: formatMessage(messages.insurance),
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
            className={`floating-button ${!isValid || !dirty || loading || !isSaveVisible ? '' : 'active'
              }`}
          >
            {formatMessage(messages.save)}
          </Button>
        </>
      )}
    </Formik>
  );
};

export default PatientForm;
