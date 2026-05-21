import React, { useCallback, useEffect } from 'react';
import { Formik } from 'formik';
import { Button, Form, Row, Col, Typography, message } from 'antd';
import { useDispatch } from 'react-redux';
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
  const industryAverage = useSelector(industryAverageSelector());
  const laoding = useSelector(makeSelectIndustryAverageLoading());

  const afterUpdate = () => {
    message.success("Industry average successfully updated");
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
      <Title level={3} className="mb-4">
        {"Industry average"}
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
                  label={"Average appointment cost"}
                  name={'average_appointment_cost'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: "Average appointment cost",
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={"Cost of missed appointments"}
                  name={'cost_of_missed_appointments'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: "Cost of missed appointments",
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={"Did not attend - National average %"}
                  name={'did_not_attend'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: "Did not attend - National average %",
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={"Uptake - National average %"}
                  name={'uptake'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: "Uptake - National average %",
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={"Coverage - National average %"}
                  name={'coverage'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: "Coverage - National average %",
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
                  label={"Number of patients screened after sending invites"}
                  name={'number_of_women_screened_after_invite'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: "Number of patients screened after sending invites",
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={"Number of patients eligible for screening"}
                  name={'number_of_women_eligible_for_screen'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: "Number of patients eligible for screening",
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  style={{ width: '100%' }}
                  component={FormNumberField}
                  label={"Number of patients screened in the past 3 years"}
                  name={'number_of_women_screened_in_past_3_y'}
                  min={0}
                  onKeyDown={filterNumberInput}
                  step={0.1}
                  decimals={1}
                  errorTexts={{
                    label: "Number of patients screened in the past 3 years",
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
                {"Save"}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default IndustryAverage;
