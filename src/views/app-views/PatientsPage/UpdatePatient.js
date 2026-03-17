import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { GENDER } from 'constants/UserConstants';
import messages from './messages';
import PatientForm from './PatientForm';
import { getSinglePatient, editPatient } from 'redux/actions/Patient';
import { makeSelectPatientSingle } from 'redux/selectors/Patient';
import {
  filterEmptyObjectFeilds,
  mapNullObjectFeildsToString,
} from 'utils/helpers';
import { message } from 'antd';
import dayjs from 'utils/dayjs';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';
import { makeSelectExistingMedicalConditions } from 'redux/selectors/Anemnesis';
import PatientPASForm from './PatientPASForm';
import { makeSelectAppointmentTypes } from 'redux/selectors/Appointment';
import { getAppointmentTypes } from 'redux/actions/Appointment';

const UpdatePatient = ({ showList, patientId }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { isPasIntegrated, PASProvider } = useSelector(
    (state) => state.auth.user || {}
  );
  const normalizedPasProvider = PASProvider?.toLowerCase();
  const isMedbridge = normalizedPasProvider === 'medbridge';

  const { patient, loading } = useSelector(makeSelectPatientSingle());
  const { items } = useSelector(makeSelectExistingMedicalConditions());
  const { appointmentTypes, appointmentTypesLoading } = useSelector(
    makeSelectAppointmentTypes()
  );

  const GENDER_CHOICES = [
    { id: GENDER.MALE, name: formatMessage(messages.male) },
    { id: GENDER.FEMALE, name: formatMessage(messages.female) },
    { id: GENDER.OTHER, name: formatMessage(messages.other) },
  ];

  useEffect(() => {
    dispatch(getSinglePatient({ id: patientId, noLimit: true }));
  }, [dispatch, patientId]);

  useEffect(() => {
    if (isMedbridge && !appointmentTypes?.length && !appointmentTypesLoading) {
      dispatch(getAppointmentTypes());
    }
  }, [
    dispatch,
    isMedbridge,
    appointmentTypes?.length,
    appointmentTypesLoading,
  ]);

  const afterUpdate = () => {
    showList();
    message.success(formatMessage(messages.patientUpdated));
  };

  const handleSubmit = (values, setErrors, enableRedirect) => {
    dispatch(
      editPatient({
        id: patientId,
        data: filterEmptyObjectFeilds(values),
        afterUpdate,
        enableRedirect,
        setErrors,
      })
    );
  };

  const initialState = patient
    ? {
      ...mapNullObjectFeildsToString(patient),
      date_of_birth: patient.date_of_birth,
      education: patient?.education?.id,
      ethnicity: patient?.ethnicity?.id,
      material_status: patient?.material_status?.id,
      employment: patient?.employment?.id,
      medicalConditions: items.map((condition) => condition.id),
      phone_number: patient?.phone_number.substr(
        patient?.phone_number?.length - 10,
        patient?.phone_number?.length
      ),
      country_code: patient?.phone_number.substr(
        0,
        patient?.phone_number?.length - 10
      ),
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
      appointment_type: patient?.appointment_type || '',
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
      country: '',
      material_status: '',
      number_of_dependants: '',
      employment: '',
      education: '',
      insurance: '',
      medicalConditions: [],
      pas_provider: normalizedPasProvider,
      available_location_ids: [],
    };

  const renderUpdatePatientForm = () => {
    if (isPasIntegrated) {
      initialState.date_of_birth = '5/11/1992'
      return (
        <PatientPASForm
          id={patientId}
          title={formatMessage(messages.newPASPatient)}
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
          title={formatMessage(messages.editPatient)}
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
