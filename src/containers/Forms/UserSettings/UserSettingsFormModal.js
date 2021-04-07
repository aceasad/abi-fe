import { Button } from 'antd';
import Form from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import FormField from 'components/custom-components/Form/FormField';
import { Field, Formik } from 'formik';
import React from 'react';
import { ValidPasswordFormat } from '../ResetPasswordForm/ResetPasswordForm';
import { useIntl } from 'react-intl';
import messages from '../../../views/app-views/UserSettings/messages';
import { userSchema } from 'utils/validations';
import { passwordMinLength } from 'constants/Validation';

const UserSettingsFormModal = ({ isModalVisible, closeModal, title }) => {
  const { formatMessage } = useIntl();

  return (
    <Formik
      initialValues={{
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
      }}
      onSubmit={(values) => console.log(values)}
      validationSchema={userSchema}
    >
      {({ values, handleSubmit, dirty, isValid }) => (
        <Modal
          title={title}
          style={{ maxWidth: '24rem', top: '2rem' }}
          visible={isModalVisible}
          closable={false}
          footer={[
            <Button key="back" onClick={closeModal}>
              {formatMessage(messages.formCancelButton)}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => handleSubmit(values)}
              htmlType="submit"
              disabled={!dirty || !isValid}
            >
              {formatMessage(messages.formConfirmationButton)}
            </Button>,
          ]}
        >
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
        </Modal>
      )}
    </Formik>
  );
};

export default UserSettingsFormModal;
