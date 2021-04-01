import { defineMessages } from 'react-intl';
import { MAX, MAX_GOOGLE_LINK } from '../../../constants/ClinicConstants';
export const scope = 'clinic_page';

export default defineMessages({
  clinic_name: {
    id: `${scope}.input_label.clinic_name`,
    defaultMessage: 'Clinic Name',
  },
  phone_number: {
    id: `${scope}.input_label.phone_number`,
    defaultMessage: 'Phone number',
  },
  address: {
    id: `${scope}.input_label.address`,
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
  error_input_label_address: {
    id: `${scope}.error.address`,
    defaultMessage: 'Address',
  },
  error_input_label_google_maps_link: {
    id: `${scope}.error.google_maps_link`,
    defaultMessage: 'Google maps link is url',
  },
  create: {
    id: `${scope}.text.create`,
    defaultMessage: 'Save',
  },
  max: {
    id: `${scope}.text.max`,
    defaultMessage: MAX,
  },
  max_google_link: {
    id: `${scope}.text.max_google_link`,
    defaultMessage: MAX_GOOGLE_LINK,
  },
  logout: {
    id: `${scope}.text.logout`,
    defaultMessage: 'Logout',
  },
});
