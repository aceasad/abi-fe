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
    defaultMessage: 'Appointment type',
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
    id: `${scope}.text.no_appointments_for_date`,
    defaultMessage: 'No appointments for selected date',
  },
  appointmentDetails: {
    id: `${scope}.text.appointment_details`,
    defaultMessage: 'Appointment details',
  },
  endAppointment: {
    id: `${scope}.text.end_appointment`,
    defaultMessage: 'End appointment',
  },
  cancelAppointment: {
    id: `${scope}.text.cancel_appointment`,
    defaultMessage: 'Cancel appointment',
  },
  updateCommunicationStatus: {
    id: `${scope}.text.update_communication_status`,
    defaultMessage: 'Communication status',
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
  location: {
    id: `${scope}.text.location`,
    defaultMessage: 'Location',
  },
  appointmentPrice: {
    id: `${scope}.text.appointment_price`,
    defaultMessage: 'Appointment price',
  },
  missingReason: {
    id: `${scope}.text.missing_reason`,
    defaultMessage: 'Why did the patient miss the appointment?',
  },
  missingReasonDetails: {
    id: `${scope}.text.missing_reason_details`,
    defaultMessage: 'Missing details',
  },
  cancellationReason: {
    id: `${scope}.text.cancellation_reason`,
    defaultMessage: 'Why did the patient cancel the appointment?',
  },
  cancellationReasonDetails: {
    id: `${scope}.text.cancellation_reason_details`,
    defaultMessage: 'Cancellation details',
  },
  communicationStatus: {
    id: `${scope}.text.communication_status`,
    defaultMessage:
      'Please set the communication status using the dropdown below',
  },
  communicationStatusDetails: {
    id: `${scope}.text.communication_status_details`,
    defaultMessage: 'Communication details',
  },
  details: {
    id: `${scope}.text.details`,
    defaultMessage: 'Details',
  },
  appointmentStatus: {
    id: `${scope}.form.label.status`,
    defaultMessage: 'Appointment status',
  },
  deleteAppointment: {
    id: `${scope}.text.delete_appointment`,
    defaultMessage: 'Delete appointment?',
  },
  cancel: {
    id: `${globalScope}.text.cancel`,
    defaultMessage: 'Cancel',
  },
  update: {
    id: `${globalScope}.text.update`,
    defaultMessage: 'Update',
  },
  confirm: {
    id: `${globalScope}.text.confirm`,
    defaultMessage: 'Confirm',
  },
  deleteMessage: {
    id: `${scope}.text.delete_message`,
    defaultMessage: 'Are you sure you want to delete this appointment?',
  },
  appointmentDeleted: {
    id: `${scope}.text.appointment_deleted`,
    defaultMessage: 'Appointment deleted',
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
    defaultMessage: 'Appointment ended',
  },
  cancelSuccess: {
    id: `${scope}.text.cancellation_success`,
    defaultMessage: 'Appointment cancelled',
  },
  communicationStatusUpdateSuccess: {
    id: `${scope}.text.communication_status_update_success`,
    defaultMessage: 'Appointment communication status updated',
  },
});
