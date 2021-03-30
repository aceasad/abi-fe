import React, { useState } from 'react';
import { Button, Form, Radio, Row, Col, Card, Typography } from 'antd';
import { Formik, Field } from 'formik';
import { clinicSchema } from 'utils/validations';
import { useDispatch } from 'react-redux';
import messages from './messages';
import FormField from 'components/custom-components/Form/FormField';
import FormInputField from 'components/custom-components/Form/FormInputField';
import FormImageUpload from 'components/custom-components/Form/FormImageUpload';
import { useIntl } from 'react-intl';
import { updateClinic } from 'redux/actions/Clinic';
import { NO, FREE, AVAILABLE } from '../../../constants/ClinicConstants';
import { MinusOutlined } from '@ant-design/icons';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import localeString from 'utils/localeString';
import { signOut } from '../../../redux/actions/Auth';

const { Title } = Typography;

const ClinicPage = ({ localization = true }) => {
  const dispatch = useDispatch();
  const [visibilityOfParkinSizeField, setVisibility] = useState(false);

  const { formatMessage } = useIntl();

  return (
    <Layout>
      <Header className="ant-layout-page-header shadow-sm d-flex justify-content-sm-between">
        <Title className="mb-sm-0">
          {localeString(localization, 'clinic_page.header.title')}
        </Title>
        <Button
          type="primary"
          onClick={() => {
            dispatch(signOut());
          }}
        >
          {formatMessage(messages.logout)}
        </Button>
      </Header>
      <Content>
        <Card className="m-4">
          <Formik
            initialValues={{
              photo: null,
              name: '',
              phone_number: '',
              address: '',
              google_maps_link: '',
              parking_availability: null,
              parking_size: 0,
              start_of_work: null,
              end_of_work: null,
            }}
            validationSchema={clinicSchema}
            onSubmit={(values) => {
              dispatch(updateClinic(values));
            }}
          >
            {({ dirty, isValid, values, handleSubmit }) => (
              <Form
                layout="vertical"
                name="clinic-form"
                onSubmit={handleSubmit}
              >
                <Row justify="center" className="mb-5 mt-4">
                  <Col span={6}>
                    <Field component={FormImageUpload} name={'photo'}></Field>
                  </Col>
                </Row>

                <Row justify="center">
                  <Col span={6}>
                    <Title type="secondary" level={2} className="mt-4">
                      Clinic Details
                    </Title>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={24}>
                        <Field
                          component={FormField}
                          label={formatMessage(messages.clinic_name)}
                          name={'name'}
                          errorTexts={{
                            label: formatMessage(
                              messages.error_input_label_name
                            ),
                          }}
                        />
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Field
                          component={FormField}
                          label={formatMessage(messages.phone_number)}
                          name={'phone_number'}
                          errorTexts={{
                            label: formatMessage(
                              messages.error_input_label_phone_number
                            ),
                          }}
                        />
                      </Col>
                      <Col span={16}>
                        <Field
                          component={FormField}
                          label={formatMessage(messages.address)}
                          name={'address'}
                          errorTexts={{
                            label: formatMessage(
                              messages.error_input_label_address
                            ),
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Field
                          component={FormField}
                          label={formatMessage(messages.google_maps_link)}
                          name={'google_maps_link'}
                          errorTexts={{
                            label: formatMessage(
                              messages.error_input_label_google_maps_link
                            ),
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          name="radio-group"
                          label={formatMessage(messages.parking_availability)}
                        >
                          <Radio.Group
                            className="width-100"
                            onChange={(event) => {
                              setVisibility(event.target.value === AVAILABLE);
                              values.parking_availability = event.target.value;
                            }}
                          >
                            <Row>
                              <Col span={8}>
                                <Radio value={NO}>
                                  {formatMessage(messages.parking_no)}
                                </Radio>
                              </Col>
                              <Col span={8}>
                                <Radio value={FREE}>
                                  {formatMessage(messages.parking_free)}
                                </Radio>
                              </Col>
                              <Col span={8}>
                                <Radio value={AVAILABLE}>
                                  {formatMessage(messages.parking_available)}
                                </Radio>
                              </Col>
                            </Row>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col offset={16} span={6}>
                        {visibilityOfParkinSizeField ? (
                          <Form.Item
                            label={formatMessage(messages.parking_size)}
                          >
                            <Field
                              component={FormInputField}
                              name={'parking_size'}
                              type={'number'}
                              min={1}
                            />
                          </Form.Item>
                        ) : null}
                      </Col>
                    </Row>
                    <Form.Item label={formatMessage(messages.working_hours)}>
                      <Row gutter={8}>
                        <Col span={4}>
                          <Field
                            component={FormInputField}
                            name={'start_of_work'}
                            type={'time'}
                          />
                        </Col>
                        <Col span={2} className="text-center">
                          <MinusOutlined className="mt-3 text-primary" />
                        </Col>
                        <Col span={4}>
                          <Field
                            component={FormInputField}
                            name={'end_of_work'}
                            type={'time'}
                          />
                        </Col>
                      </Row>
                    </Form.Item>

                    <Row>
                      <Col>
                        <Form.Item>
                          <Button
                            name="create"
                            type="primary"
                            disabled={!dirty || !isValid}
                            onClick={() => handleSubmit(values)}
                          >
                            {formatMessage(messages.create)}
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Card>
      </Content>
    </Layout>
  );
};

export default ClinicPage;
