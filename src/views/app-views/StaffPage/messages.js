import { defineMessages } from 'react-intl';

export const scope = 'staff_page';

export default defineMessages({
  seeAppointments: {
    id: `${scope}.text.see_appointments`,
    defaultMessage: 'See Appointments',
  },
  staff: {
    id: `${scope}.text.staff`,
    defaultMessage: 'Staff',
  },
  addNewStaff: {
    id: `${scope}.text.add_new_staff`,
    defaultMessage: 'Add New Staff',
  },
  delete: {
    id: `${scope}.text.delete`,
    defaultMessage: 'Delete',
  },
  edit: {
    id: `${scope}.text.edit`,
    defaultMessage: 'Edit',
  },
});
