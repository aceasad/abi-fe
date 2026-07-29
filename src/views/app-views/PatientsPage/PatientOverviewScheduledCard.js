import { Button, Card, Table, Typography, Grid, Row, Col, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setScheduledOrder, setScheduledPage } from 'redux/actions/Patient';
import { makeSelectScheduledAppointments } from 'redux/selectors/Patient';
import Flex from 'components/shared-components/Flex';
import {
  DEFAULT_SMALL_PAGINATION_LIMIT,
  ORDERING,
} from 'constants/ApiConstant';
import { SCHEDULED_APPOINTMENT } from 'constants/ClinicConstants';
import AppointmentFormWrapper from '../AppointmentsPage/AppointmentFormWrapper';
import CreateAppointment from '../AppointmentsPage/CreateAppointment';
import {
  formatDateByCountry,
  removeLeadingZeroFromTime,
  RenderPredictionText,
} from 'utils/helpers';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import utils from 'utils';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import dayjs from 'utils/dayjs';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

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
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  const { items, loading, count, page } = useSelector(
    makeSelectScheduledAppointments()
  );

  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const clinic = useSelector(makeSelectClinic());

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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const isInternal = PASProvider?.toLowerCase() === 'internal';
  const hideDoctorColumn = isMedbridge || isInternal;

  const columnsScheduled = [
    {
      title: "Date",
      dataIndex: 'date',
      sorter: true,
      render: (date) => formatDateByCountry(date, clinic?.country, [
        'DD/MM/YYYY',
        'MM/DD/YYYY',
        'YYYY-MM-DD',
      ]),
    },
    {
      title: "Time",
      dataIndex: 'time',
      sorter: false,
      render: (time) => removeLeadingZeroFromTime(dayjs(time, ['HH:mm', 'h:mm A']).format('hh:mm A')),
    },
    ...(!hideDoctorColumn
      ? [
          {
            title: "Doctor",
            dataIndex: ['doctor', 'full_name'],
            sorter: true,
            responsive: ['md'],
          },
        ]
      : []),
    {
      title: "Type",
      dataIndex: ['appointment_type', 'name'],
      sorter: true,
      responsive: ['lg'],
    },
    // {
    //   title: "Prediction",
    //   dataIndex: 'no_show_score',
    //   sorter: true,
    //   render: RenderPredictionText,
    //   responsive: ['lg'],
    // },
  ];

  // Mobile Card Component
  const AppointmentCard = ({ appointment }) => (
    <Card
      hoverable
      onClick={() => showAppointment({ id: appointment.id, type: SCHEDULED_APPOINTMENT })}
      styles={{ body: { padding: '16px' } }}
      style={{ marginBottom: '12px', borderRadius: '8px' }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <CalendarOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
            <Text strong>
              {formatDateByCountry(appointment.date, clinic?.country, [
                'DD/MM/YYYY',
                'MM/DD/YYYY',
                'YYYY-MM-DD',
              ])}
            </Text>
          </Space>
          <Space>
            <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
            <Text type="secondary">
              {removeLeadingZeroFromTime(
                dayjs(appointment.time, ['HH:mm', 'h:mm A']).format('hh:mm A')
              )}
            </Text>
          </Space>
        </Space>

        {!hideDoctorColumn && (
          <Space size="small">
            <UserOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
            <Text type="secondary" style={{ fontSize: '13px' }}>
              {appointment.doctor?.full_name}
            </Text>
          </Space>
        )}

        <Space size="small">
          <FileTextOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {appointment.appointment_type?.name}
          </Text>
        </Space>

        {appointment.no_show_score !== null && appointment.no_show_score !== undefined && (
          <div style={{ marginTop: '8px' }}>
            {RenderPredictionText(appointment.no_show_score)}
          </div>
        )}
      </Space>
    </Card>
  );

  return (
    <Card>
      <Flex justifyContent="between" alignItems="center" className="mb-3" style={{ flexWrap: 'wrap', gap: '8px' }}>
        <Title level={4} className="mb-0" style={{ fontSize: isMobile ? '16px' : '20px' }}>
          {"Scheduled appointments"}
        </Title>
        <Button ghost type="primary" onClick={() => setIsModalVisible(true)} size={isMobile ? 'small' : 'middle'}>
          {"New appointment"}
        </Button>
      </Flex>

      {isMobile ? (
        // Mobile Card View
        <>
          {loading ? (
            <Card loading={loading} />
          ) : items.length > 0 ? (
            <>
              {items.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
              {count > DEFAULT_SMALL_PAGINATION_LIMIT && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Space>
                    <Button
                      disabled={page === 1}
                      onClick={() => handlePaginationChange(page - 1)}
                      size="small"
                    >
                      Previous
                    </Button>
                    <Text>
                      Page {page} of {Math.ceil(count / DEFAULT_SMALL_PAGINATION_LIMIT)}
                    </Text>
                    <Button
                      disabled={page >= Math.ceil(count / DEFAULT_SMALL_PAGINATION_LIMIT)}
                      onClick={() => handlePaginationChange(page + 1)}
                      size="small"
                    >
                      Next
                    </Button>
                  </Space>
                </div>
              )}
            </>
          ) : (
            <Text type="secondary">No scheduled appointments</Text>
          )}
        </>
      ) : (
        // Desktop Table View
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
      )}
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
