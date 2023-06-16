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
import moment from 'moment';
import { DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';
import { makeSelectExistingMedicalConditions } from 'redux/selectors/Anemnesis';
import PatientPASForm from './PatientPASForm';

const UpdatePatient = ({ showList, patientId }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { isPasIntegrated } = useSelector(state => state.auth.user);

  const { patient, loading } = useSelector(makeSelectPatientSingle());
  const { items } = useSelector(makeSelectExistingMedicalConditions());

  const GENDER_CHOICES = [
    { id: GENDER.MALE, name: formatMessage(messages.male) },
    { id: GENDER.FEMALE, name: formatMessage(messages.female) },
    { id: GENDER.OTHER, name: formatMessage(messages.other) },
  ];

  useEffect(() => {
    dispatch(getSinglePatient({ id: patientId, noLimit: true }));
  }, [dispatch, patientId]);

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
        date_of_birth: moment(patient.date_of_birth).format(
          DATE_FORMAT_DD_MMM_YYYY
        ),
        education: patient?.education?.id,
        ethnicity: patient?.ethnicity?.id,
        material_status: patient?.material_status?.id,
        employment: patient?.employment?.id,
        medicalConditions: items.map((condition) => condition.id),
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
      };

  const renderUpdatePatientForm = () =>{
    if (isPasIntegrated) {
      return(        
      <PatientPASForm
        id={patientId}
        title={formatMessage(messages.newPASPatient)}
        showList={showList}
        handleSubmit={handleSubmit}
        loading={loading}
        initialState={initialState}
        genderChoices={GENDER_CHOICES}
      />)
    }
    else{
      return(
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
