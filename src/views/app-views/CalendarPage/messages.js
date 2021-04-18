import { defineMessages } from 'react-intl';

export const scope = 'appointments_page';

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
});
