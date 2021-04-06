import { defineMessages } from 'react-intl';

export const scope = 'industry_average_page';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Industry Average',
  },
  cost_of_missed_appointments: {
    id: `${scope}.input_label.cost_of_missed_appointments`,
    defaultMessage: 'Cost of missed appointments',
  },
  did_not_attend: {
    id: `${scope}.input_label.did_not_attend`,
    defaultMessage: 'Did not attend',
  },
  uptake: {
    id: `${scope}.input_label.uptake`,
    defaultMessage: 'Uptake',
  },
  coverage: {
    id: `${scope}.input_label.coverage`,
    defaultMessage: 'Coverage',
  },
  number_of_women_screened_after_sending_invites: {
    id: `${scope}.input_label.number_of_women_screened_after_sending_invites`,
    defaultMessage: 'Number of women screened after sending invites',
  },
  number_of_women_eligible_for_screening: {
    id: `${scope}.input_label.number_of_women_eligible_for_screening`,
    defaultMessage: 'Number of women eligible for screening',
  },
  number_of_women_screened_in_the_past_3_years: {
    id: `${scope}.input_label.number_of_women_screened_in_the_past_3_years`,
    defaultMessage: 'Number of women screened in the past 3 years',
  },
});
