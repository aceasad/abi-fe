import { message } from 'antd';
import UserSettingsFormModal from 'containers/Forms/UserSettings/UserSettingsFormModal';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { createUser } from 'redux/actions/User';
import messages from './messages';
import { userSchema } from 'utils/validations';

function CreateUser({ closeModal }) {
  const dispatch = useDispatch();

  const afterCreate = () => {
    message.success(formatMessage(messages.userCreated));
    closeModal();
  };

  const handleSubmit = (values, { setErrors }) => {
    dispatch(createUser({ data: values, afterCreate, setErrors }));
  };

  const { formatMessage } = useIntl();

  return (
    <UserSettingsFormModal
      title={formatMessage(messages.createUser)}
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
