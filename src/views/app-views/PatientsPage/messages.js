import { defineMessages } from 'react-intl';

export const scope = 'patients_page';
export const commonScope = 'global';

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
});
