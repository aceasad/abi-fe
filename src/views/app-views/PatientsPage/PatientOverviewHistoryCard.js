import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectHistory } from 'redux/selectors/Patient';
import { setAppointmentHistoryPage } from 'redux/actions/Patient';
import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { Card, Table, Typography, Grid, Space, Button, Tag } from 'antd';
import { APPOINTMENT_HISTORY } from 'constants/ClinicConstants';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import utils from 'utils';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { formatDateByCountry, removeLeadingZeroFromTime } from 'utils/helpers';
import dayjs from 'utils/dayjs';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const statusColor = (status) => {
  const statusOptions = {
    scheduled: 'Scheduled',
    attended: 'Attended',
    rescheduled: 'Rescheduled',
    cancelled: 'Cancelled',
  };
  switch (status) {
    case statusOptions.scheduled:
      return <Text className="text-primary">{status}</Text>;
    case statusOptions.attended:
      return <Text type="success">{status}</Text>;
    case statusOptions.rescheduled:
      return <Text type="warning">{status}</Text>;
    case statusOptions.cancelled:
      return <Text type="secondary">{status}</Text>;
    default:
      return <Text>{status}</Text>;
  }
};

const PatientOverviewHistoryCard = ({ patient, showAppointment }) => {
  const dispatch = useDispatch();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  const { items, loading, count, page } = useSelector(makeSelectHistory());
  const clinic = useSelector(makeSelectClinic());

  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';

  const columnsHistory = [
    {
      title: "Date",
      dataIndex: 'date',
      render: (date) => formatDateByCountry(date, clinic?.country, [
        'DD/MM/YYYY',
        'MM/DD/YYYY',
        'YYYY-MM-DD',
      ]),
    },
    {
      title: "Time",
      dataIndex: 'time',
      render: (time) => removeLeadingZeroFromTime(dayjs(time, ['HH:mm', 'h:mm A']).format('hh:mm A')),
    },
    ...(!isMedbridge
      ? [
          {
            title: "Doctor",
            dataIndex: ['doctor', 'full_name'],
            responsive: ['md'],
          },
        ]
      : []),
    {
      title: "Type",
      dataIndex: ['appointment_type', 'name'],
      responsive: ['lg'],
    },
    {
      title: "Status",
      dataIndex: ['status', 'name'],
      render: statusColor,
    },
  ];

  // Mobile Card Component
  const HistoryCard = ({ appointment }) => (
    <Card
      hoverable
      onClick={() => showAppointment({ id: appointment.id, type: APPOINTMENT_HISTORY })}
      styles={{ body: { padding: '16px' } }}
      style={{ marginBottom: '12px', borderRadius: '8px' }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
          <div>
            {statusColor(appointment.status?.name)}
          </div>
        </Space>

        <Space>
          <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {removeLeadingZeroFromTime(
              dayjs(appointment.time, ['HH:mm', 'h:mm A']).format('hh:mm A')
            )}
          </Text>
        </Space>

        {!isMedbridge && (
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
      </Space>
    </Card>
  );

  const handlePaginationChange = (page) => {
    dispatch(setAppointmentHistoryPage({ page, id: patient.id }));
  };

  return (
    <Card>
      <div className="mb-3">
        <Title level={4} className="mb-0" style={{ fontSize: isMobile ? '16px' : '20px' }}>
          {"Appointment history"}
        </Title>
      </div>

      {isMobile ? (
        // Mobile Card View
        <>
          {loading ? (
            <Card loading={loading} />
          ) : items.length > 0 ? (
            <>
              {items.map((appointment) => (
                <HistoryCard key={appointment.id} appointment={appointment} />
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
            <Text type="secondary">No appointment history</Text>
          )}
        </>
      ) : (
        // Desktop Table View
        <div className="table-responsive ant-table-row-pointer">
          <Table
            onRow={(record) => ({
              onClick: () =>
                showAppointment({ id: record.id, type: APPOINTMENT_HISTORY }),
            })}
            columns={columnsHistory}
            dataSource={items.map((item) => ({ ...item, key: item.id || item.key }))}
            loading={loading}
            pagination={{
              defaultPageSize: DEFAULT_SMALL_PAGINATION_LIMIT,
              total: count,
              onChange: handlePaginationChange,
              hideOnSinglePage: true,
              current: page,
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default PatientOverviewHistoryCard;
