import { defineMessages } from 'react-intl';

export const scope = 'patients_page';
export const commonScope = 'global';
export const detailScope = 'patient_details';
export const staffScope = 'staff_page';
export const patientOverviewScope = 'patient_overview';

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
    defaultMessage: 'New patient',
  },
  notonwhatsappPatient: {
    id: `${scope}.button.notonwhatsappPatient`,
    defaultMessage: 'Unsuccessful Invites',
  },
  newBulkPatientUpload: {
    id: `${scope}.button.upload`,
    defaultMessage: 'Upload CSV',
  },
  newPASPatient: {
    id: `${scope}.button.new`,
    defaultMessage: 'New PAS patient',
  },
  patientIdent: {
    id: `${scope}.text.patient_ident`,
    defaultMessage: 'Patient NHS Number',
  },
  patientIdentFormat: {
    id: `${scope}.error.patient_ident_format`,
    defaultMessage: 'Patient Identification Number must be 7 or 10 digits',
  },
  caseId: {
    id: `${scope}.text.case_id`,
    defaultMessage: 'Case ID',
  },
  homeLocation: {
    id: `${scope}.text.home_location`,
    defaultMessage: 'Location ID',
  },
  availableLocations: {
    id: `${scope}.text.available_location_ids`,
    defaultMessage: 'Available locations',
  },
  firstName: {
    id: `${scope}.text.first_name`,
    defaultMessage: 'First name',
  },
  lastName: {
    id: `${scope}.text.last_name`,
    defaultMessage: 'Last name',
  },
  phoneNumber: {
    id: `${scope}.text.phone_number`,
    defaultMessage: 'Phone number',
  },
  countryCode: {
    id: `${scope}.text.country_code`,
    defaultMessage: 'Country code',
  },
  lastAppointment: {
    id: `${scope}.text.last_appointment`,
    defaultMessage: 'Last appointment',
  },
  patientDetails: {
    id: `${scope}.option.details`,
    defaultMessage: 'Patient details',
  },
  patientDelete: {
    id: `${scope}.option.delete`,
    defaultMessage: 'Delete patient',
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
  formConfirmationButton: {
    id: `${commonScope}.text.confirm`,
    defaultMessage: 'Confirm',
  },
  deleteTitle: {
    id: `${scope}.text.delete_patient`,
    defaultMessage: 'Delete patient',
  },
  deleteDescription: {
    id: `${scope}.text.delete_description`,
    defaultMessage: 'Are you sure you want to delete {label}?',
  },
  patientDeleted: {
    id: `${scope}.text.delete_success`,
    defaultMessage: 'Patient deleted',
  },
  editPatient: {
    id: `${scope}.text.edit_patient`,
    defaultMessage: 'Edit patient',
  },
  personalTitle: {
    id: `${detailScope}.side.title.personal`,
    defaultMessage: 'Edit patient',
  },
  emailAlreadyTaken: {
    id: `${detailScope}.error.email_already_exists`,
    defaultMessage: 'Email is already taken',
  },
  nhsNumberIncorrect: {
    id: `${detailScope}.error.incorrect_external_identification_number`,
    defaultMessage: 'NHS number is incorrect!',
  },
  phoneNumberAlreadyExists: {
    id: `${detailScope}.error.phone_number`,
    defaultMessage: 'Phone number is already added by another clinic!',
  },
  dateOfBirth: {
    id: `${detailScope}.side.form.date_of_birth`,
    defaultMessage: 'Date of birth',
  },
  sex: {
    id: `${detailScope}.side.form.sex`,
    defaultMessage: 'Gender',
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
  personalDetails: {
    id: `${detailScope}.side.title.personal_details`,
    defaultMessage: 'Personal details',
  },
  contactDetails: {
    id: `${detailScope}.side.title.contact_details`,
    defaultMessage: 'Address',
  },
  addressDetails: {
    id: `${detailScope}.side.title.address_details`,
    defaultMessage: 'Address details',
  },
  otherDetails: {
    id: `${detailScope}.side.title.other_details`,
    defaultMessage: 'Other details',
  },
  streetNumber: {
    id: `${detailScope}.side.form.street_number`,
    defaultMessage: 'Apartment/House',
  },
  streetName: {
    id: `${detailScope}.side.form.street_name`,
    defaultMessage: 'Street name',
  },
  areaOfLiving: {
    id: `${detailScope}.side.form.area_of_living`,
    defaultMessage: 'Area',
  },
  city: {
    id: `${detailScope}.side.form.city`,
    defaultMessage: 'City',
  },
  postCode: {
    id: `${detailScope}.side.form.post_code`,
    defaultMessage: 'Postcode',
  },
  country: {
    id: `${detailScope}.side.form.country`,
    defaultMessage: 'Country',
  },
  materialStatus: {
    id: `${detailScope}.side.form.marital_status`,
    defaultMessage: 'Marital status',
  },
  employmentStatus: {
    id: `${detailScope}.side.form.employment_status`,
    defaultMessage: 'Employment status',
  },
  education: {
    id: `${detailScope}.side.form.educational_background`,
    defaultMessage: 'Employment status',
  },
  email: {
    id: `${detailScope}.side.form.email`,
    defaultMessage: 'Email',
  },
  insurance: {
    id: `${detailScope}.side.form.insurance`,
    defaultMessage: 'Insurance',
  },
  numberOfDependants: {
    id: `${detailScope}.side.form.number_of_dependants`,
    defaultMessage: 'Number of dependants',
  },
  countryCodeFormat: {
    id: `${detailScope}.error.country_code_format`,
    defaultMessage: 'Country code must be in valid format',
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
  other: {
    id: `${staffScope}.text.other`,
    defaultMessage: 'Other',
  },
  staffPastAppointments: {
    id: `${staffScope}.past_appointments.table.title`,
    defaultMessage: 'Past appointments',
  },
  patientCreated: {
    id: `${detailScope}.text.patient_created`,
    defaultMessage: 'Patient created',
  },
  patientUpdated: {
    id: `${detailScope}.text.patient_updated`,
    defaultMessage: 'Patient updated',
  },
  backToPatients: {
    id: `${patientOverviewScope}.back_to_patients`,
    defaultMessage: 'Back to patietnts',
  },
  overviewTittle: {
    id: `${patientOverviewScope}.title`,
    defaultMessage: 'Patient overview',
  },
  overviewButtonMessages: {
    id: `${patientOverviewScope}.button.messages`,
    defaultMessage: 'Messages',
  },
  columnTitleDate: {
    id: `${patientOverviewScope}.table.column_title.date`,
    defaultMessage: 'Date',
  },
  columnTitleTime: {
    id: `${patientOverviewScope}.table.column_title.time`,
    defaultMessage: 'Time',
  },
  columnTitleDoctor: {
    id: `${patientOverviewScope}.table.column_title.doctor`,
    defaultMessage: 'Doctor',
  },
  columnTitlePatient: {
    id: `${patientOverviewScope}.table.column_title.patient`,
    defaultMessage: 'Patient',
  },
  columnTitleType: {
    id: `${patientOverviewScope}.table.column_title.type`,
    defaultMessage: 'Type',
  },
  columnTitlePrediction: {
    id: `${patientOverviewScope}.table.column_title.prediction`,
    defaultMessage: 'Prediction',
  },
  columnTitleNoShowScore: {
    id: `${patientOverviewScope}.table.column_title.no_show_score`,
    defaultMessage: 'No show probability',
  },
  columnTitleWhitelisted: {
    id: `${patientOverviewScope}.table.column_title.whitelisted`,
    defaultMessage: 'Whitelisted',
  },
  columnTitleUpdateStatus: {
    id: `${patientOverviewScope}.table.column_title.update_status`,
    defaultMessage: 'Update status',
  },
  columnTitleReachOutToPatient: {
    id: `${patientOverviewScope}.table.column_title.reach_out_to_patient`,
    defaultMessage: 'Reach out to patient',
  },
  columnTitleAppointment: {
    id: `${patientOverviewScope}.table.column_title.appointment`,
    defaultMessage: 'Staff Member',
  },
  columnTitleCommunicationStatus: {
    id: `${patientOverviewScope}.table.column_title.communication_status`,
    defaultMessage: 'Communication',
  },
  columnTitleStatus: {
    id: `${patientOverviewScope}.table.column_title.status`,
    defaultMessage: 'Status',
  },
  columnTitleCondition: {
    id: `${patientOverviewScope}.table.column_title.condition`,
    defaultMessage: 'Condition',
  },
  columnTitleCategory: {
    id: `${patientOverviewScope}.table.column_title.category`,
    defaultMessage: 'Category',
  },
  columnTitleOperation: {
    id: `${patientOverviewScope}.table.column_title.operation`,
    defaultMessage: 'Operation',
  },
  columnTitleTimeOfSurgery: {
    id: `${patientOverviewScope}.table.column_title.time_of_surgery`,
    defaultMessage: 'Time of surgery',
  },
  cardTitleScheduledAppointments: {
    id: `${patientOverviewScope}.card_title.scheduled_appointments`,
    defaultMessage: 'Scheduled appointments',
  },
  cardTitleAppointmentHistory: {
    id: `${patientOverviewScope}.card_title.appointment_history`,
    defaultMessage: 'Appointment history',
  },
  cardTitleExistingConditions: {
    id: `${patientOverviewScope}.card_title.existing_conditions`,
    defaultMessage: 'Existing medical conditions',
  },
  cardTitlePreviousOperatins: {
    id: `${patientOverviewScope}.card_title.previous_operations`,
    defaultMessage: 'Previous operations',
  },
  buttonNewAppointment: {
    id: `${patientOverviewScope}.button.new_appointment`,
    defaultMessage: 'New appointment',
  },
  messages: {
    id: `${patientOverviewScope}.messages`,
    defaultMessage: 'Messages',
  },
  backToOverview: {
    id: `${patientOverviewScope}.back_to_overview`,
    defaultMessage: 'Back to patient overview',
  },
  addNew: {
    id: `${commonScope}.text.add_new`,
    defaultMessage: 'Add new',
  },
  newConditionCreated: {
    id: `${scope}.text.success.new_condition_created`,
    defaultMessage: 'Condition created',
  },
  conditionAlreadyExists: {
    id: `${patientOverviewScope}.text.error.condition_already_exists`,
    defaultMessage: 'Condition with this name already exists',
  },
  deleteMedicalCondition: {
    id: `${patientOverviewScope}.text.modal.confirm_delete_message`,
    defaultMessage:
      'Are you sure you want to delete "{name}" medical condition? All patients bound with "{name}" medical condition will be afected by this action.',
  },
  medicalConditionDeleted: {
    id: `${patientOverviewScope}.text.modal.condition_deleted`,
    defaultMessage: 'Medical condition successfully deleted',
  },
  pressEnterToAdd: {
    id: `${patientOverviewScope}.text.press_enter_to_add`,
    defaultMessage: 'Press enter to add',
  },
  operationTypeAdded: {
    id: `${patientOverviewScope}.text.operation_type_added`,
    defaultMessage: 'Operation type successfully created',
  },
  deleteOperationType: {
    id: `${patientOverviewScope}.text.delete_operation_type`,
    defaultMessage:
      'Are you sure you want to delete {name} operation type? All patients operations bound with {name} would be deleted with this action.',
  },
  operationTypeDeleted: {
    id: `${patientOverviewScope}.text.operation_type_deleted`,
    defaultMessage: 'Operation type successfully deleted',
  },
  discardText: {
    id: `${patientOverviewScope}.text.discard_text`,
    defaultMessage: 'If you leave this page all changes will be discarded.',
  },
  discardTitle: {
    id: `${patientOverviewScope}.text.discard_title`,
    defaultMessage: 'Changes not saved',
  },
  discardButton: {
    id: `${patientOverviewScope}.text.discard_button`,
    defaultMessage: 'Discard changes',
  },
});
