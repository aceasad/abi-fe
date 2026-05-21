import React, { useEffect } from 'react';
import StaffForm from './StaffForm';
import messages from './messages';
import { prepareFormData } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { updateStaff, getSingleStaff } from 'redux/actions/Staff';
import { GENDER } from 'constants/UserConstants';
import dayjs from 'utils/dayjs';
import { DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';
import {
  makeSelectStaffSingle,
  makeSelectLoading,
} from 'redux/selectors/Staff';
import Loading from 'components/shared-components/Loading';

const UpdateStaff = ({ showList, staffId }) => {
  const dispatch = useDispatch();

  const singleStaff = useSelector(makeSelectStaffSingle());
  const { loading } = useSelector(makeSelectLoading());

  const afterUpdate = () => {
    message.success(messages.staffUpdated);
    showList();
  };

  const handleSubmit = (values) => {
    const preparedData = prepareFormData(values);
    if (!(values.profile_picture instanceof File))
      preparedData.delete('profile_picture');
    dispatch(updateStaff({ data: preparedData, afterUpdate }));
  };

  const GENDER_CHOICES = [
    { id: GENDER.MALE, name: messages.male },
    { id: GENDER.FEMALE, name: messages.female },
  ];

  useEffect(() => {
    dispatch(getSingleStaff(staffId));
  }, []);

  if (loading) return <Loading cover="content" />;
  const initialState = singleStaff
    ? {
      ...singleStaff,
      profile_picture: singleStaff.profile_picture?.original || '',
      phone_number: singleStaff.phone_number || '',
      date_of_birth: dayjs(singleStaff.date_of_birth).format(
        DATE_FORMAT_DD_MMM_YYYY
      ),
    }
    : {
      id: staffId,
      first_name: '',
      last_name: '',
      date_of_birth: dayjs(new Date()).format(DATE_FORMAT_DD_MMM_YYYY),
      ethnicity: '',
      seniority: '',
      phone_number: '',
      specialization: '',
      gender: GENDER_CHOICES[0].id,
    };
  return (
    <StaffForm
      showList={showList}
      handleSubmit={handleSubmit}
      genderChoices={GENDER_CHOICES}
      label={messages.updateStaff}
      initialState={initialState}
    />
  );
};

export default UpdateStaff;
