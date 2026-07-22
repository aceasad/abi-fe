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
  Select,
  Input,
} from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentsRemindersTable from './AppointmentsRemindersTable';
import {
  SCHEDULED,
  UPCOMING_REMINDERS_APPOINTMENT,
  UPCOMING_REMINDERS_SYSTEM,
} from 'redux/reducers/Staff';
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
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { SearchOutlined } from '@ant-design/icons';

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

const formatUsDateWithRawTime = (date, time) => {
  if (!date || !time) return '';
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  if (match) {
    const [, day, month, year] = match;
    return `${month}/${day}/${year} ${time}`;
  }
  // If the backend sends a different date format, preserve it.
  return `${date} ${time}`;
};

const formatTimeTo12Hour = (time) => {
  if (!time) return '';
  const match = /^(\d{1,2}):(\d{2})(?:\s*([aApP][mM]))?$/.exec(
    String(time).trim()
  );
  if (!match) return time;

  const hour = Number(match[1]);
  const minute = match[2];
  const meridiem = match[3]?.toLowerCase();

  if (meridiem && hour >= 1 && hour <= 12) {
    return `${hour}:${minute} ${meridiem}`;
  }

  if (Number.isNaN(hour) || hour < 0 || hour > 23) {
    return time;
  }

  const suffix = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${suffix}`;
};

const isUSCountry = (country) => {
  if (!country) return false;
  const normalizedCountry = String(country).trim().toLowerCase();
  return (
    normalizedCountry === 'us' ||
    normalizedCountry === 'usa' ||
    normalizedCountry === 'united states' ||
    normalizedCountry === 'united states of america'
  );
};

const formatDateAndTimeBySection = (section, options = {}) => {
  const { convertTimeTo12Hour = false, convertDateToUS = false } = options;
  if (!section?.date || !section?.time) {
    return '';
  }
  const formattedDate = convertDateToUS ? section.date : section.date;
  const formattedTime = convertTimeTo12Hour ? formatTimeTo12Hour(section.time) : section.time;
  if (convertDateToUS) {
    return formatUsDateWithRawTime(formattedDate, formattedTime);
  }
  return `${section.date} ${formattedTime}`;
};

const AppointmentsReminders = ({ title, startOpen }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const clinic = useSelector(makeSelectClinic());
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const isInternal = PASProvider?.toLowerCase() === 'internal';
  const hideDoctorColumn = isMedbridge || isInternal;

  const [activeAppointment, setActiveAppointment] = useState(null);
  const [reminderType, setReminderType] = useState('appointment');
  const [patientSearch, setPatientSearch] = useState('');
  const remindersField =
    reminderType === 'system'
      ? UPCOMING_REMINDERS_SYSTEM
      : UPCOMING_REMINDERS_APPOINTMENT;
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
          field: remindersField,
          reminderType,
        })
      );
    }
  }, [cancelReminderId, dispatch, reminderType, remindersField]);

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
          field: remindersField,
          reminderType
        })
      );
    }
  }, [reverseReminderCancellationId, dispatch, reminderType, remindersField]);

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
          field: remindersField,
          reminderType,
        })
      );
    }
  }, [rescheduleReminderData, dispatch, reminderType, remindersField]);

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

  const getMenuItems = (row) => {
    const items = [
      {
        key: "1",
        label: "Message",
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          goToPatientShowMessages({ id: row.patient.id });
        },
      },
    ];

    if (reminderType === 'appointment' && row.appointment?.id) {
      items.unshift({
        key: "0",
        label: "See appointment",
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          setActiveAppointment({
            id: row.appointment.id,
            type: SCHEDULED,
            patientId: row.patient.id,
          });
        },
      });
    }

    if (row.reminder.status.indexOf('Scheduled') !== -1) {
      items.push({
        key: "2",
        label: "Cancel reminder",
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          cancelReminder(row);
        },
      });
    }

    if (row.reminder.status.indexOf('Cancelled') !== -1) {
      items.push({
        key: "3",
        label: "Reverse reminder cancellation",
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          reverseReminderCancellation(row);
        },
      });
    }

    items.push({
      key: "4",
      label: <span style={{ color: '#CC0000' }}>Send reminder now</span>,
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation();
        sendReminderNow(row);
      },
    });

    return items;
  };

  const getTableColumns = () => {
    const baseColumns = [
      {
        title: "Patient",
        dataIndex: ['patient', 'full_name'],
        sorter: true,
      },
      {
        title: "Reminder",
        dataIndex: ['reminder', 'message_template'],
        sorter: true,
      },
      {
        title: "Reminder date/time",
        dataIndex: ['reminder', 'date'],
        sorter: true,
        render: (_, row) => {
          const shouldUseUSFormatting = isUSCountry(clinic?.country) || isMedbridge;
          const formattedReminderDateTime = formatDateAndTimeBySection(
            row.reminder,
            {
              convertTimeTo12Hour: shouldUseUSFormatting,
              convertDateToUS: shouldUseUSFormatting,
            }
          );
          if (!formattedReminderDateTime) {
            return <div className="text-left text-uppercase"></div>;
          }
          return (
            <div className="text-left text-uppercase">{formattedReminderDateTime}</div>
          );
        },
      },
      {
        title: "Reminder status",
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

    if (reminderType === 'appointment') {
      // Insert doctor and appointment columns after patient column (omit doctor for MedBridge/Internal)
      const appointmentColumns = [
        ...(!hideDoctorColumn
          ? [
            {
              title: "Staff member",
              dataIndex: ['doctor', 'full_name'],
              sorter: true,
              render: (_, row) => (
                <div className="text-left">
                  {`${row.doctor.full_name} `}
                </div>
              ),
            },
          ]
          : []),
        {
          title: "Appointment date/time",
          dataIndex: ['appointment', 'date'],
          sorter: true,
          render: (_, row) => {
            const shouldUseUSFormatting = isUSCountry(clinic?.country) || isMedbridge;
            const formattedAppointmentDateTime = formatDateAndTimeBySection(
              row.appointment,
              {
                convertTimeTo12Hour: shouldUseUSFormatting,
                convertDateToUS: shouldUseUSFormatting,
              }
            );
            if (!formattedAppointmentDateTime) {
              return <div className="text-left text-uppercase"></div>;
            }
            return (
              <div className="text-left text-uppercase">{formattedAppointmentDateTime}</div>
            );
          },
        },
      ];
      baseColumns.splice(1, 0, ...appointmentColumns);
    }

    return baseColumns;
  };

  const tableColumns = getTableColumns();
  return (
    <>
      <div className="mb-3">
        <Space wrap size="middle">
          <Select
            value={reminderType}
            onChange={handleReminderTypeChange}
            style={{ width: 220 }}
          >
            <Select.Option value="appointment">Appointment Reminders</Select.Option>
            <Select.Option value="system">System Reminders</Select.Option>
          </Select>
          <Input
            style={{ width: 240, maxWidth: '100%' }}
            placeholder="Search by patient name"
            prefix={<SearchOutlined />}
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
            allowClear
          />
        </Space>
      </div>
      <AppointmentsRemindersTable
        field={remindersField}
        id={''}
        columnMap={columnMap}
        reminderType={reminderType}  // Add this prop
      >
        <AppointmentsRemindersTable.Table
          columns={tableColumns}
          patientSearch={patientSearch}
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
