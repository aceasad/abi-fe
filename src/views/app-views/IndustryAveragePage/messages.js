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
    defaultMessage: 'Did not attend - National Average %',
  },
  uptake: {
    id: `${scope}.input_label.uptake`,
    defaultMessage: 'Uptake - National Average %',
  },
  coverage: {
    id: `${scope}.input_label.coverage`,
    defaultMessage: 'Coverage - National Average %',
  },
  number_of_women_screened_after_sending_invites: {
    id: `${scope}.input_label.number_of_women_screened_after_sending_invites`,
    defaultMessage: 'Number of patients screened after sending invites',
  },
  number_of_women_eligible_for_screening: {
    id: `${scope}.input_label.number_of_women_eligible_for_screening`,
    defaultMessage: 'Number of patients eligible for screening',
  },
  number_of_women_screened_in_the_past_3_years: {
    id: `${scope}.input_label.number_of_women_screened_in_the_past_3_years`,
    defaultMessage: 'Number of patients screened in the past 3 years',
  },
  number_max_digit: {
    id: `${scope}.error.number_max_digit`,
    defaultMessage:
      'Number must be max 16 characters, if float max 6 digits after point and 10 before.',
  },
  save_or_updated: {
    id: `${scope}.text.save_or_updated`,
    defaultMessage: 'Industry averages is successfully updated',
  },
  save: {
    id: `${scope}.button.save`,
    defaultMessage: 'Save',
  },
});
