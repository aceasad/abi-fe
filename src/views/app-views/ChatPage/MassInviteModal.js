import { Button, Col, Row } from 'antd';
import Form from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import FormGroupCheckbox from 'components/custom-components/Form/FormGroupCheckbox';
import FormNumberField from 'components/custom-components/Form/FormNumberField';
import FormSelect from 'components/custom-components/Form/FormSelect';
import RowColumnField from 'components/custom-components/Form/RowColumnField';
import { Field, Formik } from 'formik';
import React from 'react';
import { massInviteSchema } from 'utils/validations';
import { GENDER } from 'constants/UserConstants';
import messages from './messages';
import { useIntl } from 'react-intl';
import {
  MASS_INVITE_MAX_AGE,
  MASS_INVITE_MIN_AGE,
} from 'constants/ChatConstants';
import TextArea from 'antd/lib/input/TextArea';
import { message } from 'antd';

const MassInviteModal = ({ isModalVisible, closeModal }) => {
  const { formatMessage } = useIntl();

  const initialState = {
    ageFrom: '',
    ageTo: '',
    gender: [],
    template: '',
    appointmentType: '',
  };

  const GENDER_CHOICES = [
    { value: GENDER.MALE, label: formatMessage(messages.male) },
    { value: GENDER.FEMALE, label: formatMessage(messages.female) },
    { value: GENDER.OTHER, label: formatMessage(messages.other) },
  ];

  const MESSAGE_TEMPLATES = [
    { id: 1, text: 'Immunization template' },
    { id: 2, text: 'Screening template' },
    { id: 3, text: 'Universal template' },
  ];

  const APPOINTMENT_TYPES = [
    { id: 1, name: 'Immunization' },
    { id: 2, name: 'Screening' },
  ];

  const handleSubmit = () => {
    message.success(formatMessage(messages.inviteSent));
    closeModal();
  };

  return (
    <Formik
      initialValues={initialState}
      validationSchema={massInviteSchema}
      validateOnMount
    >
      {({ values, dirty, isValid, resetForm }) => (
        <Modal
          title={formatMessage(messages.massInvitesLabel)}
          visible={isModalVisible}
          destroyOnClose
          onCancel={() => closeModal()}
          afterClose={resetForm}
          footer={[
            <Button key="cancel-btn" onClick={() => closeModal()}>
              {formatMessage(messages.cancelButton)}
            </Button>,
            <Button
              key="submit"
              type="primary"
              disabled={!dirty || !isValid}
              onClick={handleSubmit}
            >
              {formatMessage(messages.sendButton)}
            </Button>,
          ]}
        >
          <Form
            layout="vertical"
            name="mass-invites-form"
            className="ml-3 mr-3"
          >
            <Row gutter={16} className="d-flex">
              <Col xs={24} lg={12}>
                <Field
                  component={FormNumberField}
                  label={formatMessage(messages.ageFromLabel)}
                  name="ageFrom"
                  placeholder={formatMessage(messages.ageFromLabel)}
                  required
                  errorTexts={{
                    label: formatMessage(messages.ageFromLabel),
                    minNumber: MASS_INVITE_MIN_AGE,
                    maxNumber: MASS_INVITE_MAX_AGE,
                  }}
                />
              </Col>
              <Col xs={24} lg={12}>
                <Field
                  component={FormNumberField}
                  label={formatMessage(messages.ageToLabel)}
                  name="ageTo"
                  placeholder={formatMessage(messages.ageToLabel)}
                  errorTexts={{
                    label: formatMessage(messages.ageFromLabel),
                    minNumber: MASS_INVITE_MIN_AGE,
                    maxNumber: MASS_INVITE_MAX_AGE,
                    thisLabel: formatMessage(messages.ageToLabel),
                    anotherLabel: formatMessage(messages.ageFromLabel),
                  }}
                  required
                />
              </Col>
            </Row>
            <RowColumnField
              span={24}
              label={formatMessage(messages.genderLabel)}
              name="gender"
              component={FormGroupCheckbox}
              options={GENDER_CHOICES}
              required
            />
            <RowColumnField
              span={24}
              label={formatMessage(messages.appointmentTypeLabel)}
              name="appointmentType"
              component={FormSelect}
              options={APPOINTMENT_TYPES}
              optionField="name"
              defaultOption={values.appointmentType}
              required
            />
            <RowColumnField
              span={24}
              label={formatMessage(messages.templateLabel)}
              name="template"
              component={FormSelect}
              options={MESSAGE_TEMPLATES}
              optionField="text"
              defaultOption={values.template}
              required
            />
            {values.template && (
              <RowColumnField
                span={24}
                component={TextArea}
                disabled
                rows={5}
                value={
                  MESSAGE_TEMPLATES.find((item) => item.id === values.template)[
                    'text'
                  ]
                }
              />
            )}
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default MassInviteModal;
