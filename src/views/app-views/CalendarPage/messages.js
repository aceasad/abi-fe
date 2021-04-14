import { defineMessages } from 'react-intl';
export const scope = 'appointments_page';
export const globalScope = 'global';

export default defineMessages({
  noAppointments: {
    id: `${scope}.text.no_appointemnts_for_date`,
    defaultMessage: 'No appointments for selected date',
  },
  appointmentDetails: {
    id: `${scope}.text.appointment_details`,
    defaultMessage: 'Appointment Details',
  },
  endAppointment: {
    id: `${scope}.text.end_appointemnt`,
    defaultMessage: 'End Appointemnt',
  },
  patient: {
    id: `${scope}.text.patient`,
    defaultMessage: 'Patient',
  },
  doctor: {
    id: `${scope}.text.doctor`,
    defaultMessage: 'Doctor',
  },
  type: {
    id: `${scope}.text.type`,
    defaultMessage: 'Type',
  },
  status: {
    id: `${scope}.text.status`,
    defaultMessage: 'Status',
  },
  date: {
    id: `${scope}.text.date`,
    defaultMessage: 'Date',
  },
  time: {
    id: `${scope}.text.time`,
    defaultMessage: 'Time',
  },
  appointmentPrice: {
    id: `${scope}.text.appointment_price`,
    defaultMessage: 'Appointment Price',
  },
  missingReason: {
    id: `${scope}.text.missing_reason`,
    defaultMessage: 'Why did the patient miss the appointment?',
  },
  details: {
    id: `${scope}.text.details`,
    defaultMessage: 'Details',
  },
  deleteAppointment: {
    id: `${scope}.text.delete_appointemnt`,
    defaultMessage: 'Delete Appointment?',
  },
  cancel: {
    id: `${globalScope}.text.cancel`,
    defaultMessage: 'Cancel',
  },
  confirm: {
    id: `${globalScope}.text.confirm`,
    defaultMessage: 'Confirm',
  },
  deleteMessage: {
    id: `${scope}.text.delete_message`,
    defaultMessage: 'Are you sure you want to delete this appointment?',
  },
  appointemntDeleted: {
    id: `${scope}.text.appointemnt_deleted`,
    defaultMessage: 'Appointemnt deleted',
  },
});
