import React, { useState, useEffect } from 'react';
import {
  Card,
  Collapse,
  Button,
  Space,
  Typography,
  Tooltip,
  Menu,
  Dropdown,
} from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import Appointments from '../StaffPage/Appointments';
import {
  HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE,
  SCHEDULED,
} from 'redux/reducers/Staff';
import { getSingleAppointment } from 'redux/actions/Appointment';
import AppointmentPreview from '../CalendarPage/AppointmentPreview';
import {
  FROM_OVERVIEW_APPOINTMENTS,
  FROM_STAFF_APPOINTMENTS,
} from 'constants/ClinicConstants';
import { DownOutlined } from '@ant-design/icons';
import { setPatientShowMessages } from 'redux/actions/Patient';
import { ROUTES } from 'routes';
import { useHistory } from 'react-router-dom';
import FormSelect from 'components/custom-components/Form/FormSelect';
import { Field } from 'formik';
import {
  getAppointmentStatuses,
  saveAppointmentStatus,
} from 'redux/actions/Appointment';
import { makeSelectAppointmentStatuses } from 'redux/selectors/Appointment';
import RowWithMultipleColumns from 'components/util-components/Grid/RowWithMultipleColumns';
import { getAppointments } from 'redux/actions/Staff';
import EndAppointment from '../CalendarPage/EndAppointment';
import dayjs from 'utils/dayjs';
import { removeLeadingZeroFromTime } from 'utils/helpers';

const { Panel } = Collapse;

const columnMap = {
  // id: 'id',
  patient_full_name: 'patient__last_name',
  doctor_full_name: 'doctor__last_name',
  date: 'start_datetime',
  time: 'start_datetime',
};

export const NESTED_MODAL = {
  NONE: 0,
  UPDATE_APPOINTMENT_STATUS: 1,
};

const PassedAppointmentsRequiringImmediateStatusUpdate = ({
  title,
  startOpen,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [activeAppointment, setActiveAppointment] = useState(null);

  useEffect(() => {
    if (activeAppointment) {
      dispatch(getSingleAppointment(activeAppointment.id));
    }
  }, [activeAppointment, dispatch]);

  const [isCollapseOpen, setIsCollapseOpen] = useState(startOpen);

  const goToPatientShowMessages = (data) => {
    dispatch(setPatientShowMessages(data));
    history.push(ROUTES.PATIENTS);
  };

  const [showChildModal, setShowChildModal] = useState({
    modal: NESTED_MODAL.NONE,
    data: null,
  });

  const showPreview = () =>
    setShowChildModal({ modal: NESTED_MODAL.NONE, data: null });

  const showUpdateAppointmentStatus = (data) => {
    setShowChildModal({
      modal: NESTED_MODAL.UPDATE_APPOINTMENT_STATUS,
      data,
    });
  };

  const showUpdateAppointmentStatusWrapper = (e, row) => {
    e.stopPropagation();
    showUpdateAppointmentStatus({
      appointment: row,
    });
  };

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

  const getMenuItems = (row) => {
    return [
      {
        key: "0",
        label: "See appointment",
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          setActiveAppointment({
            id: row.id,
            type: HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE,
            patientId: row.patient.id,
          });
        },
      },
      {
        key: "1",
        label: "Message",
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          goToPatientShowMessages({ id: row.patient.id });
        },
      },
      {
        key: "2",
        label: "Change status",
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          showUpdateAppointmentStatusWrapper(domEvent, row);
        },
      },
    ];
  };

  const tableColumns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   sorter: true,
    // },
    // (${row.doctor.seniority} ${row.doctor.specialization})
    {
      title: "Patient",
      dataIndex: ['patient', 'full_name'],
      sorter: true,
    },
    {
      title: "Staff Member",
      dataIndex: ['doctor', 'full_name'],
      sorter: true,
      render: (_, row) => (
        <div className="text-left">
          {`${row.doctor.full_name}`}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: 'date',
      sorter: true,
    },
    {
      title: "Time",
      dataIndex: 'time',
      sorter: true,
      render: (_, row) => (
        <div>
          {removeLeadingZeroFromTime(
            dayjs(row.time, ['h:mm A']).format('hh:mm A')
          )}
        </div>
      ),
    },
    {
      key: 'action',
      render: (_, row) => (
        <div className="text-right">
          <Dropdown
            menu={{ items: getMenuItems(row) }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="primary" ghost>
              {"Actions"}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      <Appointments
        field={HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE}
        id={''}
        columnMap={columnMap}
      >
        <Appointments.Table
          columns={tableColumns}
        // onRow={(record) => {
        //   return {
        //     onClick: () => {
        //       setActiveAppointment({
        //         id: record.id,
        //         type: HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE,
        //         patientId: record.patient.id,
        //       });
        //     },
        //   };
        // }}
        />
      </Appointments>
      {activeAppointment && (
        <AppointmentPreview
          handleClose={() => setActiveAppointment(null)}
          additionalSubmitData={{
            temporalType: HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE,
            actionFrom: FROM_OVERVIEW_APPOINTMENTS,
          }}
          patientId={activeAppointment.patientId}
          staffId={1}
          appointment_type={HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE}
        />
      )}
      {showChildModal.modal === NESTED_MODAL.UPDATE_APPOINTMENT_STATUS && (
        <EndAppointment
          handleClose={showPreview}
          id={showChildModal.data.appointment.id}
          patientId={showChildModal.data.appointment.patient.id}
          appointment_type={HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE}
          endFrom={FROM_OVERVIEW_APPOINTMENTS}
          staffId={''}
        />
      )}
    </>
  );
};

export default PassedAppointmentsRequiringImmediateStatusUpdate;
