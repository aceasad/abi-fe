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
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import MessagesRequiringImmediateAttentionTable from './MessagesRequiringImmediateAttentionTable';
import overviewPageMessages from './messages';
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
import { getSafe } from 'utils/helpers';
import UpdateMessageRequiringImmediateAttentionStatus from './UpdateMessageRequiringImmediateAttentionStatus';
import PreAppointmentQuestionnairePreviewModal from './PreAppointmentQuestionnairePreviewModal';
import patient from 'redux/reducers/Patient';

const { Panel } = Collapse;

const columnMap = {
  created_datetime: 'created_datetime',
  patient_full_name: 'patient__last_name,patient__first_name',
  message_requiring_immediate_attention_type_name:
    'message_requiring_immediate_attention_type_name__name',
  resolved: 'resolved',
};

export const NESTED_MODAL = {
  NONE: 0,
  UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS: 1,
};

const MessagesRequiringImmediateAttention = ({ title, startOpen }) => {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [activeAppointment, setActiveAppointment] = useState(null);
  useEffect(() => {
    if (activeAppointment) {
      dispatch(getSingleAppointment(activeAppointment.id));
    }
  }, [activeAppointment, dispatch]);

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
    alert('Coming Soon!');
    return;

    e.stopPropagation();
    showUpdateMessageRequiringImmediateAttentionStatus({
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

  const menu = (row) => {
    return (
      <Menu>
        <Menu.Item
          key="1"
          onClick={({ domEvent }) => {
            domEvent.stopPropagation();
            goToPatientShowMessages({ id: row.patient.id });
          }}
        >
          {formatMessage(overviewPageMessages.tableDropdownPatientInfo)}
        </Menu.Item>
        {row.appointment && (
          <Menu.Item
            key="0"
            onClick={({ domEvent }) => {
              domEvent.stopPropagation();
              setActiveAppointment({
                id: row.appointment,
                type: SCHEDULED,
                patientId: row.patient.id,
              });
            }}
          >
            {formatMessage(overviewPageMessages.tableDropdownAppointmentInfo)}
          </Menu.Item>
        )}
        {row.pre_appointment_questionnaire && (
          <Menu.Item
            key="1"
            onClick={({ domEvent }) => {
              domEvent.stopPropagation();
              setActivePreAppointmentQuestionnaire({
                appointment_id: row?.appointment,
              });
            }}
          >
            {formatMessage(
              overviewPageMessages.tableDropdownPreAppointmentQuestionnaireInfo
            )}
          </Menu.Item>
        )}
        <Menu.Item
          key="1"
          onClick={({ domEvent }) => {
            domEvent.stopPropagation();
            showUpdateMessageRequiringImmediateAttentionStatusWrapper(
              domEvent,
              row.id
            );
          }}
        >
          {formatMessage(
            overviewPageMessages.tableDropdownUpdateMessageRequiringImmediateAttentionStatus
          )}
        </Menu.Item>
      </Menu>
    );
  };

  const tableColumns = [
    {
      title: formatMessage(overviewPageMessages.columnTitleTimestamp),
      dataIndex: 'created_datetime',
      sorter: true,
    },
    {
      title: formatMessage(overviewPageMessages.columnTitlePatient),
      dataIndex: ['patient', 'full_name'],
      sorter: true,
    },
    {
      title: formatMessage(overviewPageMessages.columnTitleEvent),
      dataIndex: ['message_requiring_immediate_attention_type', 'name'],
      sorter: true,
    },
    {
      title: formatMessage(overviewPageMessages.columnTitlePriority),
      dataIndex: ['priority', 'name'],
      sorter: true,
      render: (_, row) => (
        <div
          className={`mria-priority-${getSafe(() =>
            row.priority?.name.toLowerCase()
          )}`}
        >
          {row.priority?.name}
        </div>
      ),
    },
    {
      title: formatMessage(overviewPageMessages.columnTitleStatus),
      dataIndex: ['status', 'name'],
      sorter: true,
      render: (_, row) => (
        <div
          onClick={(e) =>
            showUpdateMessageRequiringImmediateAttentionStatusWrapper(e, row)
          }
          className={`text-left${
            row.status?.name === 'Pending' ? ' blink' : ''
          }`}
        >
          {row.status?.name} <CaretDownOutlined />
        </div>
      ),
    },
    {
      key: 'action',
      render: (_, row) => (
        <div className="text-right">
          <Dropdown
            overlay={() => menu(row)}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="primary" ghost>
              {formatMessage(overviewPageMessages.tableDropdownTitleActions)}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

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
          )}
        </Card>
      </Panel>
    </Collapse>
  );
};

export default MessagesRequiringImmediateAttention;
