import { Field, Formik } from 'formik';
import { Card, Col, Row, Typography } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import React from 'react';
import PatientHeader from './PatientHeader';
import FormField from 'components/custom-components/Form/FormField';
import Form from 'antd/lib/form/Form';
import FormDatePicker from 'components/custom-components/Form/FormDatePicker';
import FormSelect from 'components/custom-components/Form/FormSelect';
import localeString from 'utils/localeString';
import ColumnField from 'components/custom-components/Form/ColumnField';

const { Title } = Typography;

const options = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3' },
];

const PatientForm = ({ title, localization }) => {
  return (
    <Layout>
      <Formik
        initialValues={{
          first_name: '',
          last_name: '',
          date_of_birth: '',
          sex: '',
          height: '',
          weight: '',
          ethinicity: '',
          phone_number: '',
          area_of_living: '',
          marital_status: '',
          number_of_dependents: '',
          employment_status: '',
          education_background: '',
          insurance: '',
        }}
      >
        {({ values }) => (
          <>
            <PatientHeader title={title} localization={localization} />

            <Content>
              <Card className="m-4 p-4">
                <Form layout="vertical">
                  <Row>
                    <Col span={6}>
                      <Title type="secondary" level={2} className="mt-4">
                        {localeString(
                          localization,
                          'patient_details.side.title.personal'
                        )}
                      </Title>
                    </Col>

                    <Col span={12}>
                      <Row gutter={16}>
                        <ColumnField
                          span={8}
                          component={FormField}
                          label={localeString(
                            localization,
                            'patient_details.side.form.first_name'
                          )}
                          name="first_name"
                          errorTexts={{
                            label: 'First name error.',
                          }}
                          required={true}
                        />
                        <ColumnField
                          span={8}
                          component={FormField}
                          label={localeString(
                            localization,
                            'patient_details.side.form.last_name'
                          )}
                          name="last_name"
                          errorTexts={{
                            label: 'Last name error.',
                          }}
                          required={true}
                        />
                        <ColumnField
                          span={8}
                          component={FormDatePicker}
                          label={localeString(
                            localization,
                            'patient_details.side.form.date_of_birth'
                          )}
                          name="date_of_birth"
                          errorTexts={{
                            label: 'Date of birth error.',
                          }}
                          required={true}
                        />
                      </Row>
                      <Row gutter={16}>
                        <ColumnField
                          span={8}
                          component={FormSelect}
                          name="sex"
                          options={options}
                          optionField="name"
                          defaultOption={
                            options &&
                            options.find((option) => option.id == values.sex)
                          }
                          label={localeString(
                            localization,
                            'patient_details.side.form.sex'
                          )}
                        />

                        <ColumnField
                          span={8}
                          component={FormField}
                          label={localeString(
                            localization,
                            'patient_details.side.form.height'
                          )}
                          name="height"
                          errorTexts={{
                            label: 'Height error.',
                          }}
                          type={'number'}
                          min={0}
                        />
                        <ColumnField
                          span={8}
                          component={FormField}
                          label={localeString(
                            localization,
                            'patient_details.side.form.weight'
                          )}
                          name="weight"
                          errorTexts={{
                            label: 'Weight error.',
                          }}
                          type={'number'}
                          min={0}
                        />
                      </Row>
                      <Row gutter={16}>
                        <ColumnField
                          span={8}
                          component={FormSelect}
                          name="ethnicity"
                          options={options}
                          optionField="name"
                          defaultOption={
                            options &&
                            options.find(
                              (option) => option.id == values.ethinicity
                            )
                          }
                          label={localeString(
                            localization,
                            'patient_details.side.form.ethnicity'
                          )}
                        />
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={6}>
                      <Title type="secondary" level={2} className="mt-4">
                        {localeString(
                          localization,
                          'patient_details.side.title.contact'
                        )}
                      </Title>
                    </Col>

                    <Col span={12}>
                      <Row gutter={16}>
                        <ColumnField
                          component={FormField}
                          label={localeString(
                            localization,
                            'patient_details.side.form.phone_number'
                          )}
                          name="phone_number"
                          errorTexts={{
                            label: 'Phone number error.',
                          }}
                          required={true}
                        />
                        <ColumnField
                          span={8}
                          component={FormField}
                          label={localeString(
                            localization,
                            'patient_details.side.form.area_of_living'
                          )}
                          name="area_of_living"
                          errorTexts={{
                            label: 'Area of living error.',
                          }}
                        />
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={6}>
                      <Title type="secondary" level={2} className="mt-4">
                        {localeString(
                          localization,
                          'patient_details.side.title.other'
                        )}
                      </Title>
                    </Col>

                    <Col span={12}>
                      <Row gutter={16}>
                        <ColumnField
                          span={8}
                          component={FormSelect}
                          name="marital_status"
                          options={options}
                          optionField="name"
                          defaultOption={
                            options &&
                            options.find(
                              (option) => option.id == values.marital_status
                            )
                          }
                          label={localeString(
                            localization,
                            'patient_details.side.form.marital_status'
                          )}
                        />
                        <ColumnField
                          span={8}
                          component={FormField}
                          label={'Number of dependents'}
                          name="number_of_dependents"
                          errorTexts={{
                            label: 'Area of living error.',
                          }}
                          type={'number'}
                          min={0}
                        />
                      </Row>
                      <Row gutter={16}>
                        <ColumnField
                          span={8}
                          component={FormSelect}
                          name="employment_status"
                          options={options}
                          optionField="name"
                          defaultOption={
                            options &&
                            options.find(
                              (options) => options.id == values.marital_status
                            )
                          }
                          label={localeString(
                            localization,
                            'patient_details.side.form.employment_status'
                          )}
                        />
                        <ColumnField
                          span={8}
                          component={FormSelect}
                          name="education_background"
                          options={options}
                          optionField="name"
                          defaultOption={
                            options &&
                            options.find(
                              (options) =>
                                options.id == values.education_background
                            )
                          }
                          label={localeString(
                            localization,
                            'patient_details.side.form.educational_background'
                          )}
                        />
                      </Row>
                      <Row gutter={16}>
                        <Col span={16}>
                          <Field
                            component={FormField}
                            label={localeString(
                              localization,
                              'patient_details.side.form.insurance'
                            )}
                            name="insurance"
                            errorTexts={{
                              label: 'Insurance error.',
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Content>
          </>
        )}
      </Formik>
    </Layout>
  );
};

export default PatientForm;
