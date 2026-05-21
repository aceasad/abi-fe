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
import { useDispatch } from 'react-redux';
import Appointments from '../StaffPage/Appointments';
import overviewPageMessages from '../OverviewPage/messages';
import patientPageMessages from '../PatientsPage/messages';
import { LIKELY_TO_BE_MISSED, SCHEDULED } from 'redux/reducers/Staff';
import { getSingleAppointment } from 'redux/actions/Appointment';
import AppointmentPreview from '../CalendarPage/AppointmentPreview';
import { FROM_OVERVIEW_APPOINTMENTS } from 'constants/ClinicConstants';
import { DownOutlined } from '@ant-design/icons';
import { setPatientShowMessages } from 'redux/actions/Patient';
import {
  convertDateTimeStringToUtcString,
  removeLeadingZeroFromTime,
} from 'utils/helpers';
import { ROUTES } from 'routes';
import { useHistory } from 'react-router-dom';
import UpdateAppointmentCommunicationStatus from '../CalendarPage/UpdateAppointmentCommunicationStatus';
import dayjs from 'utils/dayjs';

const { Panel } = Collapse;

// for sorting to be feasible: the name of the attribute should be the name in dataIndex (if object concat with underscore '_') and
// the value should be the name of actual field in the database as field or table__field = django wise
const columnMap = {
  // id: 'id',
  patient_full_name: 'patient__last_name',
  doctor_full_name: 'doctor__last_name',
  date: 'start_datetime',
  time: 'start_datetime',
  communication_status_name: 'communication_status__name',
  status_name: 'status__name',
  patient_whitelisted: 'patient__whitelisted',
};

export const NESTED_MODAL = {
  NONE: 0,
  UPDATE_APPOINTMENT_COMMUNICATION_STATUS: 1,
};

const AppointmentsLikelyToBeMissed = ({ title, startOpen }) => {
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

  const showUpdateAppointmentCommunicationStatus = (data) => {
    setShowChildModal({
      modal: NESTED_MODAL.UPDATE_APPOINTMENT_COMMUNICATION_STATUS,
      data,
    });
  };

  const showUpdateAppointmentCommunicationStatusWrapper = (e, row) => {
    e.stopPropagation();
    showUpdateAppointmentCommunicationStatus({
      appointment: row,
    });
  };

  const collapseHeader = (
    <div className="d-flex justify-content-between align-items-center">
      <Typography.Title level={3} className="text-primary mb-0">
        {title}
      </Typography.Title>
      <DownOutlined
        className={`collapse-arrow-custom ${isCollapseOpen ? 'open' : ''}`}
      />
    </div>
  );

  const getMenuItems = (row) => {
    return [
      {
        key: "0",
        label: overviewPageMessages.tableDropdownSeeAppointment,
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          setActiveAppointment({
            id: row.id,
            type: SCHEDULED,
            patientId: row.patient.id,
            appointment: row,
          });
        },
      },
      {
        key: "1",
        label: overviewPageMessages.tableDropdownAiReachout,
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          goToPatientShowMessages({ id: row.patient.id });
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
      title: patientPageMessages.columnTitlePatient,
      dataIndex: ['patient', 'full_name'],
      sorter: true,
    },
    {
      title: patientPageMessages.columnTitleAppointment,
      sorter: true,
      dataIndex: ['doctor', 'full_name'],
      render: (_, row) => (
        <div className="text-left">
          {`${row.doctor.full_name} `}
        </div>
      ),
    },
    {
      title: patientPageMessages.columnTitleDate,
      dataIndex: 'date',
      sorter: true,
    },
    {
      title: patientPageMessages.columnTitleTime,
      dataIndex: 'time',
      sorter: true,
      render: (_, row) => (
        <div className="text-uppercase">
          {removeLeadingZeroFromTime(
            dayjs(row.time, ['h:mm A']).format('hh:mm A')
          )}
        </div>
      ),
    },
    {
      title: patientPageMessages.columnTitleCommunicationStatus,
      dataIndex: ['communication_status', 'name'],
      sorter: true,
      render: (_, row) => (
        <div
          className="text-left"
          onClick={(e) =>
            showUpdateAppointmentCommunicationStatusWrapper(e, row)
          }
        >
          {row.communication_status.name} <CaretDownOutlined />
        </div>
      ),
    },
    {
      title: patientPageMessages.columnTitleStatus,
      dataIndex: ['status', 'name'],
      sorter: true,
    },
    {
      title: patientPageMessages.columnTitleWhitelisted,
      dataIndex: ['patient', 'whitelisted'],
      sorter: true,
      render: (_, row) => (
        <div className="text-left">
          {row.patient.whitelisted ? 'Yes' : 'No'}
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
              {overviewPageMessages.tableDropdownTitleContact}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
    },
    // {
    //   title: '',
    //   dataIndex: 'actions',
    //   render: (_, row) => (
    //     <div className="text-right">
    //       <Space>
    //         <Tooltip
    //           title={//             patientPageMessages.columnTitleReachOutToPatient
    //}
    //         >
    //           <Button
    //             icon={<WhatsAppOutlined />}
    //             onClick={(e) => {
    //               e.stopPropagation();
    //               goToPatientShowMessages({ id: row.patient.id });
    //             }}
    //             size="small"
    //           />
    //         </Tooltip>
    //       </Space>
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      <Appointments field={LIKELY_TO_BE_MISSED} id={''} columnMap={columnMap}>
        <Appointments.Table
          columns={tableColumns}
        // onRow={(record) => {
        //   return {
        //     onClick: () => {
        //       setActiveAppointment({
        //         id: record.id,
        //         type: LIKELY_TO_BE_MISSED,
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
            temporalType: LIKELY_TO_BE_MISSED,
            actionFrom: FROM_OVERVIEW_APPOINTMENTS,
          }}
          patientId={activeAppointment.patientId}
          staffId={1}
          appointment_type={LIKELY_TO_BE_MISSED}
          appointment={activeAppointment.appointment}
        />
      )}
      {showChildModal.modal ===
        NESTED_MODAL.UPDATE_APPOINTMENT_COMMUNICATION_STATUS && (
          <UpdateAppointmentCommunicationStatus
            handleClose={showPreview}
            id={showChildModal.data.appointment.id}
            patientId={showChildModal.data.appointment.patient.id}
            appointment_type={LIKELY_TO_BE_MISSED}
            updateCommunicationStatusFrom={FROM_OVERVIEW_APPOINTMENTS}
            staffId={''}
            appointment={showChildModal.data.appointment}
          />
        )}
    </>
  );
};

export default AppointmentsLikelyToBeMissed;
