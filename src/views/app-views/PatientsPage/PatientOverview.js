import { Badge, Button, Card, Col, Row, Grid } from 'antd';
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
import { formatDateByCountry, prepareFormData } from 'utils/helpers';
import messages from './messages';
import Conversation from '../ChatPage/Conversation';
import PatientOverviewExistingConditions from './PatientOverviewExistingConditions';
import PatientOverviewPreviousOperations from './PatientOverviewPreviousOperations';
import { getSingleAppointment } from 'redux/actions/Appointment';
import AppointmentPreview from '../CalendarPage/AppointmentPreview';
import { FROM_PATIENT_APPOINTMENTS } from 'constants/ClinicConstants';
import utils from 'utils';
import { makeSelectClinic } from 'redux/selectors/Clinic';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const PatientOverview = ({
  patientId,
  showList,
  updatePatient,
  patient_show_messages,
}) => {
  const dispatch = useDispatch();
  const { patient, loading } = useSelector(makeSelectPatientOverview());
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const [showMessages, setShowMessages] = useState();
  const { formatMessage } = useIntl();
  const clinic = useSelector(makeSelectClinic());
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const isEmis = PASProvider?.toLowerCase() === 'emis';
  const shouldHideDobAndGender = isMedbridge || isEmis;

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
    ...(!shouldHideDobAndGender
      ? {
          date_of_birth: formatMessage(messages.dateOfBirth),
          gender: formatMessage(messages.sex),
        }
      : {}),
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
    ...(isMedbridge ? { home_location: formatMessage(messages.homeLocation) } : {}),
  };

  const getHomeLocationDisplay = (homeLocation) => {
    if (!homeLocation) return '';

    if (typeof homeLocation === 'object') {
      if (homeLocation.location_name && homeLocation.location_id) {
        return `${homeLocation.location_name} (${homeLocation.location_id})`;
      }
      return homeLocation.location_name || homeLocation.location_id || '';
    }

    return homeLocation;
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
    <div style={{ paddingTop: isMobile ? 0 : '24px' }}>
      <Row gutter={isMobile ? 12 : 16}>
        <Col xs={24} lg={7}>
          <Card>
            <Flex
              justifyContent="between"
              alignItems="center"
              className="mb-4"
              style={{ flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? '12px' : 0 }}
            >
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
                    date_of_birth: formatDateByCountry(
                      patient?.date_of_birth,
                      clinic?.country,
                      [
                        'DD/MM/YYYY',
                        'D/M/YYYY',
                        'MM/DD/YYYY',
                        'M/D/YYYY',
                        'YYYY-MM-DD',
                      ]
                    ),
                    last_appointment: formatDateByCountry(
                      patient?.last_appointment,
                      clinic?.country,
                      [
                        'DD/MM/YYYY',
                        'D/M/YYYY',
                        'MM/DD/YYYY',
                        'M/D/YYYY',
                        'YYYY-MM-DD',
                      ]
                    ),
                    education: patient?.education?.name,
                    ethnicity: patient?.ethnicity?.name,
                    material_status: patient?.material_status?.name,
                    employment: patient?.employment?.name,
                    home_location: isMedbridge
                      ? getHomeLocationDisplay(patient?.home_location)
                      : patient?.home_location,
                  }}
                />
              </>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={17} style={{ marginTop: isMobile ? '16px' : 0 }}>
          {showMessages ? (
            <>
              <Title level={3} className="ml-3 mr-4 mb-4">
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
                className={isMobile ? 'mb-4' : 'ml-3 mr-4 mb-4'}
                style={{ flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? '12px' : 0 }}
              >
                <Title level={3} className="mb-0" style={{ fontSize: isMobile ? '20px' : '28px' }}>
                  {formatMessage(messages.overviewTittle)}
                </Title>
                <Badge>
                  <Button
                    type="primary"
                    onClick={() => setShowMessages(true)}
                    icon={<WhatsAppOutlined />}
                    size={isMobile ? 'small' : 'middle'}
                  >
                    {!isMobile && <span>{formatMessage(messages.overviewButtonMessages)}</span>}
                    {isMobile && <span>Messages</span>}
                  </Button>
                </Badge>
              </Flex>
              <PatientOverviewScheduledCard
                patient={patient}
                showAppointment={setActiveAppointment}
              />
              {/* <PatientOverviewExistingConditions patientId={patientId} />
            <PatientOverviewPreviousOperations patientId={patientId} /> */}
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
    </div>
  );
};

export default PatientOverview;
