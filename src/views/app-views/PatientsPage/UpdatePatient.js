import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { GENDER } from 'constants/UserConstants';
import messages from './messages';
import PatientForm from './PatientForm';
import { getSinglePatient, editPatient } from 'redux/actions/Patient';
import { makeSelectPatientSingle } from 'redux/selectors/Patient';
import { filterEmptyObjectFeilds } from 'utils/helpers';
import { message } from 'antd';
import moment from 'moment';
import { DATE_FORMAT_MM_DD_YYYY } from 'constants/DateConstant';

const UpdatePatient = ({ showList, patientId }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const { patient, loading } = useSelector(makeSelectPatientSingle());

  const GENDER_CHOICES = [
    { id: GENDER.MALE, name: formatMessage(messages.male) },
    { id: GENDER.FEMALE, name: formatMessage(messages.female) },
  ];

  useEffect(() => {
    dispatch(getSinglePatient(patientId));
  }, [dispatch, patientId]);

  const afterUpdate = () => {
    showList();
    message.success(formatMessage(messages.patientUpdated));
  };

  const handleSubmit = (values) => {
    dispatch(
      editPatient({
        id: patientId,
        data: filterEmptyObjectFeilds(values),
        afterUpdate,
      })
    );
  };

  return (
    <PatientForm
      title={formatMessage(messages.editPatient)}
      showList={showList}
      handleSubmit={handleSubmit}
      loading={loading}
      initialState={
        patient
          ? {
              ...patient,
              date_of_birth: moment(patient.date_of_birth).format(
                DATE_FORMAT_MM_DD_YYYY
              ),
              education: patient?.education?.id,
              ethnicity: patient?.ethnicity?.id,
              material_status: patient?.material_status?.id,
              employment: patient?.employment?.id,
            }
          : {
              first_name: '',
              last_name: '',
              date_of_birth: '',
              gender: GENDER_CHOICES[0].id,
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
            }
      }
      genderChoices={GENDER_CHOICES}
    />
  );
};

export default UpdatePatient;
