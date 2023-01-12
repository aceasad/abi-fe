import { message } from 'antd';
import { GENDER } from 'constants/UserConstants';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { createPatient } from 'redux/actions/Patient';
import { filterEmptyObjectFeilds } from 'utils/helpers';
import messages from './messages';
import PatientForm from './PatientForm';
import { makeSelectPatientLoading } from 'redux/selectors/Patient';

const CreatePatient = ({ showList }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { loading } = useSelector(makeSelectPatientLoading());

  const GENDER_CHOICES = [
    { id: GENDER.MALE, name: formatMessage(messages.male) },
    { id: GENDER.FEMALE, name: formatMessage(messages.female) },
    { id: GENDER.OTHER, name: formatMessage(messages.other) },
  ];

  const afterCreate = () => {
    showList();
    message.success(formatMessage(messages.patientCreated));
  };

  const handleSubmit = (values, setErrors, enableRedirect) => {
    dispatch(
      createPatient({
        data: filterEmptyObjectFeilds(values),
        afterCreate,
        enableRedirect,
        setErrors,
      })
    );
  };

  return (
    <PatientForm
      title={formatMessage(messages.newPatient)}
      showList={showList}
      handleSubmit={handleSubmit}
      loading={loading}
      initialState={{
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
        stret_name: '',
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
      }}
      genderChoices={GENDER_CHOICES}
    />
  );
};

export default CreatePatient;
