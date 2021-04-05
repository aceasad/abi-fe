import { defineMessages } from 'react-intl';

export const scope = 'patients_page';
export const commonScope = 'global';
export const detailScope = 'patient_details';
export const staffScope = 'staff_page';

export default defineMessages({
  patientsTitle: {
    id: `${scope}.header.title`,
    defaultMessage: 'Patients',
  },
  search: {
    id: `${commonScope}.text.search`,
    defaultMessage: 'Search',
  },
  newPatient: {
    id: `${scope}.button.new`,
    defaultMessage: 'New Patient',
  },
  firstName: {
    id: `${scope}.text.first_name`,
    defaultMessage: 'First Name',
  },
  lastName: {
    id: `${scope}.text.last_name`,
    defaultMessage: 'Last Name',
  },
  phoneNumber: {
    id: `${scope}.text.phone_number`,
    defaultMessage: 'Phone Number',
  },
  lastAppointment: {
    id: `${scope}.text.last_appointment`,
    defaultMessage: 'Last Appointment',
  },
  patientDetails: {
    id: `${scope}.option.details`,
    defaultMessage: 'Patient Details',
  },
  patientDelete: {
    id: `${scope}.option.delete`,
    defaultMessage: 'Delete Patient',
  },
  delete: {
    id: `${commonScope}.text.delete`,
    defaultMessage: 'Delete',
  },
  cancel: {
    id: `${commonScope}.text.cancel`,
    defaultMessage: 'Cancel',
  },
  save: {
    id: `${commonScope}.text.save`,
    defaultMessage: 'Save',
  },
  deleteTitle: {
    id: `${scope}.text.delete_patient`,
    defaultMessage: 'Delete Patient',
  },
  deleteDescription: {
    id: `${scope}.text.delete_description`,
    defaultMessage: 'Are you sure you want to delete {label}?',
  },
  patientDeleted: {
    id: `${scope}.text.delete_success`,
    defaultMessage: 'Patient Deleted',
  },
  editPatient: {
    id: `${scope}.text.edit_patient`,
    defaultMessage: 'Edit patient',
  },
  personalTitle: {
    id: `${detailScope}.side.title.personal`,
    defaultMessage: 'Edit patient',
  },
  dateOfBirth: {
    id: `${detailScope}.side.form.date_of_birth`,
    defaultMessage: 'Date of birth',
  },
  sex: {
    id: `${detailScope}.side.form.sex`,
    defaultMessage: 'Sex',
  },
  height: {
    id: `${detailScope}.side.form.height`,
    defaultMessage: 'Height',
  },
  weight: {
    id: `${detailScope}.side.form.weight`,
    defaultMessage: 'Weight',
  },
  ethnicity: {
    id: `${detailScope}.side.form.ethnicity`,
    defaultMessage: 'Ethnicity',
  },
  contact: {
    id: `${detailScope}.side.title.contact`,
    defaultMessage: 'Contact',
  },
  areaOfLiving: {
    id: `${detailScope}.side.form.area_of_living`,
    defaultMessage: 'Area of living',
  },
  otherInfo: {
    id: `${detailScope}.side.title.other`,
    defaultMessage: 'Other Details',
  },
  materialStatus: {
    id: `${detailScope}.side.form.marital_status`,
    defaultMessage: 'Material Status',
  },
  employmentStatus: {
    id: `${detailScope}.side.form.employment_status`,
    defaultMessage: 'Employment Status',
  },
  education: {
    id: `${detailScope}.side.form.educational_background`,
    defaultMessage: 'Employment Status',
  },
  insurance: {
    id: `${detailScope}.side.form.insurance`,
    defaultMessage: 'Insurance',
  },
  numberOfDependants: {
    id: `${detailScope}.side.form.number_of_dependants`,
    defaultMessage: 'Number of Dependants',
  },
  phoneNumberFormat: {
    id: `${detailScope}.error.phone_format`,
    defaultMessage: 'Phone must be in valid format',
  },
  male: {
    id: `${staffScope}.text.male`,
    defaultMessage: 'Male',
  },
  female: {
    id: `${staffScope}.text.female`,
    defaultMessage: 'Female',
  },
  patientCreated: {
    id: `${detailScope}.text.patient_created`,
    defaultMessage: 'Patient Created',
  },
  patientUpdated: {
    id: `${detailScope}.text.patient_updated`,
    defaultMessage: 'Patient Updated',
  },
});
