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
  Select
} from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import AppointmentsRemindersTable from './AppointmentsRemindersTable';
import overviewPageMessages from '../OverviewPage/messages';
import { SCHEDULED, UPCOMING_REMINDERS } from 'redux/reducers/Staff';
import { getSingleAppointment } from 'redux/actions/Appointment';
import AppointmentPreview from '../CalendarPage/AppointmentPreview';
import { FROM_STAFF_APPOINTMENTS } from 'constants/ClinicConstants';
import { DownOutlined } from '@ant-design/icons';
import { setPatientShowMessages } from 'redux/actions/Patient';
import { ROUTES } from 'routes';
import { useHistory } from 'react-router-dom';
import {
  cancelAppointmentReminder,
  reverseAppointmentReminderCancellation,
  rescheduleAppointmentReminder,
} from 'redux/actions/Staff';
import { removeLeadingZeroFromTime } from 'utils/helpers';
import moment from 'moment';

const { Panel } = Collapse;

const columnMap = {
  // appointment_id: 'appointment__id',
  patient_full_name: 'appointment__patient__last_name',
  doctor_full_name: 'appointment__doctor__last_name',
  appointment_date: 'appointment__start_datetime',
  reminder_message_template: 'message_template__name',
  reminder_date: 'reminder_datetime',
  reminder_status: 'status__name',
};

const isIsoDate = (str) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(str)) {
    return false;
  }
  const d = new Date(str);
  return d.toISOString() === str;
};

const AppointmentsReminders = ({ title, startOpen }) => {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [activeAppointment, setActiveAppointment] = useState(null);
  const [reminderType, setReminderType] = useState('appointment');
  const handleReminderTypeChange = (value) => {
    setReminderType(value);
  };

  useEffect(() => {
    if (activeAppointment) {
      dispatch(getSingleAppointment(activeAppointment.id));
    }
  }, [activeAppointment, dispatch]);

  const [cancelReminderId, setCancelReminderId] = useState(null);
  useEffect(() => {
    if (cancelReminderId) {
      dispatch(
        cancelAppointmentReminder({
          id: '',
          cancelReminderId,
          field: UPCOMING_REMINDERS,
          reminderType,
        })
      );
    }
  }, [cancelReminderId, dispatch]);

  const cancelReminder = (row) => {
    if (
      window.confirm(
        `Reminder: ${row.reminder.message_template}\n\nPatient: ${row.patient.full_name}\n\nScheduled on: ${row.reminder.date} ${row.reminder.time}\n\nAre you sure that you want to cancel the reminder?`
      )
    ) {
      setCancelReminderId(row.reminder.id);
    }
  };

  const [
    reverseReminderCancellationId,
    setReverseReminderCancellationId,
  ] = useState(null);
  useEffect(() => {
    if (reverseReminderCancellationId) {
      dispatch(
        reverseAppointmentReminderCancellation({
          id: '',
          reverseReminderCancellationId,
          field: UPCOMING_REMINDERS,
          reminderType
        })
      );
    }
  }, [reverseReminderCancellationId, dispatch]);

  const reverseReminderCancellation = (row) => {
    if (
      window.confirm(
        `Reminder: ${row.reminder.message_template}\n\nPatient: ${row.patient.full_name}\n\nWas scheduled on: ${row.reminder.date} ${row.reminder.time}\n\nAre you sure that you want to reverse the cancellation?`
      )
    ) {
      setReverseReminderCancellationId(row.reminder.id);
    }
  };

  const [rescheduleReminderData, setRescheduleReminderData] = useState(null);
  useEffect(() => {
    if (rescheduleReminderData) {
      dispatch(
        rescheduleAppointmentReminder({
          id: '',
          rescheduleReminderData,
          field: UPCOMING_REMINDERS,
        })
      );
    }
  }, [rescheduleReminderData, dispatch]);

  const rescheduleReminder = (row) => {
    const new_reminder_datetime = window.prompt(
      `Please enter the new reminder datetime for reminder: ${row.reminder.message_template} as follows:`,
      '2022-01-10T09:00:00'
    );
    if (new_reminder_datetime != null && isIsoDate(new_reminder_datetime)) {
      setRescheduleReminderData({
        id: row.reminder.id,
        new_reminder_datetime,
        send_now: false,
      });
    } else {
      alert(
        `datetime: ${new_reminder_datetime} is not valid for reminder: ${row.reminder.message_template}.\n\nMust be in format: 2022-01-10T09:00`
      );
    }
  };

  const sendReminderNow = (row) => {
    if (
      window.confirm(
        `Reminder: ${row.reminder.message_template}\n\nPatient: ${row.patient.full_name}\n\nScheduled on: ${row.reminder.date} ${row.reminder.time}\n\nAre you sure that you want to send the reminder now?`
      )
    ) {
      setRescheduleReminderData({
        id: row.reminder.id,
        new_reminder_datetime: null,
        send_now: true,
      });
    }
  };

  const [isCollapseOpen, setIsCollapseOpen] = useState(startOpen);

  const goToPatientShowMessages = (data) => {
    dispatch(setPatientShowMessages(data));
    history.push(ROUTES.PATIENTS);
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
          key="0"
          onClick={({ domEvent }) => {
            domEvent.stopPropagation();
            setActiveAppointment({
              id: row.appointment.id,
              type: SCHEDULED,
              patientId: row.patient.id,
            });
          }}
        >
          {formatMessage(overviewPageMessages.tableDropdownSeeAppointment)}
        </Menu.Item>
        <Menu.Item
          key="1"
          onClick={({ domEvent }) => {
            domEvent.stopPropagation();
            goToPatientShowMessages({ id: row.patient.id });
          }}
        >
          {formatMessage(overviewPageMessages.tableDropdownAiReachout)}
        </Menu.Item>
        {row.reminder.status.indexOf('Scheduled') !== -1 && (
          <Menu.Item
            key="2"
            onClick={({ domEvent }) => {
              domEvent.stopPropagation();
              cancelReminder(row);
            }}
          >
            {formatMessage(
              overviewPageMessages.tableDropdownCancelAppointmentReminder
            )}
          </Menu.Item>
        )}
        {row.reminder.status.indexOf('Cancelled') !== -1 && (
          <Menu.Item
            key="3"
            onClick={({ domEvent }) => {
              domEvent.stopPropagation();
              reverseReminderCancellation(row);
            }}
          >
            {formatMessage(
              overviewPageMessages.tableDropdownReverseAppointmentReminderCancellation
            )}
          </Menu.Item>
        )}
        <Menu.Item
          key="3"
          onClick={({ domEvent }) => {
            domEvent.stopPropagation();
            sendReminderNow(row);
          }}
        >
          <span style={{ color: '#CC0000' }}>Send reminder now</span>
        </Menu.Item>
      </Menu>
    );
  };

  const getTableColumns = () => {
    const baseColumns = [
      {
        title: formatMessage(overviewPageMessages.tableColumnPatient),
        dataIndex: ['patient', 'full_name'],
        sorter: true,
      },
      {
        title: formatMessage(overviewPageMessages.tableColumnReminderTemplate),
        dataIndex: ['reminder', 'message_template'],
        sorter: true,
      },
      {
        title: formatMessage(overviewPageMessages.tableColumnReminderDatetime),
        dataIndex: ['reminder', 'date'],
        sorter: true,
        render: (_, row) => (
          <div className="text-left text-uppercase">{`${row.reminder.date} ${removeLeadingZeroFromTime(
            moment(row.reminder.time, ['h:mm A']).format('hh:mm A')
          )}`}</div>
        ),
      },
      {
        title: formatMessage(overviewPageMessages.tableColumnReminderStatus),
        dataIndex: ['reminder', 'status'],
        sorter: true,
        render: (_, row) => (
          <div className="text-left">{row.reminder.status}</div>
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

    if (reminderType === 'appointment') {
      // Insert doctor and appointment columns after patient column
      baseColumns.splice(1, 0,
        {
          title: formatMessage(overviewPageMessages.tableColumnDoctor),
          dataIndex: ['doctor', 'full_name'],
          sorter: true,
          render: (_, row) => (
            <div className="text-left">
              {`${row.doctor.full_name} `}
            </div>
          ),
        },
        {
          title: formatMessage(overviewPageMessages.tableColumnAppointmentDatetime),
          dataIndex: ['appointment', 'date'],
          sorter: true,
          render: (_, row) => {
            if (!row.appointment?.date || !row.appointment?.time) {
              return <div className="text-left text-uppercase"></div>;
            }
            return (
              <div className="text-left text-uppercase">{`${row.appointment.date} ${removeLeadingZeroFromTime(
                moment(row.appointment.time, ['h:mm A']).format('hh:mm A')
              )}`}</div>
            );
          },
        }
      );
    }

    return baseColumns;
  };

  const tableColumns = getTableColumns();
  return (
    <>
      <div className="mb-3">
        <Select
          value={reminderType}
          onChange={handleReminderTypeChange}
          style={{ width: 200 }}
        >
          <Select.Option value="appointment">Appointment Reminders</Select.Option>
          <Select.Option value="system">System Reminders</Select.Option>
        </Select>
      </div>
      <AppointmentsRemindersTable
        field={UPCOMING_REMINDERS}
        id={''}
        columnMap={columnMap}
        reminderType={reminderType}  // Add this prop
      >
        <AppointmentsRemindersTable.Table
          columns={tableColumns}
        />
      </AppointmentsRemindersTable>
      {/* <AppointmentsRemindersTable
        field={UPCOMING_REMINDERS}
        id={''}
        columnMap={columnMap}
      >
        <AppointmentsRemindersTable.Table
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
      </AppointmentsRemindersTable> */}
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
    </>
  );
};

export default AppointmentsReminders;
