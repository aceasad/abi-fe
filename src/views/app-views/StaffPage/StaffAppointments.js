import { PageHeader, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectStaff } from 'redux/selectors/Staff';
import Appointments from './Appointments';
import messages from '../PatientsPage/messages';
import { HISTORY, SCHEDULED } from 'redux/reducers/Staff';
import { getSingleAppointment } from 'redux/actions/Appointment';
import AppointmentPreview from '../CalendarPage/AppointmentPreview';
import { FROM_STAFF_APPOINTMENTS } from 'constants/ClinicConstants';
import { RenderPredictionText } from 'utils/helpers';

const STATUS_OPTIONS = {
  SCHEDULED: 'Scheduled',
  ATTENDED: 'Attended',
  RESCHEDULED: 'Rescheduled',
  CANCELLED: 'Cancelled',
};

const columnMap = {
  date: 'start_datetime',
  patient_full_name: 'patient__last_name,patient__first_name',
  appointment_type_name: 'appointment_type__name',
  status_name: 'status__name',
};

export const statusColor = (status) => {
  switch (status) {
    case STATUS_OPTIONS.SCHEDULED:
      return (
        <Typography.Text className="text-primary">{status}</Typography.Text>
      );
    case STATUS_OPTIONS.ATTENDED:
      return <Typography.Text type="success">{status}</Typography.Text>;
    case STATUS_OPTIONS.RESCHEDULED:
      return <Typography.Text type="warning">{status}</Typography.Text>;
    case STATUS_OPTIONS.CANCELLED:
      return <Typography.Text type="secondary">{status}</Typography.Text>;
    default:
      return <Typography.Text>{status}</Typography.Text>;
  }
};

const StaffAppointments = ({ staffId, showList }) => {
  const { staff } = useSelector(makeSelectStaff());
  const staffData = staff.find((obj) => {
    return obj.id === staffId;
  });
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [activeAppointment, setActiveAppointment] = useState(null);

  useEffect(() => {
    activeAppointment && dispatch(getSingleAppointment(activeAppointment.id));
  }, [activeAppointment]);

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        onBack={() => showList()}
        avatar={{ src: staffData.profile_picture }}
        title={`${staffData.first_name} ${staffData.last_name}`}
        subTitle={`${staffData.seniority} ${staffData.specialization}`}
      />
      <Appointments field={SCHEDULED} id={staffId} columnMap={columnMap}>
        <Appointments.Table
          title={formatMessage(messages.cardTitleScheduledAppointments)}
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
              title: formatMessage(messages.columnTitleType),
              dataIndex: ['appointment_type', 'name'],
              sorter: true,
            },
            {
              title: formatMessage(messages.columnTitlePrediction),
              dataIndex: 'no_show_score',
              sorter: true,
              render: RenderPredictionText,
            },
            {
              title: formatMessage(messages.columnTitleStatus),
              dataIndex: ['status', 'name'],
              sorter: true,
              render: statusColor,
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
      <Appointments field={HISTORY} id={staffId} columnMap={columnMap}>
        <Appointments.Table
          title={formatMessage(messages.staffPastAppointments)}
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
              title: formatMessage(messages.columnTitleType),
              dataIndex: ['appointment_type', 'name'],
              sorter: true,
            },
            {
              title: formatMessage(messages.columnTitlePrediction),
              dataIndex: 'no_show_score',
              sorter: true,
              render: RenderPredictionText,
            },
            {
              title: formatMessage(messages.columnTitleStatus),
              dataIndex: ['status', 'name'],
              sorter: true,
              render: statusColor,
            },
          ]}
          onRow={(record) => {
            return {
              onClick: () => {
                setActiveAppointment({
                  id: record.id,
                  type: HISTORY,
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
          staffId={staffId}
          appointment_type={activeAppointment.type}
        />
      )}
    </>
  );
};

export default StaffAppointments;
