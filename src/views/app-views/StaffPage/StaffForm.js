import PageHeader from 'components/shared-components/PageHeader';
import { Formik, Field } from 'formik';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { Form } from 'antd';
import FormField from 'components/shared-components/Form/FormField';
import FormDatePicker from 'components/shared-components/Form/FormDatePicker';
import { staffValidationSchema } from 'utils/validations';
import FormSelect from 'components/shared-components/Form/FormSelect';
import { useDispatch, useSelector } from 'react-redux';
import { getStaffDetails } from 'redux/actions/Staff';
import { makeSelectStaffDetails } from 'redux/selectors/Staff';
import FormRadio from 'components/shared-components/Form/FormRadio';
import FormImageUpload from 'components/shared-components/Form/FormImageUpload';

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
    <div>
      <Formik
        initialValues={initialState}
        validationSchema={staffValidationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
        validateOnMount={false}
      >
        {({ values, handleSubmit, dirty, isValid }) => (
          <>
            <PageHeader
              title={label}
              handleSecondaryClick={showList}
              primaryAction={formatMessage(messages.submit)}
              secondaryAction={formatMessage(messages.cancel)}
              handlePrimaryClick={handleSubmit}
              disablePrimary={!dirty || !isValid || loading}
            />
            <Form layout="vertical" name="login-form">
              <h2>{formatMessage(messages.personalDetails)}</h2>
              <Field component={FormImageUpload} name="profile_picture" />
              <Field
                component={FormField}
                label={formatMessage(messages.firstName)}
                name="first_name"
                errorTexts={{
                  label: formatMessage(messages.firstName),
                }}
                autoFocus
              />
              <Field
                component={FormField}
                label={formatMessage(messages.lastName)}
                name="last_name"
                errorTexts={{
                  label: formatMessage(messages.lastName),
                }}
              />
              <Field
                label={formatMessage(messages.dateOfBirth)}
                maxDate={new Date()}
                component={FormDatePicker}
                name="date_of_birth"
              />
              <Field
                component={FormSelect}
                name="ethnicity"
                options={ethnicities}
                optionField="name"
                defaultOption={
                  ethnicities &&
                  ethnicities.find(
                    (ethnicity) => ethnicity.id == values.ethnicity
                  )
                }
                label={formatMessage(messages.ethnicity)}
              />
              <Field
                name="gender"
                component={FormRadio}
                options={genderChoices}
                optionField="name"
                label={formatMessage(messages.gender)}
              />
              <Field
                component={FormSelect}
                name="specialization"
                options={specializations}
                optionField="name"
                defaultOption={
                  specializations &&
                  specializations.find(
                    (specialization) =>
                      specialization.id == values.specialization
                  )
                }
                label={formatMessage(messages.specialization)}
              />
              <Field
                component={FormSelect}
                name="seniority"
                options={seniorities}
                optionField="name"
                defaultOption={
                  seniorities &&
                  seniorities.find(
                    (seniority) => seniority.id == values.seniority
                  )
                }
                label={formatMessage(messages.seniority)}
              />
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default StaffForm;
