import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Field, Formik } from 'formik';
import { Card, Col, Row, Typography } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import Form from 'antd/lib/form/Form';

import PatientHeader from './PatientHeader';
import FormField from 'components/custom-components/Form/FormField';
import FormDatePicker from 'components/custom-components/Form/FormDatePicker';
import FormSelect from 'components/custom-components/Form/FormSelect';
import ColumnField from 'components/custom-components/Form/ColumnField';
import messages from './messages';
import { makeSelectPatientDetails } from 'redux/selectors/Patient';
import { patientSchema } from 'utils/validations';
import { MAX } from 'constants/ClinicConstants';

const { Title } = Typography;

const PatientForm = ({
  title,
  showList,
  handleSubmit,
  genderChoices,
  initialState,
  loading,
}) => {
  const { formatMessage } = useIntl();

  const { education, employment, material_status, ethnicities } = useSelector(
    makeSelectPatientDetails()
  );

  const filterNumberInput = (e) =>
    (e.keyCode === 69 ||
      e.keyCode === 189 ||
      e.keyCode === 190 ||
      e.keyCode === 187) &&
    e.preventDefault();

  return (
    <Formik
      enableReinitialize
      initialValues={initialState}
      onSubmit={handleSubmit}
      validationSchema={patientSchema}
    >
      {({ values, dirty, isValid, handleSubmit }) => (
        <>
          <PatientHeader
            title={title}
            secondaryAction={showList}
            primaryAction={handleSubmit}
            primaryDisabled={!isValid || !dirty || loading}
          />
          <Card className="p-4">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={6}>
                  <Title type="secondary" level={2} className="mt-4">
                    {formatMessage(messages.personalTitle)}
                  </Title>
                </Col>

                <Col span={18}>
                  <Row gutter={16}>
                    <ColumnField
                      span={8}
                      component={FormField}
                      label={formatMessage(messages.firstName)}
                      name="first_name"
                      errorTexts={{
                        label: formatMessage(messages.firstName),
                        maxValue: MAX,
                      }}
                      required
                    />
                    <ColumnField
                      span={8}
                      component={FormField}
                      label={formatMessage(messages.lastName)}
                      name="last_name"
                      errorTexts={{
                        label: formatMessage(messages.lastName),
                        maxValue: MAX,
                      }}
                      required
                    />
                    <ColumnField
                      span={8}
                      component={FormDatePicker}
                      label={formatMessage(messages.dateOfBirth)}
                      name="date_of_birth"
                      required
                    />
                  </Row>
                  <Row gutter={16}>
                    <ColumnField
                      span={8}
                      component={FormSelect}
                      name="gender"
                      options={genderChoices}
                      optionField="name"
                      defaultOption={
                        genderChoices &&
                        genderChoices.find(
                          (option) => option.id == values.gender
                        )
                      }
                      label={formatMessage(messages.sex)}
                      required
                    />

                    <ColumnField
                      span={8}
                      component={FormField}
                      label={formatMessage(messages.height)}
                      name="height"
                      type={'number'}
                      onKeyDown={filterNumberInput}
                      min={0}
                    />
                    <ColumnField
                      span={8}
                      component={FormField}
                      label={formatMessage(messages.weight)}
                      name="weight"
                      type={'number'}
                      onKeyDown={filterNumberInput}
                      min={0}
                    />
                  </Row>
                  <Row gutter={16}>
                    <ColumnField
                      span={8}
                      component={FormSelect}
                      name="ethnicity"
                      options={ethnicities}
                      optionField="name"
                      defaultOption={
                        ethnicities &&
                        ethnicities.find(
                          (option) => option.id == values.ethnicity
                        )
                      }
                      label={formatMessage(messages.ethnicity)}
                    />
                  </Row>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={6}>
                  <Title type="secondary" level={2} className="mt-4">
                    {formatMessage(messages.contact)}
                  </Title>
                </Col>

                <Col span={18}>
                  <Row gutter={16}>
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.phoneNumber)}
                      name="phone_number"
                      errorTexts={{
                        label: formatMessage(messages.phoneNumber),
                        matchesLabel: formatMessage(messages.phoneNumberFormat),
                        maxValue: MAX,
                      }}
                      required
                    />
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.areaOfLiving)}
                      name="area_of_living"
                      errorTexts={{
                        label: formatMessage(messages.areaOfLiving),
                        maxValue: MAX,
                      }}
                    />
                  </Row>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={6}>
                  <Title type="secondary" level={2} className="mt-4">
                    {formatMessage(messages.otherInfo)}
                  </Title>
                </Col>

                <Col span={18}>
                  <Row gutter={16}>
                    <ColumnField
                      span={12}
                      component={FormSelect}
                      name="material_status"
                      options={material_status}
                      optionField="name"
                      defaultOption={
                        material_status &&
                        material_status.find(
                          (option) => option.id == values.material_status
                        )
                      }
                      label={formatMessage(messages.materialStatus)}
                    />
                    <ColumnField
                      span={12}
                      component={FormField}
                      label={formatMessage(messages.numberOfDependants)}
                      name="number_of_dependants"
                      onKeyDown={filterNumberInput}
                      type={'number'}
                      min={0}
                    />
                  </Row>
                  <Row gutter={16}>
                    <ColumnField
                      span={12}
                      component={FormSelect}
                      name="employment"
                      options={employment}
                      optionField="name"
                      defaultOption={
                        employment &&
                        employment.find(
                          (option) => option.id == values.employment
                        )
                      }
                      label={formatMessage(messages.employmentStatus)}
                    />
                    <ColumnField
                      span={12}
                      component={FormSelect}
                      name="education"
                      options={education}
                      optionField="name"
                      defaultOption={
                        education &&
                        education.find(
                          (option) => option.id == values.education
                        )
                      }
                      label={formatMessage(messages.education)}
                    />
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Field
                        component={FormField}
                        label={formatMessage(messages.insurance)}
                        name="insurance"
                        errorTexts={{
                          label: formatMessage(messages.insurance),
                          maxValue: MAX,
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Card>
        </>
      )}
    </Formik>
  );
};

export default PatientForm;
