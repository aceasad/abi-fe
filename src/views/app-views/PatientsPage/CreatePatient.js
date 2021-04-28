import { message } from 'antd';
import { GENDER } from 'constants/UserConstants';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { createPatient } from 'redux/actions/Patient';
import { filterEmptyObjectFeilds } from 'utils/helpers';
import messages from './messages';
import PatientForm from './PatientForm';
import moment from 'moment';
import { DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';
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

  const handleSubmit = (values) => {
    dispatch(
      createPatient({ data: filterEmptyObjectFeilds(values), afterCreate })
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
        date_of_birth: moment(new Date()).format(DATE_FORMAT_DD_MMM_YYYY),
        gender: '',
        height: '',
        weight: '',
        ethnicity: '',
        phone_number: '',
        area_of_living: '',
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
