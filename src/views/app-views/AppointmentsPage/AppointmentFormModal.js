import { Formik, Field } from 'formik';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Row, Col, Form, Card, Button, Modal } from 'antd';
import FormDatePicker from 'components/custom-components/Form/FormDatePicker';
import FormSelect from 'components/custom-components/Form/FormSelect';
import FormNumberField from 'components/custom-components/Form/FormNumberField';
import { useDispatch, useSelector } from 'react-redux';
import { searchPatients } from 'redux/actions/Appointment';
import messages from './messages';
import Loading from 'components/shared-components/Loading';
import FormAutocomplete from 'components/custom-components/Form/FormAutocomplete';
import { useDebounce } from 'utils/hooks';
import { makeSelectClinicPatients } from 'redux/selectors/Appointment';
import DirtyFieldWrapper from 'components/custom-components/Form/DirtyFieldWrapper';
import TimeslotTimePicker from 'components/custom-components/Form/TimeslotTimePicker';
import { Link } from 'react-router-dom';

const AppointmentFormModal = ({
  initialState,
  doctors,
  appointmentTypes,
  isEditForm,
  appointmentStatus,
  closeModal,
  title,
  validationSchema,
  handleSubmit,
  loadingData,
  isModalVisible,
  loading,
  appointment,
}) => {
  const { formatMessage } = useIntl();

  const dispatch = useDispatch();

  const afterAppointmentTypeSelect = (setFieldValue, fieldName, value) => {
    setFieldValue(
      fieldName,
      appointmentTypes.find((type) => type.id === value)[fieldName]
    );
  };
  const [query, setQuery] = useState('');
  const debouncedSearch = useDebounce(query, 500);

  const { patients } = useSelector(makeSelectClinicPatients());

  useEffect(() => {
    if (query) {
      dispatch(searchPatients({ query }));
    }
  }, [debouncedSearch]);

  return (
    <Formik
      initialValues={initialState}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, handleSubmit, dirty, isValid, setFieldTouched, touched }) => (
        <Modal
          title={title}
          visible={isModalVisible}
          destroyOnClose={true}
          closable={false}
          footer={[
            <Button
              key="back"
              onClick={closeModal}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            >
              {formatMessage(messages.cancelButton)}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmit}
              htmlType="submit"
              disabled={!dirty || !isValid || loading}
            >
              {formatMessage(messages.saveButton)}
            </Button>,
          ]}
        >
          {loadingData ? (
            <Loading />
          ) : (
            <Card>
              <Form
                layout="vertical"
                name="appointment-form"
                className="ml-sm-3"
              >
                <Row>
                  <Col xs={18}>
                    <Field
                      component={FormAutocomplete}
                      label={formatMessage(messages.patientLabel)}
                      name="patient"
                      required
                      placeholder={formatMessage(messages.searchPlaceholder)}
                      setQuery={setQuery}
                      options={patients}
                      optionField="full_name"
                      query={query}
                      defaultValue={isEditForm && appointment.patient.full_name}
                    />
                  </Col>
                  <Col>
                    <Link to={'patients'}>{'+'}</Link>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Field
                      label={formatMessage(messages.doctorLabel)}
                      name="doctor"
                      component={FormSelect}
                      options={doctors}
                      optionField="full_name"
                      defaultOption={
                        doctors &&
                        doctors.find((option) => option.id === values.doctor)
                      }
                      required
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} lg={12}>
                    <Field
                      label={formatMessage(messages.appointmentTypeLabel)}
                      name="appointmentType"
                      component={FormSelect}
                      options={appointmentTypes}
                      optionField="name"
                      defaultOption={
                        appointmentTypes &&
                        appointmentTypes.find(
                          (option) => option.id === values.appointmentType
                        )
                      }
                      afterSelectChange={afterAppointmentTypeSelect}
                      afterSelectChangeFieldName="price"
                      required
                    />
                  </Col>
                  <Col xs={24} lg={12}>
                    <DirtyFieldWrapper
                      setFieldDirty={setFieldTouched}
                      name="price"
                      dependencies={[touched.appointmentType]}
                    >
                      <Field
                        component={FormNumberField}
                        label={formatMessage(messages.priceLabel)}
                        name="price"
                        placeholder={formatMessage(messages.priceLabel)}
                        required
                        decimals={2}
                      />
                    </DirtyFieldWrapper>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} lg={12}>
                    <Field
                      component={FormDatePicker}
                      label={formatMessage(messages.dateLabel)}
                      name="date"
                      disablePastDates
                      showDefaultDate={isEditForm}
                      required
                    />
                  </Col>
                  <Col xs={24} lg={12}>
                    <Field
                      component={TimeslotTimePicker}
                      label={formatMessage(messages.timeLabel)}
                      name="time"
                      required
                      showDefaultTime={isEditForm}
                    />
                  </Col>
                </Row>
                {isEditForm && (
                  <Row>
                    <Col xs={24}>
                      <Field
                        label={formatMessage(messages.appointmentStatus)}
                        name="status"
                        component={FormSelect}
                        options={appointmentStatus}
                        optionField="name"
                        defaultOption={
                          appointmentStatus &&
                          appointmentStatus.find(
                            (option) => option.id === values.status
                          )
                        }
                        required
                      />
                    </Col>
                  </Row>
                )}
              </Form>
            </Card>
          )}
        </Modal>
      )}
    </Formik>
  );
};

AppointmentFormModal.defaultProops = {
  initialState: {
    patient: '',
    doctor: '',
    appointmentType: '',
    price: 0,
    date: '',
    time: '',
  },
  doctors: [],
  appointmentTypes: [],
  isEditForm: false,
  appointmentStatus: [],
  loadingData: false,
};

export default AppointmentFormModal;
