import { defineMessages } from 'react-intl';
import { MAX, MAX_GOOGLE_LINK_LENGTH } from 'constants/ClinicConstants';

export const scope = 'clinic_page';

export default defineMessages({
  clinicName: {
    id: `${scope}.input_label.clinic_name`,
    defaultMessage: 'Clinic Name',
  },
  phoneNumber: {
    id: `${scope}.input_label.phone_number`,
    defaultMessage: 'Phone number',
  },
  streetNumber: {
    id: `${scope}.input_label.street_number`,
    defaultMessage: 'Street number',
  },
  streetName: {
    id: `${scope}.input_label.street_name`,
    defaultMessage: 'Street name',
  },
  area: {
    id: `${scope}.input_label.area`,
    defaultMessage: 'Area',
  },
  city: {
    id: `${scope}.input_label.city`,
    defaultMessage: 'City',
  },
  postCode: {
    id: `${scope}.input_label.address`,
    defaultMessage: 'Postcode',
  },
  country: {
    id: `${scope}.input_label.country`,
    defaultMessage: 'Country',
  },
  googleMapsLink: {
    id: `${scope}.input_label.google_maps_link`,
    defaultMessage: 'Google maps link',
  },
  parkingAvailability: {
    id: `${scope}.input_label.parking_availability`,
    defaultMessage: 'Parking availability',
  },
  parkingFree: {
    id: `${scope}.input_label.parking_free`,
    defaultMessage: 'Free',
  },
  parkingNo: {
    id: `${scope}.input_label.parking_no`,
    defaultMessage: 'No parking',
  },
  parkingAvailable: {
    id: `${scope}.input_label.parking_available`,
    defaultMessage: 'Parking available',
  },
  workingHours: {
    id: `${scope}.label.working_hours`,
    defaultMessage: 'Working hours',
  },
  parkingSize: {
    id: `${scope}.input_label.parkign_size`,
    defaultMessage: 'Parking space',
  },
  errorInputLabelName: {
    id: `${scope}.error.name`,
    defaultMessage: 'Name',
  },
  errorInputLabelPhoneNumber: {
    id: `${scope}.error.phone_number`,
    defaultMessage: 'Phone number',
  },
  errorInputLabelStreetNumber: {
    id: `${scope}.error.street_number`,
    defaultMessage: 'Street number',
  },
  errorInputLabelStreetName: {
    id: `${scope}.error.street_name`,
    defaultMessage: 'Street name',
  },
  errorInputLabelArea: {
    id: `${scope}.error.area`,
    defaultMessage: 'Area',
  },
  errorInputLabelCity: {
    id: `${scope}.error.city`,
    defaultMessage: 'City',
  },
  errorInputLabelPostCode: {
    id: `${scope}.error.post_code`,
    defaultMessage: 'Postcode',
  },
  errorInputLabelCountry: {
    id: `${scope}.error.country`,
    defaultMessage: 'Country',
  },
  errorInputLabelGoogleMapsLink: {
    id: `${scope}.error.google_maps_link`,
    defaultMessage: 'Google maps link',
  },
  createButton: {
    id: `${scope}.text.create_button`,
    defaultMessage: 'Create',
  },
  updateButton: {
    id: `${scope}.text.update_button`,
    defaultMessage: 'Update',
  },
  updateSuccess: {
    id: `${scope}.text.update_success`,
    defaultMessage: 'Successfull!',
  },
  updateError: {
    id: `${scope}.text.update_error`,
    defaultMessage: 'Something went wrong',
  },
  max: {
    id: `${scope}.text.max`,
    defaultMessage: MAX,
  },
  maxGoogleLink: {
    id: `${scope}.text.max_google_link`,
    defaultMessage: MAX_GOOGLE_LINK_LENGTH,
  },
  logout: {
    id: `${scope}.text.logout`,
    defaultMessage: 'Logout',
  },
  phoneNumberFormat: {
    id: `${scope}.validation.invalid_phone`,
    defaultMessage: 'Phone number format is +xxxxxxxxxxxxxxx',
  },
  startOfWork: {
    id: `${scope}.text.start_of_work`,
    defaultMessage: 'Start of Work',
  },
  endOfWork: {
    id: `${scope}.text.end_of_work`,
    defaultMessage: 'End of Work',
  },
  allDayWorkingHours: {
    id: `${scope}.text.all_day_working_hours`,
    defaultMessage: 'Working hours 00-24',
  },
  removeImageButton: {
    id: `${scope}.button.remove_image`,
    defaultMessage: 'Remove Image',
  },
});
