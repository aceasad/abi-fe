export const DOCUMENT_TYPE_OPTIONS_MEDBRIDGE = [
  { id: 'appointment_type', name: 'Appointment Type Specific' },
  { id: 'location', name: 'Clinic Location Specific' },
  { id: 'appointment_type_location', name: 'Appointment Type & Location Specific' },
];

export const DOCUMENT_TYPE_OPTIONS_DEFAULT = [
  { id: 'appointment_type', name: 'Appointment Type Specific' },
];

export const usesAppointmentType = (documentType) =>
  documentType === 'appointment_type' || documentType === 'appointment_type_location';

export const usesLocation = (documentType) =>
  documentType === 'location' || documentType === 'appointment_type_location';

export const getDocumentTypeTagColor = (documentType) => {
  if (documentType === 'location') return 'blue';
  if (documentType === 'appointment_type_location') return 'green';
  return 'purple';
};

export const formatDocumentTypeLabel = (documentType) =>
  (documentType || 'appointment_type').replace(/_/g, ' ').toUpperCase();

export const DOCUMENT_LANGUAGE_OPTIONS = [
  { id: 'en', name: 'English' },
  { id: 'es', name: 'Spanish' },
];

export const formatDocumentLanguageLabel = (language) => {
  const option = DOCUMENT_LANGUAGE_OPTIONS.find((item) => item.id === language);
  return option?.name || (language || 'en').toUpperCase();
};
