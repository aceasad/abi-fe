import React, { useEffect } from 'react';
import { Formik, Field } from 'formik';
import { Button, Form } from 'antd';
import FormInputField from 'components/shared-components/Form/FormField';
import messages from './messages';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import {
  updateIndustryAverage,
  getIndustryAverage,
} from 'redux/actions/IndustryAverage';
import { useSelector } from 'react-redux';
import { industryAverageSelector } from '../../../redux/selectors/IndustryAverage';

const IndustryAverage = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const industryAverage = useSelector(industryAverageSelector());
  let initialValues =
    industryAverage !== null
      ? industryAverage[0]
      : {
          id: 0,
          cost_of_missed_appointments: 0,
          did_not_attend: 0,
          uptake: 0,
          coverage: 0,
          number_of_women_screened_after_invite: 0,
          number_of_women_eligible_for_screen: 0,
          number_of_women_screened_in_past_3_y: 0,
        };
  useEffect(() => {
    dispatch(getIndustryAverage());
  }, []);

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values) => {
          dispatch(updateIndustryAverage(values));
        }}
      >
        {({ values, handleSubmit, dirty, isValid }) => (
          <Form layout="vertical" name="login-form">
            <Field
              component={FormInputField}
              label={formatMessage(messages.cost_of_missed_appointments)}
              name={'cost_of_missed_appointments'}
              type={'number'}
            ></Field>
            <Field
              component={FormInputField}
              label={formatMessage(messages.did_not_attend)}
              name={'did_not_attend'}
              type={'number'}
            ></Field>
            <Field
              component={FormInputField}
              label={formatMessage(messages.uptake)}
              name={'uptake'}
              type={'number'}
            ></Field>
            <Field
              component={FormInputField}
              label={formatMessage(messages.coverage)}
              name={'coverage'}
              type={'number'}
            ></Field>
            <Field
              component={FormInputField}
              label={formatMessage(
                messages.number_of_women_screened_after_sending_invites
              )}
              name={'number_of_women_screened_after_invite'}
              type={'number'}
            ></Field>
            <Field
              component={FormInputField}
              label={formatMessage(
                messages.number_of_women_eligible_for_screening
              )}
              name={'number_of_women_eligible_for_screen'}
              type={'number'}
            ></Field>
            <Field
              type={'number'}
              component={FormInputField}
              label={formatMessage(
                messages.number_of_women_screened_in_the_past_3_years
              )}
              name={'number_of_women_screened_in_past_3_y'}
            ></Field>{' '}
            <Form.Item>
              <Button
                name="create"
                type="primary"
                disabled={!dirty || !isValid}
                onClick={handleSubmit}
              >
                Create
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default IndustryAverage;
