import { defineMessages } from 'react-intl';

export const settings = 'settings_page';
export const changePassword = 'change_password_page';
export const editClinic = 'edit_clinic_page';
export const industryAverage = 'industry_average_page';

export default defineMessages({
  settingsTitle: {
    id: `${settings}.title`,
    defaultMessage: 'Settings',
  },
  oldPasswordInputLabel: {
    id: `${changePassword}.input_label.oldPassword`,
    defaultMessage: 'Old Password',
  },
  newPasswordInputLabel: {
    id: `${changePassword}.input_label.newPassword`,
    defaultMessage: 'New Password',
  },
  newPasswordConfirmInputLabel: {
    id: `${changePassword}.input_label.newPasswordConfirm`,
    defaultMessage: 'Confirm New Password',
  },
  minimumCharacters: {
    id: `${changePassword}.note.min_characters`,
    defaultMessage: 'At least {min} characters',
  },
  upperAndLowerMixture: {
    id: `${changePassword}.note.upper_and_lower_mix`,
    defaultMessage: 'A mixture of both uppercase and lowercase letters',
  },
  lettersAndNumberMixture: {
    id: `${changePassword}.note.char_and_letter_mix`,
    defaultMessage: 'A mixture of letters and numbers',
  },
  specialCharacters: {
    id: `${changePassword}.note.special_characters`,
    defaultMessage:
      'Inclusion of at least one special character, e.g., ! @ # ? ]',
  },
  specialCharactersExcluded: {
    id: `${changePassword}.note.special_characters_excluded`,
    defaultMessage:
      'Note: do not use < or > in your password, as both can cause problems in Web browsers',
  },
  changePasswordBtn: {
    id: `${changePassword}.text.change_password_btn_title`,
    defaultMessage: 'Change password',
  },
  passwordChanged: {
    id: `${changePassword}.text.password_changed`,
    defaultMessage: 'Password has been changed!',
  },
  changePasswordError: {
    id: `${changePassword}.error.password_change_error`,
    defaultMessage: 'Failed to change password',
  },
  changePasswordMenuLabel: {
    id: `${changePassword}.text.change_password_menu_label`,
    defaultMessage: 'Change Password',
  },
  passwordValidFormat: {
    id: `${changePassword}.validation.valid_password`,
    defaultMessage: 'Password must be in valid format',
  },
  invalidOldPassword: {
    id: `${changePassword}.error.invalid_old_password`,
    defaultMessage: 'Invalid old password',
  },
  editClinicMenuLabel: {
    id: `${editClinic}.text.edit_clinic_menu_label`,
    defaultMessage: 'Edit Clinic',
  },
  update_success: {
    id: `${editClinic}.text.update_success`,
    defaultMessage: 'Successfull!',
  },
  update_error: {
    id: `${editClinic}.text.update_error`,
    defaultMessage: 'Something went wrong',
  },
  industryAverageMenuLabel: {
    id: `${industryAverage}.title`,
    defaultMessage: 'Industry Average',
  },
});
