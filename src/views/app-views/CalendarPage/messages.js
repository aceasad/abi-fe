import { defineMessages } from 'react-intl';
export const scope = 'appointments_page';

export default defineMessages({
  noAppointments: {
    id: `${scope}.text.no_appointemnts_for_date`,
    defaultMessage: 'No appointments for selected date',
  },
});
