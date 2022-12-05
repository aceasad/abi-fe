import { defineMessages } from 'react-intl';
import { MAX, MAX_GOOGLE_LINK_LENGTH } from 'constants/ClinicConstants';
export const scope = 'clinic_page';

export default defineMessages({
  clinic_name: {
    id: `${scope}.input_label.clinic_name`,
    defaultMessage: 'Clinic name',
  },
  phone_number: {
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
    defaultMessage: 'area',
  },
  city: {
    id: `${scope}.input_label.city`,
    defaultMessage: 'City',
  },
  country: {
    id: `${scope}.input_label.country`,
    defaultMessage: 'Address',
  },
  google_maps_link: {
    id: `${scope}.input_label.google_maps_link`,
    defaultMessage: 'Google maps link',
  },
  parking_availability: {
    id: `${scope}.input_label.parking_availability`,
    defaultMessage: 'Parking availability',
  },
  parking_free: {
    id: `${scope}.input_label.parking_free`,
    defaultMessage: 'Free',
  },
  parking_no: {
    id: `${scope}.input_label.parking_no`,
    defaultMessage: 'No parking',
  },
  parking_available: {
    id: `${scope}.input_label.parking_available`,
    defaultMessage: 'Parking available',
  },
  working_hours: {
    id: `${scope}.label.working_hours`,
    defaultMessage: 'Working hours',
  },
  parking_size: {
    id: `${scope}.input_label.parkign_size`,
    defaultMessage: 'Parking size',
  },
  error_input_label_name: {
    id: `${scope}.error.name`,
    defaultMessage: 'Name',
  },
  error_input_label_phone_number: {
    id: `${scope}.error.phone_number`,
    defaultMessage: 'Phone number',
  },
  error_input_label_street_number: {
    id: `${scope}.error.street_number`,
    defaultMessage: 'Street number',
  },
  error_input_label_street_name: {
    id: `${scope}.error.street_name`,
    defaultMessage: 'Street name',
  },
  error_input_label_area: {
    id: `${scope}.error.area`,
    defaultMessage: 'Area',
  },
  error_input_label_city: {
    id: `${scope}.error.city`,
    defaultMessage: 'City',
  },
  error_input_label_post_code: {
    id: `${scope}.error.post_code`,
    defaultMessage: 'Post Code',
  },
  error_input_label_country: {
    id: `${scope}.error.country`,
    defaultMessage: 'Country',
  },
  error_input_label_google_maps_link: {
    id: `${scope}.error.google_maps_link`,
    defaultMessage: 'Google maps link is url',
  },
  create: {
    id: `${scope}.text.create`,
    defaultMessage: 'Save',
  },
  update_button: {
    id: `${scope}.text.update_button`,
    defaultMessage: 'Update',
  },
  max: {
    id: `${scope}.text.max`,
    defaultMessage: MAX,
  },
  max_google_link: {
    id: `${scope}.text.max_google_link`,
    defaultMessage: MAX_GOOGLE_LINK_LENGTH,
  },
  logout: {
    id: `${scope}.text.logout`,
    defaultMessage: 'Logout',
  },
});
