import { message } from 'antd';
import UserSettingsFormModal from 'containers/Forms/UserSettings/UserSettingsFormModal';
import React from 'react';
import { useDispatch } from 'react-redux';
import { createUser } from 'redux/actions/User';
import { userSchema } from 'utils/validations';

function CreateUser({ closeModal }) {
  const dispatch = useDispatch();

  const afterCreate = () => {
    message.success("User Created");
    closeModal();
  };

  const handleSubmit = (values, { setErrors }) => {
    dispatch(createUser({ data: values, afterCreate, setErrors }));
  };

  return (
    <UserSettingsFormModal
      title={"Create a new user by entering their name, email address and password."}
      closeModal={closeModal}
      handleSubmit={handleSubmit}
      validationSchema={userSchema}
      initialValues={{
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        receive_email_notifications: true,
      }}
    />
  );
}

export default CreateUser;
