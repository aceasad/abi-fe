import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Dropdown,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
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
import { Link, useHistory } from 'react-router-dom';
import { formatDateTimeByCountry, formatHomeLocationDisplay } from 'utils/helpers';
import UpdateMessageRequiringImmediateAttentionStatus from './UpdateMessageRequiringImmediateAttentionStatus';
import PreAppointmentQuestionnairePreviewModal from './PreAppointmentQuestionnairePreviewModal';
import MessageRequiringImmediateAttentionStatusSelect from './MessageRequiringImmediateAttentionStatusSelect';
import {
  getMessageRequiringImmediateAttentionStatuses,
} from 'redux/actions/Appointment';
import {
  makeSelectMessageRequiringImmediateAttentionStatuses,
} from 'redux/selectors/Appointment';
import { makeSelectClinic } from 'redux/selectors/Clinic';

const columnMap = {
  created_datetime: 'created_datetime',
};

/** Edit these values (px) to tune Human Intervention Needed column max-widths */
const HUMAN_INTERVENTION_COLUMN_MAX_WIDTHS = {
  dateTime: 150,
  patient: 180,
  location: 280,
  event: 180,
  status: 180,
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

const getPatientLocation = (row) =>
  row?.patient?.location
  ?? row?.patient?.home_location
  ?? row?.location;

export const NESTED_MODAL = {
  NONE: 0,
  UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS: 1,
};

const MessagesRequiringImmediateAttention = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const clinic = useSelector(makeSelectClinic());
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const { messageRequiringImmediateAttentionStatuses } = useSelector(
    makeSelectMessageRequiringImmediateAttentionStatuses()
  );

  const [activeAppointment, setActiveAppointment] = useState(null);
  useEffect(() => {
    if (activeAppointment) {
      dispatch(getSingleAppointment(activeAppointment.id));
    }
  }, [activeAppointment, dispatch]);

  useEffect(() => {
    if (messageRequiringImmediateAttentionStatuses.length === 0) {
      dispatch(getMessageRequiringImmediateAttentionStatuses());
    }
  }, [dispatch, messageRequiringImmediateAttentionStatuses.length]);

  const [showChildModal, setShowChildModal] = useState({
    modal: NESTED_MODAL.NONE,
    data: null,
    preselectedStatusId: null,
  });

  const showPreview = () =>
    setShowChildModal({
      modal: NESTED_MODAL.NONE,
      data: null,
      preselectedStatusId: null,
    });

  const showUpdateMessageRequiringImmediateAttentionStatus = (
    data,
    preselectedStatusId = null
  ) => {
    setShowChildModal({
      modal: NESTED_MODAL.UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS,
      data,
      preselectedStatusId,
    });
  };

  const showUpdateMessageRequiringImmediateAttentionStatusWrapper = (
    e,
    row,
    preselectedStatusId = null
  ) => {
    e.stopPropagation();
    showUpdateMessageRequiringImmediateAttentionStatus(row, preselectedStatusId);
  };

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
        <Link
          to={`/pages/conversation/${row.patient.id}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {row.patient.full_name}
        </Link>
      ),
      onCell: () => ({
        'data-label': "Patient",
      }),
    }),
    ...(isMedbridge
      ? [withColumnMaxWidth('location', {
        title: "Location",
        key: 'location',
        dataIndex: ['patient', 'location'],
        render: (_, row) => (
          <div>{formatHomeLocationDisplay(getPatientLocation(row))}</div>
        ),
        onCell: () => ({
          'data-label': "Location",
        }),
      })]
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
        <MessageRequiringImmediateAttentionStatusSelect
          row={row}
          onOpenStatusModal={showUpdateMessageRequiringImmediateAttentionStatus}
        />
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
  ], [clinic?.country, messageRequiringImmediateAttentionStatuses, isMedbridge]);

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

  const goToPatientShowMessages = (data) => {
    dispatch(setPatientShowMessages(data));
    history.push(ROUTES.PATIENTS);
  };

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
            preselectedStatusId={showChildModal.preselectedStatusId}
          />
        )
      }
    </>
  );
};

export default MessagesRequiringImmediateAttention;
