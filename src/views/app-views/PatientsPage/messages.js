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
  formConfirmationButton: {
    id: `${commonScope}.text.confirm`,
    defaultMessage: 'Confirm',
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
  emailAlreadyTaken: {
    id: `${detailScope}.error.email_already_exists`,
    defaultMessage: 'Email is already taken',
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
    defaultMessage: 'Maritial Status',
  },
  employmentStatus: {
    id: `${detailScope}.side.form.employment_status`,
    defaultMessage: 'Employment Status',
  },
  education: {
    id: `${detailScope}.side.form.educational_background`,
    defaultMessage: 'Employment Status',
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
  other: {
    id: `${staffScope}.text.other`,
    defaultMessage: 'Other',
  },
  staffPastAppointments: {
    id: `${staffScope}.past_appointments.table.title`,
    defaultMessage: 'Past Appointments',
  },
  patientCreated: {
    id: `${detailScope}.text.patient_created`,
    defaultMessage: 'Patient Created',
  },
  patientUpdated: {
    id: `${detailScope}.text.patient_updated`,
    defaultMessage: 'Patient Updated',
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
    defaultMessage: 'No Show Probability',
  },
  columnTitleWhitelisted: {
    id: `${patientOverviewScope}.table.column_title.whitelisted`,
    defaultMessage: 'Whitelisted',
  },
  columnTitleUpdateStatus: {
    id: `${patientOverviewScope}.table.column_title.update_status`,
    defaultMessage: 'Update Status',
  },
  columnTitleReachOutToPatient: {
    id: `${patientOverviewScope}.table.column_title.reach_out_to_patient`,
    defaultMessage: 'Reach out to patient',
  },
  columnTitleAppointment: {
    id: `${patientOverviewScope}.table.column_title.appointment`,
    defaultMessage: 'Appointment',
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
    defaultMessage: 'Scheduled Appointments',
  },
  cardTitleAppointmentHistory: {
    id: `${patientOverviewScope}.card_title.appointment_history`,
    defaultMessage: 'Appointment History',
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
    defaultMessage: 'New Appointment',
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
    defaultMessage: 'Add New',
  },
  newConditionCreated: {
    id: `${scope}.text.success.new_condition_created`,
    defaultMessage: 'Condition Created',
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
    defaultMessage: 'Discard Changes',
  },
});
