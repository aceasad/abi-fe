import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { interpolate } from 'utils/interpolate';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Formik } from 'formik';
import { Button, Card, Col, Form as AntForm, Input, message, Row, Typography, Modal, Grid, Tooltip } from 'antd';
import Form from 'antd/lib/form/Form';

import PatientHeader from './PatientHeader';
import FormField from 'components/custom-components/Form/FormField';
import FormDatePicker from 'components/custom-components/Form/FormDatePicker';
import FormSelect from 'components/custom-components/Form/FormSelect';
import ColumnField from 'components/custom-components/Form/ColumnField';
import {
  makeSelectPatientDetails,
  makeSelectPatientLocations,
} from 'redux/selectors/Patient';
import { makeSelectAppointmentTypes } from 'redux/selectors/Appointment';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { getPatientSchema } from 'utils/validations';
import { MAX, NHS_MAX, EIN_MAX } from 'constants/ClinicConstants';
import { applyPatientFormFieldError, buildPatientHomeLocationNoTimeslotsError, filterNumberInput, formatLocationLabel, getHomeLocationTimezoneValidationError, isUsCountry, joinPhoneNumberWithCountryCode, parsePatientFormApiErrors } from 'utils/helpers';
import patientService from 'services/PatientService';
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
  const [caseIdsError, setCaseIdsError] = useState('');
  const dispatch = useDispatch();
  const { setContext, ...rest } = useContext(BeforeRouteContext);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);
  const formRef = useRef();
  const initialHomeLocationRef = useRef(initialState?.home_location || '');
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isTablet = screens.includes('md') && !screens.includes('lg');
  const isMedbridge = pasProvider === 'medbridge';
  // Internal (Local PAS Broker) orgs are not isPasIntegrated, but they still need the
  // location + appointment_type booking fields that MedBridge/EMIS patients use, plus all
  // of the regular demographic/address fields a non-PAS patient would have (this form is
  // otherwise stripped down to just PAS-relevant fields).
  const isInternal = pasProvider === 'internal';
  const isLocationAware = isMedbridge || isInternal;
  const { education, employment, material_status, ethnicities } = useSelector(
    makeSelectPatientDetails()
  );
  const { locations } = useSelector(makeSelectPatientLocations());
  const { appointmentTypes, appointmentTypesLoading } = useSelector(
    makeSelectAppointmentTypes()
  );
  // Grouped face types (e.g. MSLT) need one Case ID per member appointment type instead of
  // the single `case_id` field - MedBridge issues a separate case per member type (e.g.
  // Overnight Sleep Study vs Day Studies) for the same referral. See `case_ids` rendering
  // below and PatientAppointmentTypeCaseId on the backend.
  const groupedAppointmentTypeIds = useMemo(
    () => (appointmentTypes || []).filter((type) => type.is_grouped).map((type) => type.id),
    [appointmentTypes]
  );
  const patientValidationSchema = useMemo(
    () => getPatientSchema(groupedAppointmentTypeIds),
    [groupedAppointmentTypeIds]
  );
  // Resolves whether a given appointment_type id is a grouped face type (e.g. MSLT) and, if
  // so, its member AppointmentTypes - used both for rendering the per-member Case ID inputs
  // and for validating/building the `case_ids` payload on submit.
  const getGroupInfo = (appointmentTypeId) => {
    const type = (appointmentTypes || []).find(
      (t) => String(t.id) === String(appointmentTypeId)
    );
    return {
      isGrouped: isMedbridge && Boolean(type?.is_grouped),
      memberTypes: type?.member_types || [],
    };
  };
  const clinic = useSelector(makeSelectClinic());
  const isUSA = isUsCountry(clinic?.country);
  const { isTMSEnabled: userIsTMSEnabled } = useSelector(
    (state) => state.auth.user || {}
  );
  // Prefer organization flag from clinic; fall back to /users/me auth payload.
  const isTMSEnabled = Boolean(
    clinic?.isTMSEnabled ?? userIsTMSEnabled
  );

  const isEligibleForTransport = (homeLocationId) => {
    if (!isTMSEnabled || !homeLocationId) {
      return false;
    }
    const selected = locations.find(
      (loc) => String(loc?.location_id) === String(homeLocationId)
    );
    const hasLob = Boolean(selected?.location_tms_lob_id);
    const patientGeocoded = Boolean(
      initialState?.latitude != null && initialState?.longitude != null
    );
    return hasLob && patientGeocoded;
  };

  const afterDelete = () => {
    message.success("Operation type successfully deleted");
  };

  const handleSubmitWrapper = async (values, { setErrors, setFieldTouched }) => {
    console.log('[PatientPASForm] onSubmit — validation passed, raw values:', values);
    const showFieldError = (fieldName, errorMessage) => {
      console.log('[PatientPASForm] aborting submit — field error on', fieldName, ':', errorMessage);
      applyPatientFormFieldError(fieldName, errorMessage, {
        setErrors,
        setFieldTouched,
      });
      message.error(errorMessage);
    };

    if (isLocationAware && !values.appointment_type) {
      showFieldError('appointment_type', 'Appointment type');
      return;
    }
    const { isGrouped: isGroupedAppointmentType, memberTypes: groupMemberTypes } =
      getGroupInfo(values.appointment_type);
    const providedCaseIds = new Map(
      (values.case_ids || []).map((entry) => [
        Number(entry.appointment_type_id),
        (entry.case_id || '').trim(),
      ])
    );
    if (isGroupedAppointmentType) {
      const missingMembers = groupMemberTypes.filter(
        (member) => !providedCaseIds.get(member.appointment_type_id)
      );
      if (missingMembers.length) {
        const errorMessage = `Case ID is required for ${missingMembers
          .map((member) => member.appointment_type_name)
          .join(' and ')}`;
        setCaseIdsError(errorMessage);
        showFieldError('case_ids', errorMessage);
        return;
      }
      const nonDigitMembers = groupMemberTypes.filter((member) => {
        const value = providedCaseIds.get(member.appointment_type_id);
        return value && !/^\d+$/.test(value);
      });
      if (nonDigitMembers.length) {
        const errorMessage = 'Case ID must contain digits only';
        setCaseIdsError(errorMessage);
        showFieldError('case_ids', errorMessage);
        return;
      }
    }
    setCaseIdsError('');
    const locationsById = locations.reduce((acc, location) => {
      if (location?.location_id) {
        acc[String(location.location_id)] = location;
      }
      return acc;
    }, {});
    const parsedValues = {
      ...values,
      phone_number: joinPhoneNumberWithCountryCode(
        values.country_code,
        values.phone_number
      ),
    };
    delete parsedValues.pas_provider;
    if (isGroupedAppointmentType) {
      // Only submit exactly the current group's member entries - if the staff member
      // switched appointment_type mid-edit, stale entries for a previous group shouldn't
      // linger in the payload.
      parsedValues.case_ids = groupMemberTypes.map((member) => ({
        appointment_type_id: member.appointment_type_id,
        case_id: providedCaseIds.get(member.appointment_type_id),
      }));
    } else {
      delete parsedValues.case_ids;
    }
    // Internal orgs have no external identity system, and ExternalIdentificationNumber
    // is unique=True on the backend across ALL organizations. This field is never exposed
    // in the form for Internal orgs, so we never submit it at all:
    // - On create, the backend generates a collision-checked dummy value server-side when
    //   it's left out of the payload (see local_generate_unique_external_identification_number).
    // - On edit, omitting it entirely (rather than resending whatever was spread into the
    //   form's initial values, or worse, an empty string) means the backend's update() never
    //   touches the column, so the value assigned at creation stays persistent forever and
    //   is never overwritten/blanked out on a later save.
    if (isInternal) {
      delete parsedValues.ExternalIdentificationNumber;
    }
    if (isLocationAware) {
      // ensure appointment_type is null or a primitive id
      if (!parsedValues.appointment_type) {
        parsedValues.appointment_type = null;
      }

      if (parsedValues.home_location) {
        parsedValues.home_location =
          locationsById[String(parsedValues.home_location)] || {
            location_id: parsedValues.home_location,
          };

        const timezoneError = getHomeLocationTimezoneValidationError(
          parsedValues.home_location
        );
        if (timezoneError) {
          showFieldError('home_location', timezoneError);
          return;
        }
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

    if (
      isLocationAware &&
      id &&
      parsedValues.home_location?.location_id &&
      String(parsedValues.home_location.location_id) !==
      String(initialHomeLocationRef.current || '')
    ) {
      try {
        const { data } = await patientService.validateHomeLocationTimeslots(
          id,
          parsedValues.home_location.location_id
        );
        if (!data?.has_timeslots) {
          const locationLabel = formatLocationLabel(
            locationsById[String(parsedValues.home_location.location_id)] ||
            parsedValues.home_location,
            parsedValues.home_location.location_id
          );
          const errorMessage =
            data?.message ||
            buildPatientHomeLocationNoTimeslotsError(
              locationLabel,
              data?.search_days
            );
          showFieldError('home_location', errorMessage);
          return;
        }
      } catch (error) {
        console.log('[PatientPASForm] aborting submit — timeslot validation request failed:', error);
        const formErrors = parsePatientFormApiErrors(error?.response?.data);
        if (formErrors.home_location) {
          showFieldError('home_location', formErrors.home_location);
          return;
        }
        message.error('Unable to verify timeslots for this location.');
        return;
      }
    }

    console.log('[PatientPASForm] calling parent handleSubmit with:', parsedValues);
    handleSubmit(parsedValues, setErrors, enableRedirect, setFieldTouched);
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
    formRef.current?.dirty ? setDiscardModalVisible(true) : enableRedirect();
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
    initialHomeLocationRef.current = initialState?.home_location || '';
  }, [initialState?.home_location]);

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
    if (isLocationAware) {
      dispatch(getPatientLocations());
    }
  }, [dispatch, isLocationAware]);

  useEffect(() => {
    if (isLocationAware && !appointmentTypes?.length && !appointmentTypesLoading) {
      dispatch(getAppointmentTypes());
    }
  }, [dispatch, isLocationAware, appointmentTypes?.length, appointmentTypesLoading]);

  const locationOptions = locations
    .map((location) => {
      if (!location?.location_id) return null;
      const id = String(location.location_id);
      return {
        id,
        name: formatLocationLabel(location, id),
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
        validationSchema={patientValidationSchema}
      >
        {({ values, dirty, isValid, errors, handleSubmit, setFieldValue }) => {
          const { isGrouped: isGroupedAppointmentType, memberTypes: groupMemberTypes } =
            getGroupInfo(values.appointment_type);
          const caseIdsByType = new Map(
            (values.case_ids || []).map((entry) => [
              Number(entry.appointment_type_id),
              entry.case_id || '',
            ])
          );
          const updateGroupCaseId = (appointmentTypeId, caseId) => {
            const next = groupMemberTypes.map((member) => ({
              appointment_type_id: member.appointment_type_id,
              case_id:
                member.appointment_type_id === appointmentTypeId
                  ? caseId
                  : caseIdsByType.get(member.appointment_type_id) || '',
            }));
            setFieldValue('case_ids', next);
            if (caseIdsError) {
              setCaseIdsError('');
            }
          };

          return (
          <>
            <div ref={headerRef}>
              <PatientHeader
                title={title}
                secondaryAction={() => {
                  showDiscardModal(true);
                }}
                primaryAction={() => {
                  console.log('[PatientPASForm] Save (header) clicked — dirty:', dirty, 'isValid:', isValid, 'errors:', errors, 'values:', values);
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
                      {!isInternal && (
                        <ColumnField
                          span={isMobile && !isTablet ? 24 : 8}
                          component={FormField}
                          label={isMedbridge ? "Patient Identification ID" : "Patient NHS Number"}
                          name="ExternalIdentificationNumber"
                          errorTexts={{
                            label: isMedbridge ? "Patient Identification ID" : "Patient NHS Number",
                            matchesLabel: isMedbridge
                              ? "Patient Identification ID must contain digits only"
                              : "Patient Identification Number must be 7 or 10 digits",
                            maxValue: isMedbridge ? EIN_MAX : NHS_MAX,
                          }}
                          required
                        />
                      )}
                      {isInternal && (
                        <>
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 8}
                            maxDate={new Date()}
                            component={FormDatePicker}
                            disablePastDates
                            label={"Date of birth"}
                            name="date_of_birth"
                          />
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 8}
                            component={FormSelect}
                            name="gender"
                            options={genderChoices}
                            optionField="name"
                            defaultOption={values.gender}
                            label={"Gender"}
                          />
                        </>
                      )}
                      {isLocationAware && (
                        <>
                          {isMedbridge && !isGroupedAppointmentType && (
                            <ColumnField
                              span={isMobile && !isTablet ? 24 : 8}
                              component={FormField}
                              label={"Case ID"}
                              name="case_id"
                              errorTexts={{
                                label: "Case ID",
                                matchesLabel: "Case ID must contain digits only",
                                maxValue: 20,
                              }}
                              required={isMedbridge}
                            />
                          )}
                          {isMedbridge && isGroupedAppointmentType &&
                            groupMemberTypes.map((member, index) => (
                              <Col
                                key={member.appointment_type_id}
                                span={isMobile && !isTablet ? 24 : 8}
                              >
                                <AntForm.Item
                                  label={`Case ID (${member.appointment_type_name})`}
                                  required
                                  validateStatus={caseIdsError ? 'error' : ''}
                                  help={
                                    // Only surface the shared error once, under the last
                                    // input, so it doesn't repeat under every member field.
                                    index === groupMemberTypes.length - 1
                                      ? caseIdsError
                                      : undefined
                                  }
                                >
                                  <Input
                                    value={caseIdsByType.get(member.appointment_type_id) || ''}
                                    maxLength={20}
                                    onChange={(event) =>
                                      updateGroupCaseId(
                                        member.appointment_type_id,
                                        event.target.value
                                      )
                                    }
                                  />
                                </AntForm.Item>
                              </Col>
                            ))}
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 8}
                            component={FormSelect}
                            label={"Location"}
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
                              label: "Location",
                              maxValue: 20,
                            }}
                            required={isLocationAware}
                          />
                          {isTMSEnabled && id && (
                            <Col span={isMobile && !isTablet ? 24 : 8}>
                              <AntForm.Item label="Eligible for Transport">
                                <Tooltip
                                  placement="topLeft"
                                  title="Live transport availability is checked at booking with a service type with pickup and dropoff location."
                                >
                                  <span style={{ display: 'block' }}>
                                    <Input
                                      disabled
                                      value={
                                        isEligibleForTransport(values.home_location)
                                          ? 'True'
                                          : 'False'
                                      }
                                    />
                                  </span>
                                </Tooltip>
                              </AntForm.Item>
                            </Col>
                          )}
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 8}
                            component={FormSelect}
                            label={"Appointment type"}
                            name="appointment_type"
                            options={appointmentTypeOptions}
                            optionField="name"
                            errorTexts={{
                              label: "Appointment type",
                            }}
                            required={isLocationAware}
                          />
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 8}
                            component={FormSelect}
                            label={"Available locations"}
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
                              label: "Available locations",
                              maxValue: 20,
                            }}
                          />
                          {isMedbridge && (
                            <ColumnField
                              span={isMobile && !isTablet ? 24 : 8}
                              component={FormField}
                              label={"Referral Doctor's Name"}
                              name="doctor_reference"
                              errorTexts={{
                                label: "Referral Doctor's Name",
                                maxValue: 20,
                              }}
                              required={isMedbridge}
                            />
                          )}
                        </>
                      )}
                      {id && (
                        <ColumnField
                          span={isMobile && !isTablet ? 24 : 8}
                          component={FormField}
                          label={"Detected language"}
                          name="language"
                          disabled
                        />
                      )}
                      {id && (
                        <ColumnField
                          span={isMobile && !isTablet ? 24 : 8}
                          component={FormField}
                          label={"Detected timezone"}
                          name="timezone"
                          disabled
                        />
                      )}
                      {/* <ColumnField
                      span={8}
                      maxDate={new Date()}
                      component={FormDatePicker}
                      disablePastDates
                      label={"Date of birth"}
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
                      label={"Gender"}
                      required
                    /> */}
                    </Row>
                    {/* <Row gutter={16}>


                    <ColumnField
                      span={8}
                      component={FormField}
                      label={"Height"}
                      name="height"
                      type={'number'}
                      onKeyDown={filterNumberInput}
                      min={0}
                      suffix="CMs"
                    />
                    <ColumnField
                      span={8}
                      component={FormField}
                      label={"Weight"}
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
                      label={"Ethnicity"}
                    />
                  </Row> */}
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
                          maxValue: 4,
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
                          maxValue: 10,
                        }}
                        placeholder="e.g. (212) 555-1234"
                        required
                      />
                    </Row>
                    {isInternal && (
                      <Row gutter={isMobile ? 12 : 16}>
                        <ColumnField
                          span={isMobile && !isTablet ? 24 : 12}
                          component={FormField}
                          label={"Email"}
                          name="email"
                        />
                      </Row>
                    )}
                  </Col>
                </Row>

                {isInternal && (
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
                        />
                        {isUSA && (
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 12}
                            component={FormField}
                            label={"State"}
                            name="state"
                            maxLength={2}
                            placeholder="e.g. NY"
                            errorTexts={{
                              label: "State",
                              maxValue: 2,
                            }}
                          />
                        )}
                      </Row>
                      <Row gutter={isMobile ? 12 : 16}>
                        <ColumnField
                          span={isMobile && !isTablet ? 24 : 12}
                          component={FormField}
                          label={isUSA ? "Zip Code" : "Postcode"}
                          name="post_code"
                          errorTexts={{
                            label: isUSA ? "Zip Code" : "Postcode",
                            maxValue: 16,
                          }}
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
                      {isUSA && id && (
                        <Row gutter={isMobile ? 12 : 16}>
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 12}
                            component={FormField}
                            label={"Latitude"}
                            name="latitude"
                            disabled
                          />
                          <ColumnField
                            span={isMobile && !isTablet ? 24 : 12}
                            component={FormField}
                            label={"Longitude"}
                            name="longitude"
                            disabled
                          />
                        </Row>
                      )}
                    </Col>
                  </Row>
                )}

                {isInternal && (
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
                          component={FormField}
                          label={"Height"}
                          name="height"
                          type={'number'}
                          onKeyDown={filterNumberInput}
                          min={0}
                          suffix={isUSA ? "in" : "CMs"}
                        />
                        <ColumnField
                          span={isMobile && !isTablet ? 24 : 12}
                          component={FormField}
                          label={"Weight"}
                          name="weight"
                          type={'number'}
                          onKeyDown={filterNumberInput}
                          min={0}
                          suffix={isUSA ? "lbs" : "KGs"}
                        />
                      </Row>
                      <Row gutter={isMobile ? 12 : 16}>
                        <ColumnField
                          span={isMobile && !isTablet ? 24 : 12}
                          component={FormSelect}
                          name="ethnicity"
                          options={ethnicities}
                          optionField="name"
                          defaultOption={values.ethnicity}
                          label={"Ethnicity"}
                        />
                        <ColumnField
                          span={isMobile && !isTablet ? 24 : 12}
                          component={FormSelect}
                          name="material_status"
                          options={material_status}
                          optionField="name"
                          defaultOption={values.material_status}
                          label={"Marital status"}
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
                          label={"Education"}
                        />
                      </Row>
                      <Row gutter={isMobile ? 12 : 16}>
                        <ColumnField
                          span={isMobile && !isTablet ? 24 : 12}
                          component={FormField}
                          label={"Number of dependants"}
                          name="number_of_dependants"
                          onKeyDown={filterNumberInput}
                          type={'number'}
                          min={0}
                        />
                        <ColumnField
                          span={isMobile && !isTablet ? 24 : 12}
                          component={FormField}
                          label={"Insurance"}
                          name="insurance"
                          errorTexts={{
                            label: "Insurance",
                            maxValue: MAX,
                          }}
                        />
                      </Row>
                    </Col>
                  </Row>
                )}
                {/* 
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
              </Row> */}
                {/* 
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
                console.log('[PatientPASForm] Save (floating) clicked — dirty:', dirty, 'isValid:', isValid, 'errors:', errors, 'values:', values);
                handleSubmit();
              }}
              type="primary"
              className={`floating-button ${!dirty || loading || !isSaveVisible ? '' : 'active'
                }`}
            >
              {"Save"}
            </Button>
          </>
          );
        }}
      </Formik>
    </div>
  );
};

export default PatientPASForm;
