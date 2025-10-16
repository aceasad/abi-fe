import { Button } from 'antd';
import Form from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import FormField from 'components/custom-components/Form/FormField';
import { Field, Formik } from 'formik';
import React from 'react';
import { ValidPasswordFormat } from '../ResetPasswordForm/ResetPasswordForm';
import { useIntl } from 'react-intl';
import messages from '../../../views/app-views/UserSettings/messages';
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
  const { formatMessage } = useIntl();

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
              {formatMessage(messages.formCancelButton)}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmit}
              htmlType="submit"
              disabled={!dirty || !isValid || loading}
            >
              {formatMessage(messages.formConfirmationButton)}
            </Button>,
          ]}
        >
          {loadginData ? (
            <Loading />
          ) : (
            <Form layout="vertical" name="login-form">
              <Field
                label={formatMessage(messages.formName)}
                component={FormField}
                name="name"
                autoFocus
              />
              <Field
                label={formatMessage(messages.formEmail)}
                component={FormField}
                name="username"
              />
              <Field
                label={formatMessage(messages.formPassword)}
                component={FormField}
                name="password"
                tooltipText={ValidPasswordFormat}
                secureField
                errorTexts={{
                  label: formatMessage(messages.formPassword),
                  minValue: passwordMinLength,
                  matchesLabel: formatMessage(messages.passwordValidFormat),
                }}
              />
              <Field
                label={formatMessage(messages.formConfirmPassword)}
                component={FormField}
                name="confirmPassword"
                secureField
                errorTexts={{
                  label: formatMessage(messages.formConfirmPassword),
                  minValue: passwordMinLength,
                  matchesLabel: formatMessage(messages.passwordValidFormat),
                  value: formatMessage(messages.formPassword),
                }}
              />
            </Form>
          )}
        </Modal>
      )}
    </Formik>
  );
};

export default UserSettingsFormModal;
