import React, { useCallback, useEffect } from 'react';
import { Formik } from 'formik';
import { Button, Form, Row, Col, Typography, Layout, Card } from 'antd';
import FormInputField from 'components/custom-components/Form/FormField';
import messages from './messages';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import {
  updateIndustryAverage,
  getIndustryAverage,
  createIndustryAverage,
  updateIsUpdated,
} from 'redux/actions/IndustryAverage';
import { useSelector } from 'react-redux';
import { success } from '../../../components/shared-components/MessagesAlerts/index';
import {
  industryAverageSelector,
  isLoadingIndustryAverageSelector,
  industryAverageIsUpdated,
} from '../../../redux/selectors/IndustryAverage';
import { industryAveragesSchema } from 'utils/validations';
import RowColumnField from 'components/custom-components/Form/RowColumnField';
import { maxDigits } from 'constants/Validation';
const { Header, Content } = Layout;
const { Title } = Typography;

const IndustryAverage = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const industryAverage = useSelector(industryAverageSelector());
  const isLoading = useSelector(isLoadingIndustryAverageSelector());
  const isUpdatedOrCreated = useSelector(industryAverageIsUpdated());

  const handleSubmit = useCallback(
    (values) => {
      industryAverage.length
        ? dispatch(updateIndustryAverage(values))
        : dispatch(createIndustryAverage(values));
    },
    [dispatch, industryAverage]
  );

  let initialValues =
    industryAverage != null && industryAverage.length > 0
      ? industryAverage[0]
      : {
          cost_of_missed_appointments: '0.000000',
          did_not_attend: '0.000000',
          uptake: '0.000000',
          coverage: '0.000000',
          number_of_women_screened_after_invite: '0.000000',
          number_of_women_eligible_for_screen: '0.000000',
          number_of_women_screened_in_past_3_y: '0.000000',
        };
  useEffect(() => {
    if (!isLoading) dispatch(getIndustryAverage());
  }, [isLoading]);

  useEffect(() => {
    if (isUpdatedOrCreated) {
      success(formatMessage(messages.save_or_updated));
      dispatch(getIndustryAverage());
      dispatch(updateIsUpdated());
    }
  }, [isUpdatedOrCreated]);
  return (
    <div className="p-2">
      <Title level={2} className="mb-4">
        {formatMessage(messages.title)}
      </Title>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={industryAveragesSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, dirty, isValid }) => (
          <Form layout="vertical" name="login-form">
            <Row gutter={64} align="bottom">
              <Col span={10}>
                <RowColumnField
                  span={24}
                  component={FormInputField}
                  label={formatMessage(messages.cost_of_missed_appointments)}
                  name={'cost_of_missed_appointments'}
                  type={'number'}
                  min={0}
                  errorTexts={{
                    label: formatMessage(messages.cost_of_missed_appointments),
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  component={FormInputField}
                  label={formatMessage(messages.did_not_attend)}
                  name={'did_not_attend'}
                  type={'number'}
                  min={0}
                  errorTexts={{
                    label: formatMessage(messages.did_not_attend),
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  component={FormInputField}
                  label={formatMessage(messages.uptake)}
                  name={'uptake'}
                  type={'number'}
                  min={0}
                  errorTexts={{
                    label: formatMessage(messages.uptake),
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  component={FormInputField}
                  label={formatMessage(messages.coverage)}
                  name={'coverage'}
                  type={'number'}
                  min={0}
                  errorTexts={{
                    label: formatMessage(messages.coverage),
                    maxValue: maxDigits,
                  }}
                />
              </Col>
              <Col span={10}>
                <Row>
                  <Col span={24}>
                    <Title level={4} type="secondary" className="mb-4">
                      Screening Average
                    </Title>
                  </Col>
                </Row>
                <RowColumnField
                  span={24}
                  component={FormInputField}
                  label={formatMessage(
                    messages.number_of_women_screened_after_sending_invites
                  )}
                  name={'number_of_women_screened_after_invite'}
                  type={'number'}
                  min={0}
                  errorTexts={{
                    label: formatMessage(
                      messages.number_of_women_screened_after_sending_invites
                    ),
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  component={FormInputField}
                  label={formatMessage(
                    messages.number_of_women_eligible_for_screening
                  )}
                  name={'number_of_women_eligible_for_screen'}
                  type={'number'}
                  min={0}
                  errorTexts={{
                    label: formatMessage(
                      messages.number_of_women_eligible_for_screening
                    ),
                    maxValue: maxDigits,
                  }}
                />
                <RowColumnField
                  span={24}
                  component={FormInputField}
                  label={formatMessage(
                    messages.number_of_women_screened_in_the_past_3_years
                  )}
                  name={'number_of_women_screened_in_past_3_y'}
                  type={'number'}
                  min={0}
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
