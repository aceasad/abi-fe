import React, { useState, useEffect } from 'react';
import { Card, Collapse, Typography } from 'antd';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import Appointments from '../StaffPage/Appointments';
import messages from '../PatientsPage/messages';
import { LIKELY_TO_BE_MISSED, SCHEDULED } from 'redux/reducers/Staff';
import { getSingleAppointment } from 'redux/actions/Appointment';
import AppointmentPreview from '../CalendarPage/AppointmentPreview';
import { FROM_STAFF_APPOINTMENTS } from 'constants/ClinicConstants';
import { RenderPredictionText } from 'utils/helpers';
import { DownOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const columnMap = {
  date: 'start_datetime',
  patient_full_name: 'patient__last_name,patient__first_name',
  doctor_full_name: 'doctor__last_name,doctor__first_name',
  appointment_type_name: 'appointment_type__name',
};

const AppointmentsLikelyToBeMissed = ({ title, startOpen }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [activeAppointment, setActiveAppointment] = useState(null);

  useEffect(() => {
    activeAppointment && dispatch(getSingleAppointment(activeAppointment.id));
  }, [activeAppointment]);

  const [isCollapseOpen, setIsCollapseOpen] = useState(startOpen);

  const collapseHeader = (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <Typography.Title level={3} className="text-primary mb-0">
          {title}
        </Typography.Title>
        <DownOutlined
          className={`collapse-arrow-custom ${isCollapseOpen ? 'open' : ''}`}
        />
      </div>
    </>
  );

  return (
    <Collapse
      expandIconPosition="right"
      ghost
      className="mb-4"
      onChange={() => setIsCollapseOpen(!isCollapseOpen)}
      defaultActiveKey={startOpen ? ['1'] : null}
    >
      <Panel
        key="1"
        className="overview-collapse"
        header={collapseHeader}
        showArrow={false}
      >
        <Card className="mt-4 shadow-basic">
          <Appointments
            field={LIKELY_TO_BE_MISSED}
            id={''}
            columnMap={columnMap}
          >
            <Appointments.Table
              columns={[
                {
                  title: formatMessage(messages.columnTitleDate),
                  dataIndex: 'date',
                  sorter: true,
                },
                {
                  title: formatMessage(messages.columnTitleTime),
                  dataIndex: 'time',
                  sorter: false,
                },
                {
                  title: formatMessage(messages.columnTitlePatient),
                  dataIndex: ['patient', 'full_name'],
                  sorter: true,
                },
                {
                  title: formatMessage(messages.columnTitleDoctor),
                  dataIndex: ['doctor', 'full_name'],
                  sorter: true,
                },
                {
                  title: formatMessage(messages.columnTitleAppointment),
                  dataIndex: ['appointment_type', 'name'],
                  sorter: true,
                },
                {
                  title: formatMessage(messages.columnTitleNoShowScore),
                  dataIndex: 'no_show_score',
                  sorter: true,
                  render: (text) => (
                    <div className="text-center">{Number(text) * 100}%</div>
                  ),
                },
              ]}
              onRow={(record) => {
                return {
                  onClick: () => {
                    setActiveAppointment({
                      id: record.id,
                      type: SCHEDULED,
                      patientId: record.patient.id,
                    });
                  },
                };
              }}
            />
          </Appointments>
          {activeAppointment && (
            <AppointmentPreview
              handleClose={() => setActiveAppointment(null)}
              aditionalSubmitData={{
                temporalType: activeAppointment.type,
                actionFrom: FROM_STAFF_APPOINTMENTS,
              }}
              patientId={activeAppointment.patientId}
              staffId={1}
              appointment_type={activeAppointment.type}
            />
          )}
        </Card>
      </Panel>
    </Collapse>
  );
};

export default AppointmentsLikelyToBeMissed;
