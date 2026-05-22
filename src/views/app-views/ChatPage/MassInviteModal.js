import { Button, Card, Col, Row } from 'antd';
import Form from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import FormGroupCheckbox from 'components/custom-components/Form/FormGroupCheckbox';
import FormNumberField from 'components/custom-components/Form/FormNumberField';
import FormSelect from 'components/custom-components/Form/FormSelect';
import RowColumnField from 'components/custom-components/Form/RowColumnField';
import { Field, Formik } from 'formik';
import React, { useState } from 'react';
import { massInviteSchema } from 'utils/validations';
import { GENDER } from 'constants/UserConstants';
import {
  MASS_INVITE_MAX_AGE,
  MASS_INVITE_MIN_AGE,
} from 'constants/ChatConstants';
import TextArea from 'antd/lib/input/TextArea';
import { message } from 'antd';
import PatientCountField from './PatientCountField';
import { useDispatch } from 'react-redux';
import { sendMassInvite } from 'redux/actions/Chats';
import {
  useGetAppointmentTypes,
  useGetMassInviteMessageTemplates,
} from 'queries/shared';

const MassInviteModal = ({ isModalVisible, closeModal }) => {

  const dispatch = useDispatch();
  const initialState = {
    ageFrom: '',
    ageTo: '',
    gender: [],
    template: '',
    appointmentType: '',
  };

  const GENDER_CHOICES = [
    { value: GENDER.MALE, label: "Male" },
    { value: GENDER.FEMALE, label: "Female" },
    { value: GENDER.OTHER, label: "Other" },
  ];

  const [templates, setTemplates] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [numberOfInvites, setNumberOfInvites] = useState(0);

  useGetMassInviteMessageTemplates(setTemplates);
  useGetAppointmentTypes(setAppointmentTypes);

  const handleSubmit = (values) => {
    const obj = {
      message_template: values.template,
      age_from: Number(values.ageFrom),
      age_to: Number(values.ageTo),
      appointment_type: values.appointmentType,
      genders: values.gender,
    };

    dispatch(sendMassInvite(obj));
    message.success("Mass invite sent!");
    closeModal();
  };

  return (
    <Formik
      initialValues={initialState}
      validationSchema={massInviteSchema}
      validateOnMount
      onSubmit={handleSubmit}
    >
      {({ values, dirty, isValid, resetForm, handleSubmit }) => (
        <Modal
          title={"Mass invites"}
          open={isModalVisible}
          destroyOnHidden
          onCancel={() => closeModal()}
          afterClose={resetForm}
          footer={[
            <Button key="cancel-btn" onClick={() => closeModal()}>
              {"Cancel"}
            </Button>,
            <Button
              key="submit"
              type="primary"
              disabled={!dirty || !isValid || !numberOfInvites}
              onClick={handleSubmit}
            >
              {"Send"}
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
                  label={"Age from"}
                  name="ageFrom"
                  placeholder={"Age from"}
                  required
                  errorTexts={{
                    label: "Age from",
                    minNumber: MASS_INVITE_MIN_AGE,
                    maxNumber: MASS_INVITE_MAX_AGE,
                  }}
                />
              </Col>
              <Col xs={24} lg={12}>
                <Field
                  component={FormNumberField}
                  label={"Age to"}
                  name="ageTo"
                  placeholder={"Age to"}
                  errorTexts={{
                    label: "Age to",
                    minNumber: MASS_INVITE_MIN_AGE,
                    maxNumber: MASS_INVITE_MAX_AGE,
                    thisLabel: "Age to",
                    anotherLabel: "Age from",
                  }}
                  required
                />
              </Col>
            </Row>
            <RowColumnField
              span={24}
              label={"Gender"}
              name="gender"
              component={FormGroupCheckbox}
              options={GENDER_CHOICES}
              required
            />
            {!!values.ageFrom && !!values.ageTo && !!values.gender.length && (
              <RowColumnField
                span={24}
                component={PatientCountField}
                setNumberOfInvites={setNumberOfInvites}
              />
            )}
            <RowColumnField
              span={24}
              label={"Appointment type"}
              name="appointmentType"
              component={FormSelect}
              options={appointmentTypes}
              optionField="name"
              defaultOption={values.appointmentType}
              required
            />
            <RowColumnField
              span={24}
              label={"Template"}
              name="template"
              component={FormSelect}
              options={templates}
              optionField="title"
              defaultOption={values.template}
              required
            />
            {values.template && (
              <Card>
                {templates.find((item) => item.id === values.template)['text']}
              </Card>
            )}
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default MassInviteModal;
