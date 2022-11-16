import React from 'react';
import { useIntl } from 'react-intl';
import StaffForm from './StaffForm';
import messages from './messages';
import { prepareFormData } from 'utils/helpers';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { createStaff } from 'redux/actions/Staff';
import { GENDER } from 'constants/UserConstants';
import moment from 'moment';
import { DATE_FORMAT_DD_MMM_YYYY } from 'constants/DateConstant';

const CreateStaff = ({ showList }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const afterCreate = () => {
    message.success(formatMessage(messages.staffCreated));
    showList();
  };

  const handleSubmit = (values) => {
    const parsedValues = {
      ...values,
      date_of_birth: moment(
        moment(values.date_of_birth).format('DD-MM-YYYY')
      ).format(DATE_FORMAT_DD_MMM_YYYY),
    };

    const preparedData = prepareFormData(parsedValues);
    dispatch(createStaff({ data: preparedData, afterCreate }));
  };

  const GENDER_CHOICES = [
    { id: GENDER.MALE, name: formatMessage(messages.male) },
    { id: GENDER.FEMALE, name: formatMessage(messages.female) },
  ];

  return (
    <StaffForm
      showList={showList}
      handleSubmit={handleSubmit}
      genderChoices={GENDER_CHOICES}
      label={formatMessage(messages.newStaff)}
      initialState={{
        first_name: '',
        last_name: '',
        date_of_birth: moment(new Date()).format(DATE_FORMAT_DD_MMM_YYYY),
        ethnicity: '',
        seniority: '',
        specialization: '',
        gender: GENDER_CHOICES[0].id,
      }}
    />
  );
};

export default CreateStaff;
