import { Button } from 'antd';
import Form from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import FormField from 'components/custom-components/Form/FormField';
import { Field, Formik } from 'formik';
import React from 'react';
import { ValidPasswordFormat } from '../ResetPasswordForm/ResetPasswordForm';
import { useIntl } from 'react-intl';

const UserSettingsFormModal = ({ isModalVisible, closeModal, title }) => {
  const { formatMessage } = useIntl();

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        passwordRepeat: '',
      }}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, handleSubmit, dirty, isValid }) => (
        <Modal
          title={title}
          style={{ maxWidth: '24rem', top: '2rem' }}
          visible={isModalVisible}
          closable={false}
          footer={[
            <Button key="back" onClick={closeModal}>
              {formatMessage({ id: 'user_settings.form.button.cancel' })}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => handleSubmit(values)}
              htmlType="submit"
              disabled={!dirty || !isValid}
            >
              {formatMessage({ id: 'user_settings.form.button.confirm' })}
            </Button>,
          ]}
        >
          <Form layout="vertical" name="login-form">
            <Field
              label={formatMessage({ id: 'user_settings.form.name' })}
              component={FormField}
              name={'name'}
              errorTexts={'Error test here'}
            />
            <Field
              label={formatMessage({ id: 'user_settings.form.email' })}
              component={FormField}
              name={'email'}
              type="email"
              errorTexts={'Error test here'}
            />
            <Field
              label={formatMessage({ id: 'user_settings.form.password' })}
              component={FormField}
              name={'password'}
              tooltipText={ValidPasswordFormat}
              secureField
              errorTexts={'Error test here'}
            />
            <Field
              label={formatMessage({
                id: 'user_settings.form.confirm_password',
              })}
              component={FormField}
              name={'passwordRepeat'}
              secureField
              errorTexts={'Error test here'}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default UserSettingsFormModal;
