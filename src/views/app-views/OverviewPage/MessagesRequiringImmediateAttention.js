import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Collapse,
  Button,
  Space,
  Typography,
  Tooltip,
  Menu,
  Dropdown,
  Tag,
} from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import MessagesRequiringImmediateAttentionTable from './MessagesRequiringImmediateAttentionTable';
import {
  MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
  SCHEDULED,
} from 'redux/reducers/Staff';
import {
  getSingleAppointment,
  getSinglePreAppointmentQuestionnaire,
} from 'redux/actions/Appointment';
import AppointmentPreview from '../CalendarPage/AppointmentPreview';
import {
  FROM_OVERVIEW_APPOINTMENTS,
  FROM_STAFF_APPOINTMENTS,
} from 'constants/ClinicConstants';
import { DownOutlined } from '@ant-design/icons';
import { setPatientShowMessages } from 'redux/actions/Patient';
import { ROUTES } from 'routes';
import { useHistory } from 'react-router-dom';
import { formatDateTimeByCountry, getSafe } from 'utils/helpers';
import UpdateMessageRequiringImmediateAttentionStatus from './UpdateMessageRequiringImmediateAttentionStatus';
import PreAppointmentQuestionnairePreviewModal from './PreAppointmentQuestionnairePreviewModal';
import patient from 'redux/reducers/Patient';
import { useSelector } from 'react-redux';
import { makeSelectClinic } from 'redux/selectors/Clinic';
const { Panel } = Collapse;

const columnMap = {
  created_datetime: 'created_datetime',
};

/** Edit these values (px) to tune Human Intervention Needed column max-widths */
const HUMAN_INTERVENTION_COLUMN_MAX_WIDTHS = {
  dateTime: 180,
  patient: 180,
  location: 320,
  event: 220,
  status: 130,
  actions: 110,
};

const withColumnMaxWidth = (widthKey, column) => {
  const maxWidth = HUMAN_INTERVENTION_COLUMN_MAX_WIDTHS[widthKey];
  const existingOnCell = column.onCell;

  return {
    ...column,
    width: maxWidth,
    ellipsis: widthKey !== 'actions',
    onHeaderCell: () => ({
      style: { maxWidth },
    }),
    onCell: (...args) => ({
      ...(typeof existingOnCell === 'function' ? existingOnCell(...args) : existingOnCell || {}),
      style: { maxWidth },
    }),
  };
};

const getHomeLocationDisplay = (homeLocation) => {
  if (!homeLocation) return '-';

  if (typeof homeLocation === 'object') {
    if (homeLocation.location_name && homeLocation.location_id) {
      return `${homeLocation.location_name} (${homeLocation.location_id})`;
    }
    return homeLocation.location_name || homeLocation.location_id || '-';
  }

  return homeLocation;
};

export const NESTED_MODAL = {
  NONE: 0,
  UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS: 1,
};

const MessagesRequiringImmediateAttention = ({ title, startOpen }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const clinic = useSelector(makeSelectClinic());

  const [activeAppointment, setActiveAppointment] = useState(null);
  useEffect(() => {
    if (activeAppointment) {
      dispatch(getSingleAppointment(activeAppointment.id));
    }
  }, [activeAppointment, dispatch]);

  // Removed duplicate dispatch - this is now handled by the parent OverviewPage component

  const tableColumns = useMemo(() => [
    withColumnMaxWidth('dateTime', {
      title: 'Date/Time',
      dataIndex: 'created_datetime',
      sorter: true,
      render: (_, row) => (
        <div>
          {
            formatDateTimeByCountry(
              row.created_datetime,
              clinic?.country,
              'h:mm A',
              [
                'DD/MM/YYYY HH:mm:ss A',
                'MM/DD/YYYY HH:mm:ss A',
                'YYYY-MM-DDTHH:mm:ss',
                'YYYY-MM-DDTHH:mm:ss.SSSZ',
                'YYYY-MM-DD HH:mm:ss',
              ]
            )
          }
        </div>
      ),
      onCell: () => ({
        'data-label': 'Date/Time',
      }),
    }),
    withColumnMaxWidth('patient', {
      title: "Patient",
      dataIndex: ['patient', 'full_name'],
      render: (_, row) => (
        <Typography.Link
          onClick={(e) => {
            e.stopPropagation();
            goToPatientShowMessages({ id: row.patient.id });
          }}
        >
          {row.patient.full_name}
        </Typography.Link>
      ),
      onCell: () => ({
        'data-label': "Patient",
      }),
    }),
    ...(isMedbridge
      ? [
        withColumnMaxWidth('location', {
          title: "Location",
          dataIndex: ['patient', 'home_location'],
          render: (_, row) => (
            <div>{getHomeLocationDisplay(row.patient?.home_location)}</div>
          ),
          onCell: () => ({
            'data-label': "Location",
          }),
        }),
      ]
      : []),
    withColumnMaxWidth('event', {
      title: "Event",
      dataIndex: ['message_requiring_immediate_attention_type', 'name'],
      render: (_, row) => _,
      onCell: () => ({
        'data-label': "Event",
      }),
    }),
    // {
    //   title: "Priority",
    //   dataIndex: ['priority', 'name'],
    //   sorter: true,
    //   render: (_, row) => (
    //     <div
    //       className={`mria-priority-${getSafe(() =>
    //         row.priority?.name.toLowerCase()
    //       )}`}
    //     >
    //       {row.priority?.name}
    //     </div>
    //   ),
    //   onCell: () => ({
    //     'data-label': "Priority",
    //   }),
    // },
    withColumnMaxWidth('status', {
      title: "Status",
      dataIndex: ['status', 'name'],
      render: (_, row) => (
        <div
          onClick={(e) =>
            showUpdateMessageRequiringImmediateAttentionStatusWrapper(e, row)
          }
          className={`ant-tag text-left${row.status?.name === 'Pending' ? ' ant-tag-red' : ''
            }`}
        >
          {row.status?.name} {/*  <CaretDownOutlined /> */}
        </div>
      ),
      onCell: () => ({
        'data-label': "Status",
      }),
    }),
    withColumnMaxWidth('actions', {
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
    }),
  ], [clinic?.country, isMedbridge]);

  const [
    activePreAppointmentQuestionnaire,
    setActivePreAppointmentQuestionnaire,
  ] = useState(null);
  useEffect(() => {
    if (activePreAppointmentQuestionnaire) {
      console.error(activePreAppointmentQuestionnaire);
      dispatch(
        getSinglePreAppointmentQuestionnaire(
          activePreAppointmentQuestionnaire.appointment_id
        )
      );
    }
  }, [activePreAppointmentQuestionnaire, dispatch]);

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

  const showUpdateMessageRequiringImmediateAttentionStatus = (data) => {
    setShowChildModal({
      modal: NESTED_MODAL.UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS,
      data,
    });
  };

  const showUpdateMessageRequiringImmediateAttentionStatusWrapper = (
    e,
    row
  ) => {
    // alert('Coming Soon!');
    // return;
    e.stopPropagation();
    showUpdateMessageRequiringImmediateAttentionStatus(row);
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
    const items = [
      {
        key: "1",
        label: "Patient info",
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          goToPatientShowMessages({ id: row.patient.id });
        },
      },
    ];

    if (row.appointment) {
      items.push({
        key: "0",
        label: "Appointment info",
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          setActiveAppointment({
            id: row.appointment,
            type: SCHEDULED,
            patientId: row.patient.id,
          });
        },
      });
    }

    if (row.pre_appointment_questionnaire) {
      items.push({
        key: "3",
        label: "Pre-appointment question info",
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          setActivePreAppointmentQuestionnaire({
            appointment_id: row?.appointment,
          });
        },
      });
    }

    items.push({
      key: "2",
      label: "Change status",
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation();
        showUpdateMessageRequiringImmediateAttentionStatusWrapper(
          domEvent,
          row
        );
      },
    });

    return items;
  };



  return (
    <>
      <MessagesRequiringImmediateAttentionTable
        field={MESSAGES_REQUIRING_IMMEDIATE_ATTENTION}
        id={''}
        columnMap={columnMap}
      >
        <MessagesRequiringImmediateAttentionTable.Table
          columns={tableColumns}
        // onRow={(record) => {
        //   return {
        //     onClick: () => {
        //       setActiveAppointment({
        //         id: record.id,
        //         type: SCHEDULED,
        //         patientId: record.patient.id,
        //       });
        //     },
        //   };
        // }}
        />
      </MessagesRequiringImmediateAttentionTable>
      {activeAppointment && (
        <AppointmentPreview
          handleClose={() => setActiveAppointment(null)}
          additionalSubmitData={{
            temporalType: activeAppointment.type,
            actionFrom: FROM_STAFF_APPOINTMENTS,
          }}
          patientId={activeAppointment.patientId}
          staffId={1}
          appointment_type={activeAppointment.type}
        />
      )}
      {activePreAppointmentQuestionnaire && (
        <PreAppointmentQuestionnairePreviewModal
          handleClose={() => setActivePreAppointmentQuestionnaire(null)}
        />
      )}
      {showChildModal.modal ===
        NESTED_MODAL.UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS && (
          <UpdateMessageRequiringImmediateAttentionStatus
            handleClose={showPreview}
            id={showChildModal.data.id}
            patientId={showChildModal.data?.patient?.id}
            updateMessageRequiringImmediateAttentionStatusFrom={
              FROM_OVERVIEW_APPOINTMENTS
            }
            staffId={''}
            messageRequiringImmediateAttention={showChildModal.data}
          />
        )
      }
    </>
  );
};

export default MessagesRequiringImmediateAttention;
