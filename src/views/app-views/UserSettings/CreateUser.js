import { message } from 'antd';
import UserSettingsFormModal from 'containers/Forms/UserSettings/UserSettingsFormModal';
import React from 'react';
import { useDispatch } from 'react-redux';
import { createUser } from 'redux/actions/User';
import messages from './messages';
import { userSchema } from 'utils/validations';

function CreateUser({ closeModal }) {
  const dispatch = useDispatch();

  const afterCreate = () => {
    message.success(messages.userCreated);
    closeModal();
  };

  const handleSubmit = (values, { setErrors }) => {
    dispatch(createUser({ data: values, afterCreate, setErrors }));
  };

  return (
    <UserSettingsFormModal
      title={messages.createUser}
      closeModal={closeModal}
      handleSubmit={handleSubmit}
      validationSchema={userSchema}
      initialValues={{
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
      }}
    />
  );
}

export default CreateUser;
