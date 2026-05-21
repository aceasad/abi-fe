import { message } from 'antd';
import UserSettingsFormModal from 'containers/Forms/UserSettings/UserSettingsFormModal';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleUser, updateUser } from 'redux/actions/User';
import { makeSelectSingleUser } from 'redux/selectors/Users';
import messages from './messages';
import { updateUserSchema } from 'utils/validations';
import { filterEmptyObjectFeilds } from 'utils/helpers';

function UpdateUser({ closeModal, userId }) {
  const dispatch = useDispatch();

  const { loading, user } = useSelector(makeSelectSingleUser());

  useEffect(() => {
    dispatch(getSingleUser(userId));
  }, []);

  const afterUpdate = () => {
    message.success(messages.userUpdated);
    closeModal();
  };

  const handleSubmit = (values, { setErrors }) => {
    dispatch(
      updateUser({
        data: filterEmptyObjectFeilds(values),
        afterUpdate,
        setErrors,
      })
    );
  };

  return (
    <UserSettingsFormModal
      title={messages.editUser}
      closeModal={closeModal}
      initialValues={{ ...user, password: '', confirmPassword: '' }}
      handleSubmit={handleSubmit}
      loadginData={loading}
      validationSchema={updateUserSchema}
    />
  );
}

export default UpdateUser;
