import { Badge, Button, Card, Col, Row } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import {
  LeftOutlined,
  EditOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import React from 'react';
import FormImageUpload from 'components/custom-components/Form/FormImageUpload';
import { Field, Formik } from 'formik';
import Form from 'antd/lib/form/Form';
import Flex from 'components/shared-components/Flex';
import { Typography } from 'antd';
import FormCheckbox from 'components/custom-components/Form/FormCheckbox';
import localeString from 'utils/localeString';
import PatientOverviewDetails from './PatientOverviewDetails';
import PatientOverviewScheduledCard from './PatientOverviewScheduledCard';
import PatientOverviewHistoryCard from './PatientOverviewHistoryCard';

const { Text, Title } = Typography;

const patientDummy = {
  first_name: 'John',
  last_name: 'Doe',
  date_of_birth: '19/02/1989',
  sex: 'Male',
  ethnicity: 'Caucasian',
  height: '184cm',
  weight: '86kg',
  phone_number: '+381 123123',
  area: 'New York',
  marital_status: 'Never Married',
  number_of_dependants: '0',
  employment_status: 'Employed',
  educational_background: 'Tertiary',
  insurance: 'Cigna Connect 8550 1-Bronze',
};

const dummyDataScheduled = [
  {
    key: '1',
    date: '20/01/2021',
    time: '9:00 am',
    doctor: 'Cheryl Huges (Senior DO)',
    type: 'Routine',
    prediction: 'Likely to be missed',
  },
  {
    key: '2',
    date: '20201/2021',
    time: '5:00 pm',
    doctor: 'Marm Downey (Senior Endocrinologist)',
    type: 'Specialized',
    prediction: 'Likely to be attended',
  },
];

const dummyDataHistory = [
  {
    key: '1',
    date: '20/01/2021',
    time: '9:00 am',
    doctor: 'Cheryl Huges (Senior DO)',
    type: 'Routine',
    status: 'Scheduled',
  },
  {
    key: '2',
    date: '20201/2021',
    time: '5:00 pm',
    doctor: 'Marm Downey (Senior Endocrinologist)',
    type: 'Specialized',
    status: 'Attended',
  },
  {
    key: '3',
    date: '20/01/2021',
    time: '9:00 am',
    doctor: 'Cheryl Huges (Senior DO)',
    type: 'Routine',
    status: 'Rescheduled',
  },
  {
    key: '4',
    date: '20201/2021',
    time: '5:00 pm',
    doctor: 'Marm Downey (Senior Endocrinologist)',
    type: 'Specialized',
    status: 'Cancelled',
  },
];

const PatientOverview = ({ localization = true }) => {
  const patientDetailsFields = [
    'date_of_birth',
    'sex',
    'ethnicity',
    'height',
    'weight',
    'phone_number',
    'area',
    'marital_status',
    'number_of_dependants',
    'employment_status',
    'educational_background',
    'insurance',
  ];

  return (
    <Layout>
      <Content className="m-4">
        <Row gutter={16}>
          <Col span={7}>
            <Card>
              <Flex
                justifyContent="between"
                alignItems="center"
                className="mb-4"
              >
                <div className="text-primary cursor-pointer">
                  <LeftOutlined />
                  <Text underline className="text-primary ml-2">
                    {localeString(
                      localization,
                      'patient_overview.back_to_patients'
                    )}
                  </Text>
                </div>
                <div className="cursor-pointer">
                  <EditOutlined />
                </div>
              </Flex>
              <Formik
                initialValues={{
                  profile_picture: '',
                  whitelisted: '',
                }}
                // Console log to show that values are gathered.
                onSubmit={(values) => console.log(values)}
              >
                <Form>
                  <Row gutter={[0, 16]} className="mb-4">
                    <Col span={24}>
                      <Field
                        isSubmit={true}
                        component={FormImageUpload}
                        name="profile_picture"
                      />
                    </Col>
                    <Col span={24}>
                      <Title level={3} className="text-center">
                        {patientDummy.first_name} {patientDummy.last_name}
                      </Title>
                    </Col>
                    <Col span={24}>
                      <div className="border d-flex justify-content-center form-item-no-margin">
                        <Field
                          isSubmit={true}
                          name="whitelisted"
                          component={FormCheckbox}
                          label="Whitelisted"
                        />
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Formik>
              <PatientOverviewDetails
                fields={patientDetailsFields}
                patient={patientDummy}
              />
            </Card>
          </Col>

          <Col span={17}>
            <Layout>
              <Flex
                justifyContent="between"
                alignItems="center"
                className="ml-4 mr-4 mb-4"
              >
                <Title level={2} className="mb-0">
                  {localeString(localization, 'patient_overview.title')}
                </Title>
                <Badge count={7}>
                  <Button type="primary">
                    <WhatsAppOutlined />{' '}
                    <span>
                      {localeString(
                        localization,
                        'patient_overview.button.messages'
                      )}
                    </span>
                  </Button>
                </Badge>
              </Flex>
              <Content>
                <PatientOverviewScheduledCard
                  patientData={dummyDataScheduled}
                  localization={localization}
                />
                <PatientOverviewHistoryCard
                  patientData={dummyDataHistory}
                  localization={localization}
                />
              </Content>
            </Layout>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default PatientOverview;
