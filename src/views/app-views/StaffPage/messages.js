import { defineMessages } from 'react-intl';

export const scope = 'staff_page';
export const commonScope = 'global';

export default defineMessages({
  seeAppointments: {
    id: `${scope}.text.see_appointments`,
    defaultMessage: 'See appointments',
  },
  staff: {
    id: `${scope}.text.staff`,
    defaultMessage: 'Staff',
  },
  addNewStaff: {
    id: `${scope}.text.add_new_staff`,
    defaultMessage: 'Add new staff',
  },
  delete: {
    id: `${scope}.text.delete`,
    defaultMessage: 'Delete',
  },
  edit: {
    id: `${scope}.text.edit`,
    defaultMessage: 'Edit',
  },
  newStaff: {
    id: `${scope}.text.new_staff`,
    defaultMessage: 'New staff',
  },
  submit: {
    id: `${commonScope}.text.save`,
    defaultMessage: 'Save',
  },
  cancel: {
    id: `${commonScope}.text.cancel`,
    defaultMessage: 'Cancel',
  },
  firstName: {
    id: `${scope}.text.first_name`,
    defaultMessage: 'First name',
  },
  lastName: {
    id: `${scope}.text.last_name`,
    defaultMessage: 'Last name',
  },
  dateOfBirth: {
    id: `${scope}.text.date_of_birth`,
    defaultMessage: 'Date of birth',
  },
  personalDetails: {
    id: `${scope}.text.personal_details`,
    defaultMessage: 'Personal details',
  },
  selectOption: {
    id: `${scope}.text.select_option`,
    defaultMessage: 'Select option',
  },
  ethnicity: {
    id: `${scope}.text.ethnicity`,
    defaultMessage: 'Ethnicity',
  },
  specialization: {
    id: `${scope}.text.specialization`,
    defaultMessage: 'Specialization',
  },
  seniority: {
    id: `${scope}.text.seniority`,
    defaultMessage: 'Seniority',
  },
  male: {
    id: `${scope}.text.male`,
    defaultMessage: 'Male',
  },
  female: {
    id: `${scope}.text.female`,
    defaultMessage: 'Female',
  },
  gender: {
    id: `${scope}.text.gender`,
    defaultMessage: 'Gender',
  },
  staffCreated: {
    id: `${scope}.text.staff_created`,
    defaultMessage: 'Staff created',
  },
  staffUpdated: {
    id: `${scope}.text.staff_updated`,
    defaultMessage: 'Staff updated',
  },
  updateStaff: {
    id: `${scope}.text.update_staff`,
    defaultMessage: 'Update staff',
  },
  deleteTitle: {
    id: `${scope}.text.delete_title`,
    defaultMessage: 'Delete staff?',
  },
  deleteDescription: {
    id: `${scope}.text.delete_description`,
    defaultMessage: 'Are you sure you want to delete {label}?',
  },
  deletedSuccess: {
    id: `${scope}.text.deleted_success`,
    defaultMessage: 'Staff deleted',
  },
  seeAppointmentsTitle: {
    id: `${scope}.see_appointments.title`,
    defaultMessage: "{staffName}'s appointments",
  },
});
