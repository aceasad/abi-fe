import React, { useCallback, useEffect } from 'react';
import { Formik } from 'formik';
import { Button, Form, Row, Col, Typography, message } from 'antd';
import messages from './messages';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import {
  updateIndustryAverage,
  getIndustryAverage,
  createIndustryAverage,
} from 'redux/actions/IndustryAverage';
import { useSelector } from 'react-redux';
import {
  industryAverageSelector,
  makeSelectIndustryAverageLoading,
} from 'redux/selectors/IndustryAverage';
import { industryAveragesSchema } from 'utils/validations';
import RowColumnField from 'components/custom-components/Form/RowColumnField';
import { maxDigits } from 'constants/Validation';
import { filterNumberInput } from 'utils/helpers';
import FormNumberField from 'components/custom-components/Form/FormNumberField';

const { Title } = Typography;

const IndustryAverage = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const industryAverage = useSelector(industryAverageSelector());
  const laoding = useSelector(makeSelectIndustryAverageLoading());

  const afterUpdate = () => {
    message.success(formatMessage(messages.save_or_updated));
  };

  const handleSubmit = useCallback(
    (values) => {
      industryAverage
        ? dispatch(updateIndustryAverage({ data: values, afterUpdate }))
        : dispatch(createIndustryAverage({ data: values, afterUpdate }));
    },
    [dispatch, industryAverage]
  );

  let initialValues = industryAverage
    ? industryAverage
    : {
        cost_of_missed_appointments: 0,
        average_appointment_cost: 0,
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
    <div className="p-2">
      <Title level={2} className="mb-4">
        {formatMessage(messages.title)}
      </Title>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={industryAveragesSchema}
      >
        {({ handleSubmit, dirty, isValid }) => (
          <Form layout="vertical" name="login-form">
            <Row gutter={32} align="bottom">
              <Col xs={24} sm={24} md={12} xxl={8}>
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={formatMessage(messages.average_appointment_cost)}
                  name={'average_appointment_cost'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: formatMessage(messages.average_appointment_cost),
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={formatMessage(messages.cost_of_missed_appointments)}
                  name={'cost_of_missed_appointments'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: formatMessage(messages.cost_of_missed_appointments),
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={formatMessage(messages.did_not_attend)}
                  name={'did_not_attend'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: formatMessage(messages.did_not_attend),
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={formatMessage(messages.uptake)}
                  name={'uptake'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: formatMessage(messages.uptake),
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={formatMessage(messages.coverage)}
                  name={'coverage'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: formatMessage(messages.coverage),
                    maxValue: maxDigits,
                  }}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xxl={8}>
                <Row>
                  <Col span={24}>
                    <Title level={4} type="secondary" className="mb-4">
                      Screening Average
                    </Title>
                  </Col>
                </Row>
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={formatMessage(
                    messages.number_of_women_screened_after_sending_invites
                  )}
                  name={'number_of_women_screened_after_invite'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: formatMessage(
                      messages.number_of_women_screened_after_sending_invites
                    ),
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={formatMessage(
                    messages.number_of_women_eligible_for_screening
                  )}
                  name={'number_of_women_eligible_for_screen'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: formatMessage(
                      messages.number_of_women_eligible_for_screening
                    ),
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={formatMessage(
                    messages.number_of_women_screened_in_the_past_3_years
                  )}
                  name={'number_of_women_screened_in_past_3_y'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: formatMessage(
                      messages.number_of_women_screened_in_the_past_3_years
                    ),
                    maxValue: maxDigits,
                  }}
                />
              </Col>
            </Row>
            <Form.Item>
              <Button
                name="create"
                type="primary"
                disabled={!dirty || !isValid || laoding}
                onClick={handleSubmit}
              >
                {formatMessage(messages.save)}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default IndustryAverage;
