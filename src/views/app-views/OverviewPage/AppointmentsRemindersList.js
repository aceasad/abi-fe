import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Table,
  Input,
  Button,
  Menu,
  message,
  PageHeader,
  Space,
  Typography,
} from 'antd';
import { EditFilled, DeleteOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex';
import {
  getAppointmentsRemindersPage,
  setAppointmentsRemindersPage,
  setAppointmentsRemindersOrder,
  cancelAppointmentReminder,
  reverseAppointmentReminderCancellation,
} from 'redux/actions/Appointment';
import messages from './messages';
import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import Modal from 'components/shared-components/Modal';

const AppointmentsRemindersList = ({
  count,
  appointmentsReminders,
  loading,
  page,
}) => {
  const [
    appointmentReminderForCancellation,
    setAppointmentReminderForCancellation,
  ] = useState(null);
  const [
    appointmentReminderForReverseCancellation,
    setAppointmentReminderForReverseCancellation,
  ] = useState(null);

  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const dropdownMenu = (row) => (
    <Menu>
      {row.status === 'Scheduled' && (
        <Menu.Item
          onClick={({ domEvent }) => {
            domEvent.stopPropagation();
            setAppointmentReminderForCancellation(row);
          }}
        >
          <Flex alignItems="center">
            <DeleteOutlined />
            <span className="ml-2">
              {formatMessage(messages.appointmentsRemindersCancel)}
            </span>
          </Flex>
        </Menu.Item>
      )}
      {row.status === 'Cancelled' && (
        <Menu.Item
          onClick={({ domEvent }) => {
            domEvent.stopPropagation();
            setAppointmentReminderForReverseCancellation(row);
          }}
        >
          <Flex alignItems="center">
            <EditFilled />
            <span className="ml-2">
              {formatMessage(messages.appointmentsRemindersReverseCancellation)}
            </span>
          </Flex>
        </Menu.Item>
      )}
    </Menu>
  );

  const tableColumns = [
    {
      title: formatMessage(messages.appointmentsRemindersColumnPatientFullname),
      dataIndex: 'patient_fullname',
      render: (patientFullname) => <span>{patientFullname}</span>,
      sorter: true,
    },
    {
      title: formatMessage(
        messages.appointmentsRemindersColumnReminderDatetime
      ),
      dataIndex: 'reminder_datetime',
      render: (reminderDatetime) => <span>{reminderDatetime}</span>,
      sorter: true,
    },
    {
      title: formatMessage(
        messages.appointmentsRemindersColumnAppointmentDatetime
      ),
      dataIndex: 'appointment_datetime',
      render: (appointmentDatetime) => <span>{appointmentDatetime}</span>,
      sorter: true,
    },
    {
      title: '',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  const handlePaginationChange = (page) => {
    dispatch(setAppointmentsRemindersPage(page));
  };

  const handleChange = (_, __, sortInfo, e) => {
    if (e.action === 'sort') dispatch(setAppointmentsRemindersOrder(sortInfo));
  };

  const afterCancellation = () => {
    setAppointmentReminderForCancellation(null);
    message.success(formatMessage(messages.appointmentsRemindersCancelled));
  };

  const handleCancellation = () => {
    dispatch(
      cancelAppointmentReminder({
        data: appointmentReminderForCancellation.id,
        afterCancellation,
      })
    );
  };

  const afterReverseCancellation = () => {
    setAppointmentReminderForReverseCancellation(null);
    message.success(
      formatMessage(messages.appointmentsRemindersCancellationReversed)
    );
  };

  const handleReverseCancellation = () => {
    dispatch(
      reverseAppointmentReminderCancellation({
        data: appointmentReminderForReverseCancellation.id,
        afterReverseCancellation,
      })
    );
  };

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={
          <Typography.Title level={2} className="mb-0">
            {formatMessage(messages.appointmentsRemindersListTitle)}
          </Typography.Title>
        }
      />
      <Card>
        <div className="table-responsive ant-table-row-pointer">
          <Table
            columns={tableColumns}
            onChange={handleChange}
            dataSource={appointmentsReminders.map((ar) => ({
              ...ar,
              key: ar.reminder_id,
            }))}
            pagination={{
              defaultPageSize: DEFAULT_SMALL_PAGINATION_LIMIT,
              total: count,
              onChange: handlePaginationChange,
              hideOnSinglePage: true,
              current: page,
            }}
            loading={loading}
          />
        </div>
      </Card>
      <Modal
        title={formatMessage(messages.appointmentsRemindersCancelTitle)}
        description={formatMessage(
          messages.appointmentsRemindersCancelDescription,
          {
            label: appointmentReminderForCancellation
              ? `reminder on '${appointmentReminderForCancellation?.reminder_datetime}' for appointment on '${appointmentReminderForCancellation?.appointment_datetime}'`
              : '',
          }
        )}
        primaryAction={formatMessage(messages.appointmentsRemindersCancel)}
        secondaryAction={formatMessage(messages.appointmentsRemindersClose)}
        visible={appointmentReminderForCancellation}
        handlePrimaryAction={handleCancellation}
        handleSecondaryAction={() =>
          setAppointmentReminderForCancellation(null)
        }
      />
      <Modal
        title={formatMessage(
          messages.appointmentsRemindersReverseCancellationTitle
        )}
        description={formatMessage(
          messages.appointmentsRemindersReverseCancellationDescription,
          {
            label: appointmentReminderForReverseCancellation
              ? `reminder on '${appointmentReminderForReverseCancellation?.reminder_datetime}' for appointment on '${appointmentReminderForReverseCancellation?.appointment_datetime}'`
              : '',
          }
        )}
        primaryAction={formatMessage(
          messages.appointmentsRemindersReverseCancellation
        )}
        secondaryAction={formatMessage(messages.appointmentsRemindersClose)}
        visible={appointmentReminderForReverseCancellation}
        handlePrimaryAction={handleReverseCancellation}
        handleSecondaryAction={() =>
          setAppointmentReminderForReverseCancellation(null)
        }
      />
    </>
  );
};

export default AppointmentsRemindersList;
