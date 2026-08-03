import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GENDER } from 'constants/UserConstants';
import PatientForm from './PatientForm';
import { getSinglePatient, editPatient } from 'redux/actions/Patient';
import { makeSelectPatientSingle } from 'redux/selectors/Patient';
import {
  filterEmptyObjectFeilds,
  mapNullObjectFeildsToString,
  splitPhoneNumberByCountryCode,
} from 'utils/helpers';
import { message } from 'antd';
import dayjs from 'utils/dayjs';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';
import { makeSelectExistingMedicalConditions } from 'redux/selectors/Anemnesis';
import PatientPASForm from './PatientPASForm';
import { makeSelectAppointmentTypes } from 'redux/selectors/Appointment';
import { getAppointmentTypes } from 'redux/actions/Appointment';
import { formatDocumentLanguageLabel } from 'views/app-views/DocumentsPage/documentTypeHelpers';

const UpdatePatient = ({ showList, patientId }) => {
  const dispatch = useDispatch();
  const { isPasIntegrated, PASProvider } = useSelector(
    (state) => state.auth.user || {}
  );
  const normalizedPasProvider = PASProvider?.toLowerCase();
  const isMedbridge = normalizedPasProvider === 'medbridge';
  const isInternal = normalizedPasProvider === 'internal';
  const isLocationAware = isMedbridge || isInternal;

  const { patient, loading } = useSelector(makeSelectPatientSingle());
  const { items } = useSelector(makeSelectExistingMedicalConditions());
  const { appointmentTypes, appointmentTypesLoading } = useSelector(
    makeSelectAppointmentTypes()
  );

  const GENDER_CHOICES = [
    { id: GENDER.MALE, name: "Male" },
    { id: GENDER.FEMALE, name: "Female" },
    { id: GENDER.OTHER, name: "Other" },
  ];

  useEffect(() => {
    dispatch(getSinglePatient({ id: patientId, noLimit: true }));
  }, [dispatch, patientId]);

  useEffect(() => {
    if (isLocationAware && !appointmentTypes?.length && !appointmentTypesLoading) {
      dispatch(getAppointmentTypes());
    }
  }, [
    dispatch,
    isLocationAware,
    appointmentTypes?.length,
    appointmentTypesLoading,
  ]);

  const afterUpdate = () => {
    showList();
    message.success("Patient updated");
  };

  const handleSubmit = (values, setErrors, enableRedirect, setFieldTouched) => {
    const { language, timezone, ...patientValues } = values;
    const data = filterEmptyObjectFeilds(patientValues);
    console.log('[UpdatePatient] dispatching editPatient — id:', patientId, 'data:', data);
    dispatch(
      editPatient({
        id: patientId,
        data,
        afterUpdate,
        enableRedirect,
        setErrors,
        setFieldTouched,
      })
    );
  };

  const initialState = useMemo(
    () =>
      patient
        ? {
          ...mapNullObjectFeildsToString(patient),
          date_of_birth: (() => {
            if (!patient.date_of_birth) return '';
            const parsed = dayjs(
              patient.date_of_birth,
              ['YYYY-MM-DD', 'DD/MM/YYYY', DATE_FORMAT_DD_MM_YYYY],
              true
            );
            return parsed.isValid()
              ? parsed.format(DATE_FORMAT_DD_MM_YYYY)
              : '';
          })(),
          education: patient?.education?.id,
          ethnicity: patient?.ethnicity?.id,
          material_status: patient?.material_status?.id,
          employment: patient?.employment?.id,
          medicalConditions: items.map((condition) => condition.id),
          ...splitPhoneNumberByCountryCode(patient?.phone_number),
          home_location: patient?.home_location?.location_id
            ? String(patient.home_location.location_id)
            : '',
          available_location_ids: Array.isArray(patient?.available_location_ids)
            ? patient.available_location_ids
              .map((location) => location?.location_id)
              .filter(Boolean)
              .map((id) => String(id))
            : [],
          pas_provider: normalizedPasProvider,
          appointment_type:
            patient?.appointment_type?.id ?? patient?.appointment_type ?? '',
          language: formatDocumentLanguageLabel(patient?.language),
        }
        : {
          first_name: '',
          last_name: '',
          date_of_birth: '',
          gender: '',
          height: '',
          weight: '',
          ethnicity: '',
          phone_number: '',
          email: '',
          street_number: '',
          street_name: '',
          area_of_living: '',
          city: '',
          post_code: '',
          state: '',
          country: '',
          material_status: '',
          number_of_dependants: '',
          employment: '',
          education: '',
          insurance: '',
          medicalConditions: [],
          pas_provider: normalizedPasProvider,
          available_location_ids: [],
        },
    [patient, items, normalizedPasProvider]
  );

  const renderUpdatePatientForm = () => {
    if (isPasIntegrated || isInternal) {
      return (
        <PatientPASForm
          id={patientId}
          title={"New PAS patient"}
          showList={showList}
          handleSubmit={handleSubmit}
          loading={loading}
          pasProvider={normalizedPasProvider}
          initialState={initialState}
          genderChoices={GENDER_CHOICES}
        />)
    }
    else {
      return (
        <PatientForm
          title={"Edit patient"}
          showList={showList}
          handleSubmit={handleSubmit}
          loading={loading}
          initialState={initialState}
          genderChoices={GENDER_CHOICES}
          id={patientId}
        />
      )
    }
  }
  return renderUpdatePatientForm();
};

export default UpdatePatient;
