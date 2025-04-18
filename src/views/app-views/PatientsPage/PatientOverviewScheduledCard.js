import { Button, Card, Table, Typography } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setScheduledOrder, setScheduledPage } from 'redux/actions/Patient';
import { makeSelectScheduledAppointments } from 'redux/selectors/Patient';
import messages from './messages';
import Flex from 'components/shared-components/Flex';
import {
  DEFAULT_SMALL_PAGINATION_LIMIT,
  ORDERING,
} from 'constants/ApiConstant';
import { SCHEDULED_APPOINTMENT } from 'constants/ClinicConstants';
import AppointmentFormWrapper from '../AppointmentsPage/AppointmentFormWrapper';
import CreateAppointment from '../AppointmentsPage/CreateAppointment';
import { RenderPredictionText } from 'utils/helpers';

const { Title } = Typography;

const prepareField = (order, field) => {
  const base = order === ORDERING.DESC ? '-' : '';
  switch (field) {
    case 'doctor':
      return `${base}doctor__first_name,${base}doctor_last_name`;
    case 'date':
      return `${base}start_datetime`;
    case 'appointment_type':
      return `${base}appointment_type__name`;
    default:
      return `${base}${field}`;
  }
};

const PatientOverviewScheduledCard = ({ patient, showAppointment }) => {
  const dispatch = useDispatch();

  const { items, loading, count, page } = useSelector(
    makeSelectScheduledAppointments()
  );

  const handlePaginationChange = (page) => {
    dispatch(setScheduledPage({ page, id: patient.id }));
  };

  const handleChange = (_, __, { order, field }, e) => {
    if (e.action === 'sort')
      dispatch(
        setScheduledOrder({
          id: patient.id,
          order,
          field: prepareField(order, field),
        })
      );
  };

  const { formatMessage } = useIntl();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const columnsScheduled = [
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
      title: formatMessage(messages.columnTitleDoctor),
      dataIndex: ['doctor', 'full_name'],
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
  ];

  return (
    <Card>
      <Flex justifyContent="between" alignItems="center" className="mb-3">
        <Title level={4} className="mb-0">
          {formatMessage(messages.cardTitleScheduledAppointments)}
        </Title>
        <Button ghost type="primary" onClick={() => setIsModalVisible(true)}>
          {formatMessage(messages.buttonNewAppointment)}
        </Button>
      </Flex>
      <div className="table-responsive ant-table-row-pointer">
        <Table
          onRow={(record) => ({
            onClick: () =>
              showAppointment({ id: record.id, type: SCHEDULED_APPOINTMENT }),
          })}
          columns={columnsScheduled}
          dataSource={items.map((item) => ({ ...item, key: item.id || item.key }))}
          onChange={handleChange}
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
      {isModalVisible && (
        <AppointmentFormWrapper
          Component={(props) => (
            <CreateAppointment
              {...props}
              isCalendar={false}
              patient_id={patient.id}
              patient_full_name={patient.full_name}
            />
          )}
          isEditForm={false}
          closeModal={closeModal}
          isModalVisible={isModalVisible}
        />
      )}
    </Card>
  );
};

export default PatientOverviewScheduledCard;
