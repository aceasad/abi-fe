import { Button } from 'antd';
import Form from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import FormCheckbox from 'components/custom-components/Form/FormCheckbox';
import FormField from 'components/custom-components/Form/FormField';
import { Field, Formik } from 'formik';
import React from 'react';
import { ValidPasswordFormat } from '../ResetPasswordForm/ResetPasswordForm';
import { passwordMinLength } from 'constants/Validation';
import { useSelector } from 'react-redux';
import { makeSelectSingleUserLoading } from 'redux/selectors/Users';
import Loading from 'components/shared-components/Loading';

const UserSettingsFormModal = ({
  closeModal,
  title,
  handleSubmit,
  initialValues,
  loadginData = false,
  validationSchema,
}) => {

  const loading = useSelector(makeSelectSingleUserLoading());

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ handleSubmit, dirty, isValid }) => (
        <Modal
          title={title}
          style={{ maxWidth: '24rem', top: '2rem' }}
          open
          closable={false}
          footer={[
            <Button
              key="back"
              onClick={closeModal}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            >
              {"Cancel"}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmit}
              htmlType="submit"
              disabled={!dirty || !isValid || loading}
            >
              {"Confirm"}
            </Button>,
          ]}
        >
          {loadginData ? (
            <Loading />
          ) : (
            <Form layout="vertical" name="login-form">
              <Field
                label={"Name"}
                component={FormField}
                name="name"
                autoFocus
              />
              <Field
                label={"Email"}
                component={FormField}
                name="username"
              />
              <Field
                label={"Password"}
                component={FormField}
                name="password"
                tooltipText={ValidPasswordFormat}
                secureField
                errorTexts={{
                  label: "Password",
                  minValue: passwordMinLength,
                  matchesLabel: "Password must be in valid format",
                }}
              />
              <Field
                label={"Confirm Password"}
                component={FormField}
                name="confirmPassword"
                secureField
                errorTexts={{
                  label: "Confirm Password",
                  minValue: passwordMinLength,
                  matchesLabel: "Password must be in valid format",
                  value: "Password",
                }}
              />
              <Field
                label={"Receive email notifications"}
                component={FormCheckbox}
                name="receive_email_notifications"
              />
            </Form>
          )}
        </Modal>
      )}
    </Formik>
  );
};

export default UserSettingsFormModal;
