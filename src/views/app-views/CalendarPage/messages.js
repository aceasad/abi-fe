import { defineMessages } from 'react-intl';

export const scope = 'appointments_page';
export const globalScope = 'global';

export default defineMessages({
  patientLabel: {
    id: `${scope}.form.label.patient`,
    defaultMessage: 'Patient',
  },
  doctorLabel: {
    id: `${scope}.form.label.doctor`,
    defaultMessage: 'Doctor',
  },
  dateLabel: {
    id: `${scope}.form.label.date`,
    defaultMessage: 'Date',
  },
  timeLabel: {
    id: `${scope}.form.label.time`,
    defaultMessage: 'Time',
  },
  appointmentTypeLabel: {
    id: `${scope}.form.label.appointment_type`,
    defaultMessage: 'Appointment Type',
  },
  priceLabel: {
    id: `${scope}.form.label.price`,
    defaultMessage: 'Price',
  },
  createButton: {
    id: `${scope}.form.button.create`,
    defaultMessage: 'Create',
  },
  editButton: {
    id: `${scope}.form.button.edit`,
    defaultMessage: 'Edit',
  },
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
  appointmentStatus: {
    id: `${scope}.form.label.status`,
    defaultMessage: 'Appointment Status',
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
  yes: {
    id: `${globalScope}.text.yes`,
    defaultMessage: 'Yes',
  },
  no: {
    id: `${globalScope}.text.no`,
    defaultMessage: 'No',
  },
  attendedQuestion: {
    id: `${scope}.text.attend_question`,
    defaultMessage: 'Did patient attend the appointment?',
  },
  reason: {
    id: `${scope}.text.reason`,
    defaultMessage: 'Reason',
  },
  endSuccess: {
    id: `${scope}.text.end_success`,
    defaultMessage: 'Appointment Ended',
  },
});
