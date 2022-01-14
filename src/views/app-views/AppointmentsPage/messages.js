import { defineMessages } from 'react-intl';

export const scope = 'appointments_page';

export default defineMessages({
  createAppointmentTitle: {
    id: `${scope}.form_create.title`,
    defaultMessage: 'New Appointment',
  },
  updateAppointmentTitle: {
    id: `${scope}.form_update.title`,
    defaultMessage: 'Edit Appointment',
  },
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
  appointmentStatus: {
    id: `${scope}.form.label.status`,
    defaultMessage: 'Appointment Status',
  },
  appointmentCommunicationStatus: {
    id: `${scope}.form.label.communication_status`,
    defaultMessage: 'Appointment Communication Status',
  },
  appointmentCommunicationStatusDetails: {
    id: `${scope}.form.label.communication_status_details`,
    defaultMessage: 'Appointment Communication Status Details',
  },
  appointmentMissingReason: {
    id: `${scope}.form.label.missing_reason`,
    defaultMessage: 'Appointment Missing Reason',
  },
  appointmentMissingReasonDetails: {
    id: `${scope}.form.label.missing_reason_details`,
    defaultMessage: 'Appointment Missing Reason Details',
  },
  appointmentCancellationReason: {
    id: `${scope}.form.label.cancellation_reason`,
    defaultMessage: 'Appointment Cancellation Reason',
  },
  appointmentCancellationReasonDetails: {
    id: `${scope}.form.label.cancellation_reason_details`,
    defaultMessage: 'Appointment Cancellation Reason Details',
  },
  saveButton: {
    id: `${scope}.form.button.save`,
    defaultMessage: 'Save',
  },
  cancelButton: {
    id: `${scope}.form.button.cancel`,
    defaultMessage: 'Cancel',
  },
  newAppointmentCreated: {
    id: `${scope}.message.created`,
    defaultMessage: 'New Appointment Created',
  },
  somethingWentWrong: {
    id: `${scope}.message.something_went_wrong`,
    defaultMessage: 'Something went wrong',
  },
  appointmentUpdated: {
    id: `${scope}.message.updated`,
    defaultMessage: 'Appointment Updated',
  },
  searchPlaceholder: {
    id: `${scope}.form.placeholder.search`,
    defaultMessage: 'Search...',
  },
  appointmentPrediction: {
    id: `${scope}.text.appointment_prediction`,
    defaultMessage: 'Prediction',
  },
  appointmentPredictionMissed: {
    id: `${scope}.message.appointment_prediction_missed`,
    defaultMessage: 'Likely to be missed',
  },
  appointmentPredictionAttended: {
    id: `${scope}.message.appointment_prediction_attended`,
    defaultMessage: 'Likely to be attended',
  },
});
