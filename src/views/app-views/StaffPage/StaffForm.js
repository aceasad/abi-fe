import PageHeaderComponent from 'components/shared-components/PageHeaderComponent';
import { Formik, Field } from 'formik';
import React, { useEffect } from 'react';
import messages from './messages';
import { Row, Col, Form, Card, Typography, Button, Space } from 'antd';
import FormField from 'components/custom-components/Form/FormField';
import FormDatePicker from 'components/custom-components/Form/FormDatePicker';
import { staffValidationSchema } from 'utils/validations';
import FormSelect from 'components/custom-components/Form/FormSelect';
import { useDispatch, useSelector } from 'react-redux';
import { getStaffDetails } from 'redux/actions/Staff';
import { makeSelectStaffDetails } from 'redux/selectors/Staff';
import FormRadio from 'components/custom-components/Form/FormRadio';
import FormImageUpload from 'components/custom-components/Form/FormImageUpload';

const { Title } = Typography;

const StaffForm = ({
  showList,
  handleSubmit,
  initialState,
  genderChoices,
  label,
}) => {
  const dispatch = useDispatch();

  const { ethnicities, specializations, seniorities, loading } = useSelector(
    makeSelectStaffDetails()
  );

  useEffect(() => {
    dispatch(getStaffDetails());
  }, []);

  return (
    <Formik
      initialValues={initialState}
      validationSchema={staffValidationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
      validateOnMount={false}
    >
      {({ values, handleSubmit, dirty, isValid }) => (
        <>
          <PageHeaderComponent
            title={label}
            handleSecondaryClick={showList}
            // secondaryAction={messages.cancel}
            handlePrimaryClick={handleSubmit}
            disablePrimary={!dirty || !isValid || loading}
          />
          <Card>
            <Form layout="vertical" name="login-form" className="ml-sm-3">
              <Row justify="start" className="mb-5 mt-5">
                <Col xs={6}>
                  <Field component={FormImageUpload} name="profile_picture" />
                </Col>
              </Row>
              <Row justify="end" gutter={16}>
                <Col xs={24} lg={6}>
                  <Title type="secondary" level={2} className="mt-4">
                    {messages.personalDetails}
                  </Title>
                </Col>
                <Col xs={24} lg={6}>
                  <Field
                    component={FormField}
                    label={messages.firstName}
                    name="first_name"
                    errorTexts={{
                      label: messages.firstName,
                    }}
                    // autoFocus
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Field
                    component={FormField}
                    label={messages.lastName}
                    name="last_name"
                    errorTexts={{
                      label: messages.lastName,
                    }}
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Field
                    label={messages.dateOfBirth}
                    maxDate={new Date()}
                    disablePastDates
                    component={FormDatePicker}
                    name="date_of_birth"
                  />
                </Col>
              </Row>
              <Row justify="end" gutter={16}>
                <Col xs={24} lg={6}>
                  <Field
                    component={FormSelect}
                    name="ethnicity"
                    options={ethnicities}
                    optionField="name"
                    defaultOption={values.ethnicity}
                    label={messages.ethnicity}
                  />
                </Col>
                {/* <ColumnField
                      span={12}
                      component={FormField}
                      label={messages.phoneNumber}
                      name="phone_number"
                      errorTexts={{
                        label: messages.phoneNumber,
                        matchesLabel: messages.phoneNumberFormat,
                        maxValue: MAX,
                      }}
                      required
                    />
                     */}
                <Col xs={24} lg={6}>
                  <Field
                    component={FormField}
                    label={messages.phoneNumber}
                    name="phone_number"
                    errorTexts={{
                      label: messages.phoneNumber,
                    }}
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Field
                    name="gender"
                    component={FormRadio}
                    options={genderChoices}
                    optionField="name"
                    label={messages.gender}
                  />
                </Col>
              </Row>
              <Row justify="end" gutter={16}>
                <Col xs={24} lg={12}>
                  <Field
                    component={FormSelect}
                    name="specialization"
                    options={specializations}
                    optionField="name"
                    defaultOption={values.specialization}
                    label={messages.specialization}
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Field
                    component={FormSelect}
                    name="seniority"
                    options={seniorities}
                    optionField="name"
                    defaultOption={values.seniority}
                    label={messages.seniority}
                  />
                </Col>
                <Col span={24} className={'text-right'}>
                  <Space wrap>
                    <Button key="10" onClick={showList}>
                      {messages.cancel}
                    </Button>
                    <Button
                      disabled={!isValid || !dirty || loading}
                      type="primary"
                      onClick={handleSubmit}
                    >
                      {messages.submit}
                    </Button>
                  </Space>

                  {/* secondaryAction={messages.cancel} */}
                </Col>
              </Row>
            </Form>
          </Card>
        </>
      )}
    </Formik>
  );
};

export default StaffForm;
