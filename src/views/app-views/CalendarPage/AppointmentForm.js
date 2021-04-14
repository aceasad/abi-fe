import { Formik, Field } from 'formik';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Row, Col, Form, Card, Button } from 'antd';
import FormField from 'components/custom-components/Form/FormField';
import FormDatePicker from 'components/custom-components/Form/FormDatePicker';
import FormSelect from 'components/custom-components/Form/FormSelect';
import { useDispatch, useSelector } from 'react-redux';
import { appointmentValidationSchema } from 'utils/validations';
import FormTimePicker from 'components/custom-components/Form/FormTimePicker';
import moment from 'moment';
import { prepareFormData } from 'utils/helpers';
import { createAppointment } from 'redux/actions/Appointment';
import messages from './messages';

const prepareAppointmentData = (values) => {
  const startDatetime = moment(
    `${values.date} ${values.time}`,
    'DD-MMM-YYYY HH:mm'
  ).format();
  delete values.date;
  delete values.time;
  values.patient = parseInt(values.patient);
  values.price = parseFloat(values.price);
  const preparedData = prepareFormData({ ...values, startDatetime });
  return preparedData;
};

const AppointmentForm = ({
  initialState = {
    patient: '',
    doctor: '',
    appointmentType: '',
    price: 0,
    date: '',
    time: '',
  },
  doctors,
  patients,
  appointmentTypes,
}) => {
  const { formatMessage } = useIntl();

  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    const data = prepareAppointmentData(values);
    dispatch(createAppointment(data));
  };

  return (
    <Formik
      initialValues={initialState}
      validationSchema={appointmentValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleSubmit, dirty, isValid }) => (
        <>
          <Card>
            <Form layout="vertical" name="appointment-form" className="ml-sm-3">
              <Row>
                <Col xs={6}>
                  <Field
                    component={FormField}
                    label={formatMessage(messages.patientLabel)}
                    name="patient"
                    autoFocus
                  />
                </Col>
                <Col>
                  <Button>Plus</Button>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <Field
                    label={formatMessage(messages.doctorLabel)}
                    name="doctor"
                    component={FormSelect}
                    options={doctors}
                    optionField="first_name"
                    defaultOptions={
                      doctors &&
                      doctors.find((option) => option.id === values.doctor)
                    }
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={24} lg={6}>
                  <Field
                    component={FormDatePicker}
                    label={formatMessage(messages.dateLabel)}
                    name="date"
                    disablePastDates
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Field
                    component={FormTimePicker}
                    label={formatMessage(messages.timeLabel)}
                    name="time"
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={24} lg={6}>
                  <Field
                    label={formatMessage(messages.appointmentTypeLabel)}
                    name="appointmentType"
                    component={FormSelect}
                    options={appointmentTypes}
                    optionField="name"
                    defaultOptions={
                      appointmentTypes &&
                      appointmentTypes.find(
                        (option) => option.id === values.appointmentType
                      )
                    }
                    required
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Field
                    component={FormField}
                    label={formatMessage(messages.priceLabel)}
                    name="price"
                  />
                </Col>
              </Row>
              <Row>
                <Button
                  type="primary"
                  name="submit"
                  //disabled={loading || !dirty || !isValid}
                  disabled={!dirty || !isValid}
                  onClick={handleSubmit}
                >
                  {formatMessage(messages.createButton)}
                </Button>
              </Row>
            </Form>
          </Card>
        </>
      )}
    </Formik>
  );
};

export default AppointmentForm;
