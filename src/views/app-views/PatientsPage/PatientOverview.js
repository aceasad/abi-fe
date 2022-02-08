import { Badge, Button, Card, Col, Row } from 'antd';
import {
  LeftOutlined,
  EditOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import FormImageUpload from 'components/custom-components/Form/FormImageUpload';
import { Field, Formik } from 'formik';
import Form from 'antd/lib/form/Form';
import Flex from 'components/shared-components/Flex';
import { Typography } from 'antd';
import FormCheckbox from 'components/custom-components/Form/FormCheckbox';
import PatientOverviewDetails from './PatientOverviewDetails';
import PatientOverviewScheduledCard from './PatientOverviewScheduledCard';
import PatientOverviewHistoryCard from './PatientOverviewHistoryCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  changePatient,
  clearPatientShowMessages,
  getPatientOverview,
} from 'redux/actions/Patient';
import { makeSelectPatientOverview } from 'redux/selectors/Patient';
import Loading from 'components/shared-components/Loading';
import { PATIENT_PAGE } from './index';
import { prepareFormData } from 'utils/helpers';
import messages from './messages';
import Conversation from '../ChatPage/Conversation';
import PatientOverviewExistingConditions from './PatientOverviewExistingConditions';
import PatientOverviewPreviousOperations from './PatientOverviewPreviousOperations';
import { getSingleAppointment } from 'redux/actions/Appointment';
import AppointmentPreview from '../CalendarPage/AppointmentPreview';
import { FROM_PATIENT_APPOINTMENTS } from 'constants/ClinicConstants';

const { Text, Title } = Typography;

const PatientOverview = ({
  patientId,
  showList,
  updatePatient,
  patient_show_messages,
}) => {
  const dispatch = useDispatch();
  const { patient, loading } = useSelector(makeSelectPatientOverview());
  const [showMessages, setShowMessages] = useState();
  const { formatMessage } = useIntl();

  const [activeAppointmnet, setActiveAppointment] = useState(null);

  useEffect(() => {
    if (activeAppointmnet) dispatch(getSingleAppointment(activeAppointmnet.id));
  }, [activeAppointmnet]);

  useEffect(() => {
    if (patient_show_messages) {
      setShowMessages(true);
      dispatch(clearPatientShowMessages());
    }
  }, [patient_show_messages]);

  const patientDetailsFields = {
    date_of_birth: formatMessage(messages.dateOfBirth),
    gender: formatMessage(messages.sex),
    ethnicity: formatMessage(messages.ethnicity),
    height: formatMessage(messages.height),
    weight: formatMessage(messages.weight),
    phone_number: formatMessage(messages.phoneNumber),
    email: formatMessage(messages.email),
    street_number: formatMessage(messages.streetNumber),
    street_name: formatMessage(messages.streetName),
    area_of_living: formatMessage(messages.areaOfLiving),
    city: formatMessage(messages.city),
    post_code: formatMessage(messages.postCode),
    country: formatMessage(messages.country),
    material_status: formatMessage(messages.materialStatus),
    number_of_dependants: formatMessage(messages.numberOfDependants),
    employment: formatMessage(messages.employmentStatus),
    education: formatMessage(messages.education),
    insurance: formatMessage(messages.insurance),
    last_appointment: formatMessage(messages.lastAppointment),
  };

  useEffect(() => {
    dispatch(getPatientOverview({ id: patientId }));
  }, [dispatch, patientId]);

  const handleSubmit = (values) => {
    const preparedData = prepareFormData(values);
    if (!(values.picture instanceof File)) preparedData.delete('picture');
    dispatch(
      changePatient({
        id: patientId,
        data: preparedData,
      })
    );
  };

  useEffect(() => {
    dispatch(getPatientOverview({ id: patientId }));
  }, [dispatch, patientId]);

  return (
    <Row gutter={16}>
      <Col span={7}>
        <Card>
          <Flex justifyContent="between" alignItems="center" className="mb-4">
            <div className="text-primary cursor-pointer" onClick={showList}>
              <LeftOutlined />
              <Text underline className="text-primary ml-2">
                {formatMessage(messages.backToPatients)}
              </Text>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => updatePatient(patientId, PATIENT_PAGE.PREVIEW)}
            >
              <EditOutlined />
              <Text underline className="text-primary ml-2">
                {formatMessage(messages.editPatient)}
              </Text>
            </div>
          </Flex>
          {!patient || loading ? (
            <Loading defaultSpinner />
          ) : (
            <>
              <Formik
                initialValues={{
                  picture: patient.picture,
                  whitelisted: patient.whitelisted,
                }}
                onSubmit={handleSubmit}
              >
                <Form>
                  <Row gutter={[0, 16]} className="mb-4">
                    <Col span={24}>
                      <Field
                        isSubmit
                        component={FormImageUpload}
                        name="picture"
                      />
                    </Col>
                    <Col span={24}>
                      <Title level={3} className="text-center">
                        {patient.first_name} {patient.last_name}
                      </Title>
                    </Col>
                    <Col span={24}>
                      <div className="border d-flex justify-content-center form-item-no-margin">
                        <Field
                          isSubmit
                          name="whitelisted"
                          component={FormCheckbox}
                          label="whitelisted"
                        />
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Formik>
              <PatientOverviewDetails
                fields={patientDetailsFields}
                patient={{
                  ...patient,
                  education: patient?.education?.name,
                  ethnicity: patient?.ethnicity?.name,
                  material_status: patient?.material_status?.name,
                  employment: patient?.employment?.name,
                }}
              />
            </>
          )}
        </Card>
      </Col>

      <Col span={17}>
        {showMessages ? (
          <>
            <Title level={2} className="ml-3 mr-4 mb-4">
              {formatMessage(messages.messages)}
            </Title>
            <div className="chat inner-app-layout">
              <div className="main-content">
                <Conversation
                  showTitle={false}
                  conversationId={patientId}
                  isMenuVisible={false}
                  BackAction={() => (
                    <div
                      className="cursor-pointer"
                      onClick={() => setShowMessages(false)}
                    >
                      <LeftOutlined />
                      <Text className="ml-2">
                        {formatMessage(messages.backToOverview)}
                      </Text>
                    </div>
                  )}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <Flex
              justifyContent="between"
              alignItems="center"
              className="ml-3 mr-4 mb-4"
            >
              <Title level={2} className="mb-0">
                {formatMessage(messages.overviewTittle)}
              </Title>
              <Badge>
                <Button type="primary" onClick={() => setShowMessages(true)}>
                  <WhatsAppOutlined />{' '}
                  <span>{formatMessage(messages.overviewButtonMessages)}</span>
                </Button>
              </Badge>
            </Flex>
            <PatientOverviewScheduledCard
              patient={patient}
              showAppointment={setActiveAppointment}
            />
            <PatientOverviewExistingConditions patientId={patientId} />
            <PatientOverviewPreviousOperations patientId={patientId} />
            <PatientOverviewHistoryCard
              patient={patient}
              showAppointment={setActiveAppointment}
            />
          </>
        )}
      </Col>
      {activeAppointmnet && (
        <AppointmentPreview
          handleClose={() => setActiveAppointment(null)}
          patientId={patientId}
          appointment_type={activeAppointmnet.type}
          additionalSubmitData={{
            patientAppointment: activeAppointmnet.type,
            actionFrom: FROM_PATIENT_APPOINTMENTS,
          }}
        />
      )}
    </Row>
  );
};

export default PatientOverview;
