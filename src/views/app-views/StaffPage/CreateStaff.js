import React from 'react';
import StaffForm from './StaffForm';
import messages from './messages';
import { prepareFormData } from 'utils/helpers';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { createStaff } from 'redux/actions/Staff';
import { GENDER } from 'constants/UserConstants';
import dayjs from 'utils/dayjs';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';

const CreateStaff = ({ showList }) => {
  const dispatch = useDispatch();

  const afterCreate = () => {
    message.success(messages.staffCreated);
    showList();
  };

  const handleSubmit = (values) => {
    const parsedValues = {
      ...values,
      date_of_birth: dayjs(
        dayjs(values.date_of_birth).format('DD-MM-YYYY')
      ).format(DATE_FORMAT_DD_MM_YYYY),
    };

    const preparedData = prepareFormData(parsedValues);
    dispatch(createStaff({ data: preparedData, afterCreate }));
  };

  const GENDER_CHOICES = [
    { id: GENDER.MALE, name: messages.male },
    { id: GENDER.FEMALE, name: messages.female },
  ];

  return (
    <StaffForm
      showList={showList}
      handleSubmit={handleSubmit}
      genderChoices={GENDER_CHOICES}
      label={messages.newStaff}
      initialState={{
        first_name: '',
        last_name: '',
        date_of_birth: dayjs(new Date()).format(DATE_FORMAT_DD_MMM_YYYY),
        ethnicity: '',
        seniority: '',
        phone_number: '',
        specialization: '',
        gender: GENDER_CHOICES[0].id,
      }}
    />
  );
};

export default CreateStaff;
