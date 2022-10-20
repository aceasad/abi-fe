import PageHeaderComponent from 'components/shared-components/PageHeaderComponent';
import { Formik, Field } from 'formik';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { Row, Col, Form, Card, Typography, Button } from 'antd';
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
  const { formatMessage } = useIntl();
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
            primaryAction={formatMessage(messages.submit)}
            secondaryAction={formatMessage(messages.cancel)}
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
                    {formatMessage(messages.personalDetails)}
                  </Title>
                </Col>
                <Col xs={24} lg={6}>
                  <Field
                    component={FormField}
                    label={formatMessage(messages.firstName)}
                    name="first_name"
                    errorTexts={{
                      label: formatMessage(messages.firstName),
                    }}
                    autoFocus
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Field
                    component={FormField}
                    label={formatMessage(messages.lastName)}
                    name="last_name"
                    errorTexts={{
                      label: formatMessage(messages.lastName),
                    }}
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Field
                    label={formatMessage(messages.dateOfBirth)}
                    maxDate={new Date()}
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
                    label={formatMessage(messages.ethnicity)}
                  />
                </Col>
                <Col xs={24} lg={12}>
                  <Field
                    name="gender"
                    component={FormRadio}
                    options={genderChoices}
                    optionField="name"
                    label={formatMessage(messages.gender)}
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
                    label={formatMessage(messages.specialization)}
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Field
                    component={FormSelect}
                    name="seniority"
                    options={seniorities}
                    optionField="name"
                    defaultOption={values.seniority}
                    label={formatMessage(messages.seniority)}
                  />
                </Col>
                <Col span={24} className={'text-right'}>
                  <Button
                    disabled={!isValid || !dirty || loading}
                    type="primary"
                    onClick={handleSubmit}
                  >
                    {formatMessage(messages.submit)}
                  </Button>
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
