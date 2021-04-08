import { defineMessages } from 'react-intl';

export const scope = 'user_settings';
export const passowrdScope = 'reset_password_page';

export default defineMessages({
  deleteConfirmation: {
    id: `${scope}.modal.delete.description`,
    defaultMessage: 'Are you sure you want to delete {user}?',
  },
  formConfirmationButton: {
    id: `${scope}.form.button.confirm`,
    defaultMessage: 'Confirm',
  },
  formCancelButton: {
    id: `${scope}.form.button.cancel`,
    defaultMessage: 'Cancel',
  },
  formName: {
    id: `${scope}.form.name`,
    defaultMessage: 'Name',
  },
  formEmail: {
    id: `${scope}.form.email`,
    defaultMessage: 'Email',
  },
  superadmin: {
    id: `${scope}.superadmin`,
    defaultMessage: 'superadmin',
  },
  editUser: {
    id: `${scope}.form.title.edit_user`,
    defaultMessage: 'Edit User',
  },
  deleteUser: {
    id: `${scope}.form.title.delete_user`,
    defaultMessage: 'Delete User',
  },
  createUser: {
    id: `${scope}.form.title.create_user`,
    defaultMessage:
      'Create a new user by entering their name, email address and password.',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'User Settings',
  },
  buttonNew: {
    id: `${scope}.form.button.new`,
    defaultMessage: 'New User',
  },
  formPassword: {
    id: `${scope}.form.password`,
    defaultMessage: 'Password',
  },
  formConfirmPassword: {
    id: `${scope}.form.confirm_password`,
    defaultMessage: 'Confirm Password',
  },
  passwordValidFormat: {
    id: `${passowrdScope}.matches.password`,
    defaultMessage: 'Password must be in valid format',
  },
  userCreated: {
    id: `${scope}.messages.success_created`,
    defaultMessage: 'User Created',
  },
  usernameInUse: {
    id: `${scope}.messages.error_username_in_use`,
    defaultMessage: 'User with given username already exists',
  },
  userUpdated: {
    id: `${scope}.messages.success_updated`,
    defaultMessage: 'User Updated',
  },
  userDeleted: {
    id: `${scope}.messages.success_deleted`,
    defaultMessage: 'User Deleted',
  },
});
