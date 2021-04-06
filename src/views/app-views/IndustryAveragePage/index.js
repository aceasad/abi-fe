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
    <Layout>
      <Header className="ant-layout-page-header border-bottom">
        <Title className="mb-sm-0">Industry Average</Title>
      </Header>
      <Content>
        <Card className="m-4 p-3">
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
                      label={formatMessage(
                        messages.cost_of_missed_appointments
                      )}
                      name={'cost_of_missed_appointments'}
                      type={'text'}
                      min={0}
                      errorTexts={{
                        label: formatMessage(
                          messages.cost_of_missed_appointments
                        ),
                        matchesLabel: formatMessage(messages.number_max_digit),
                      }}
                    />
                    <RowColumnField
                      span={24}
                      component={FormInputField}
                      label={formatMessage(messages.did_not_attend)}
                      name={'did_not_attend'}
                      type={'text'}
                      min={0}
                      errorTexts={{
                        label: formatMessage(messages.did_not_attend),
                        matchesLabel: formatMessage(messages.number_max_digit),
                      }}
                    />
                    <RowColumnField
                      span={24}
                      component={FormInputField}
                      label={formatMessage(messages.uptake)}
                      name={'uptake'}
                      type={'text'}
                      min={0}
                      errorTexts={{
                        label: formatMessage(messages.uptake),
                        matchesLabel: formatMessage(messages.number_max_digit),
                      }}
                    />
                    <RowColumnField
                      span={24}
                      component={FormInputField}
                      label={formatMessage(messages.coverage)}
                      name={'coverage'}
                      type={'text'}
                      min={0}
                      errorTexts={{
                        label: formatMessage(messages.coverage),
                        matchesLabel: formatMessage(messages.number_max_digit),
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
                      type={'text'}
                      min={0}
                      errorTexts={{
                        label: formatMessage(
                          messages.number_of_women_screened_after_sending_invites
                        ),
                        matchesLabel: formatMessage(messages.number_max_digit),
                      }}
                    />
                    <RowColumnField
                      span={24}
                      component={FormInputField}
                      label={formatMessage(
                        messages.number_of_women_eligible_for_screening
                      )}
                      name={'number_of_women_eligible_for_screen'}
                      type={'text'}
                      min={0}
                      errorTexts={{
                        label: formatMessage(
                          messages.number_of_women_eligible_for_screening
                        ),
                        matchesLabel: formatMessage(messages.number_max_digit),
                      }}
                    />
                    <RowColumnField
                      span={24}
                      component={FormInputField}
                      label={formatMessage(
                        messages.number_of_women_screened_in_the_past_3_years
                      )}
                      name={'number_of_women_screened_in_past_3_y'}
                      type={'text'}
                      min={0}
                      errorTexts={{
                        label: formatMessage(
                          messages.number_of_women_screened_in_the_past_3_years
                        ),
                        matchesLabel: formatMessage(messages.number_max_digit),
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
        </Card>
      </Content>
    </Layout>
  );
};
export default IndustryAverage;
