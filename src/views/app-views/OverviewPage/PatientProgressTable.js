import { Card, Table, Button, Select, Grid, Space, Typography, Tag, Row, Col, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { DEFAULT_LIMIT } from 'services/StaffService';
import patientService from 'services/PatientService';
import dayjs from 'utils/dayjs';
import { Link } from 'react-router-dom';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import utils from 'utils';
import { useSelector } from 'react-redux';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { formatDateTimeByCountry } from 'utils/helpers';
import { SearchOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

const PatientProgressTable = ({
  column,
  items,
  onRow,
  handleChange,
  loading,
  title,
}) => {
  const [data, setData] = useState([]); // All patient data
  const [displayData, setDisplayData] = useState([]); // Data for current page
  const [sortedInfo, setSortedInfo] = useState({}); // Sorting info
  const [pagination, setPagination] = useState({
    current: 1, // Current page
    pageSize: 100, // Records per page (set to 100)
    total: 0, // Total number of records (calculated dynamically based on data length)
    pageSizeOptions: ['10', '20', '50', '100', '200'], // Available page size options
  });
  const [filterStatus, setFilterStatus] = useState(null); // Add new state for filter
  const clinic = useSelector(makeSelectClinic());
  const [patientSearch, setPatientSearch] = useState('');

  const getProgressColor = (status) => {
    if (status === 'Rescheduled' || status === 'Booked' || status === 'Reminded') {
      return '#18D9C5'; // Green
    } else if (status === 'Asked Question' || status === 'Rescheduling' || status === 'Cancelling' || status === 'Booking' || status === 'Invited' || status === 'Incomplete' || status === 'Screened Elsewhere') {
      return '#FFBF00'; // Yellow
    } else if (status === 'Cancelled' || status === 'No Response' || status === 'Inactive' || status === 'Opt-out' || status === 'Declined' || status === 'Emergency Situation' || status === 'Human Intervention' || status === 'Snoozed') {
      return '#FF474C'; // Red
    } else if (status === 'Failed') {
      return '#100101'; // Default color
    }
    else {
      return '#E880FF'; // Default color
    }
  };

  const statusMapping = {
    RESCHEDULING: { status: 'Rescheduling', progressbar: 20 },
    CANCELLING: { status: 'Cancelling', progressbar: 20 },
    BOOKING: { status: 'Booking', progressbar: 20 },
    NO_RESPONSE: { status: 'No Response', progressbar: 50 },
    BOOKED: { status: 'Booked', progressbar: 100 },
    RESCHEDULED: { status: 'Rescheduled', progressbar: 100 },
    CANCELLED: { status: 'Cancelled', progressbar: 100 },
    INVITED: { status: 'Invited', progressbar: 100 },
    ASKED_QUESTION: { status: 'Asked Question', progressbar: 100 },
    INCOMPLETE: { status: 'Incomplete', progressbar: 100 },
    REMINDED: { status: 'Reminded', progressbar: 100 },
    SCREENED_ELSEWHERE: { status: 'Screened Elsewhere', progressbar: 100 },
    INACTIVE: { status: 'Inactive', progressbar: 100 },
    SNOOZED: { status: 'Snoozed', progressbar: 100 },
    HUMAN_INTERVENTION: { status: 'Human Intervention', progressbar: 100 },
    EMERGENCY_SITUATION: { status: 'Emergency Situation', progressbar: 100 },
    OPT_OUT: { status: 'Opt-out', progressbar: 100 },
    DECLINED: { status: 'Declined', progressbar: 100 },
    FAILED: { status: 'Failed', progressbar: 100 },
  };

  const statusOptions = [
    { value: 'ALL', label: 'All' },
    ...Object.keys(statusMapping).map(key => ({
      value: key,
      label: statusMapping[key].status
    }))
  ];

  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'Patient Name',
      key: 'Patient Name',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'Patient Name' && sortedInfo.order,
      render: (text, record) => (
        <Link to={`/pages/conversation/${record.PatientId}`}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Invitation Sent',
      dataIndex: 'Invitation Sent',
      key: 'Invitation Sent',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'Invitation Sent' && sortedInfo.order,
      render: (_, record) => {
        const invitationSent = record['Invitation Sent']; // or whatever field name contains the datetime
        const formattedDatetime = formatDateTimeByCountry(
          invitationSent,
          clinic?.country,
          'hh:mm A'
        );
        return <div className="text-left text-uppercase">{`${formattedDatetime}`}</div>;
      },
    },
    {
      title: 'Last Contact',
      dataIndex: 'Last Contact',
      key: 'Last Contact',
      sorter: true,
      defaultSortOrder: 'descend',
      sortOrder: sortedInfo.columnKey === 'Last Contact' && sortedInfo.order,
      render: (_, record) => {
        const lastContacted = record['Last Contact']; // or whatever field name contains the datetime
        if (lastContacted !== null) {
          const formattedDatetime = formatDateTimeByCountry(
            lastContacted,
            clinic?.country,
            'hh:mm A'
          );
          return <div className="text-left text-uppercase">{`${formattedDatetime}`}</div>;
        } else {
          return <div className="text-left">{`${''}`}</div>;
        }
      },
    },
    {
      title: 'Booking progress',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => {
        const statusOrder = {
          'Rescheduled': 2,
          'Booked': 1,
          'Asked Question': 3,
          'Rescheduling': 4,
          'Cancelling': 5,
          'Booking': 6,
          'Cancelled': 7,
          'No Response': 8,
          'Invited': 9,
          'Incomplete': 10,
          'Unknown': 11,
        };

        return statusOrder[a.Status] - statusOrder[b.Status];
      },
      sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
      render: (_, record) => {
        const buttonColor = getProgressColor(record.Status); // Get the color based on progress
        return (
          <div
            className="ant-tag text-left"
            style={{
              backgroundColor: `${buttonColor}1A`, // Changed to 1A for 10% opacity
              border: 'none',
              color: buttonColor,
              fontWeight: 400,
              padding: '0px 10px',
              borderRadius: "25px"
            }}
          >
            {record.Status}
          </div>
        );
      },
    },
  ];

  const getProgressData = async () => {
    try {
      const res = await patientService.getPatientProgress();
      const formattedData = res.data;

      // Process the data and map status
      formattedData.forEach((item) => {
        const process = item.Process.toUpperCase();
        const mapped = statusMapping[process] || { status: 'Unknown', progressbar: 0 };

        // Store the original process value for filtering
        item.originalProcess = process;
        // Transform process for display
        item.Process = process
          .toLowerCase()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
        item.Status = mapped.status;
        item.Progressbar = mapped.progressbar;
      });

      // Sort the data based on Last Contact first, then Invitation Sent
      formattedData.sort((a, b) => {
        if (a['Last Contact'] && b['Last Contact']) {
          return new Date(b['Last Contact']) - new Date(a['Last Contact']);
        } else if (a['Last Contact'] && !b['Last Contact']) {
          return -1;
        } else if (!a['Last Contact'] && b['Last Contact']) {
          return 1;
        } else {
          return new Date(b['Invitation Sent']) - new Date(a['Invitation Sent']);
        }
      });

      // Set the total records and all data
      setPagination({
        ...pagination,
        total: formattedData.length,
      });

      setData(formattedData); // Set all data
      setDisplayData(formattedData.slice(0, pagination.pageSize)); // Display first `pageSize` records
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  useEffect(() => {
    // Fetch data on mount
    getProgressData();
  }, []);

  useEffect(() => {
    // First apply status filter
    let filteredData = data;
    if (filterStatus && filterStatus !== 'ALL') {
      filteredData = data.filter(item => item.originalProcess === filterStatus);
    }

    const normalizedSearch = patientSearch.trim().toLowerCase();
    if (normalizedSearch) {
      filteredData = filteredData.filter((item) =>
        (item['Patient Name'] || '').toLowerCase().includes(normalizedSearch)
      );
    }

    // Then apply pagination
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    setDisplayData(filteredData.slice(startIndex, endIndex));

    // Update pagination total
    setPagination(prev => ({
      ...prev,
      total: filteredData.length,
    }));
  }, [pagination.current, pagination.pageSize, data, filterStatus, patientSearch]);

  // Modified handleTableChange to handle both sorting and pagination
  const handleTableChange = (paginationParams, filters, sorter) => {
    setSortedInfo(sorter);
    setPagination(prev => ({
      ...prev,
      current: paginationParams.current,
      pageSize: paginationParams.pageSize
    }));

    // Sorting logic remains the same
    const sortedData = [...data];
    if (sorter.order) {
      const sortOrder = sorter.order === 'ascend' ? 1 : -1;
      const columnKey = sorter.field;

      // Sorting logic based on column
      if (columnKey === 'status') {
        // If the sorted column is status, use the custom status order
        sortedData.sort((a, b) => {
          const statusOrder = {
            'Rescheduled': 2,
            'Booked': 1,
            'Asked Question': 3,
            'Rescheduling': 4,
            'Cancelling': 5,
            'Booking': 6,
            'Cancelled': 7,
            'No Response': 8,
            'Invited': 9,
            'Incomplete': 10,
            'Unknown': 11,
          };
          return (statusOrder[a.Status] - statusOrder[b.Status]) * sortOrder;
        });
      } else {
        // Default sorting for other columns
        sortedData.sort((a, b) => {
          if (typeof a[columnKey] === 'string') {
            return a[columnKey].localeCompare(b[columnKey]) * sortOrder;
          }
          if (dayjs(a[columnKey]).isValid() && dayjs(b[columnKey]).isValid()) {
            return (dayjs(a[columnKey]).isBefore(dayjs(b[columnKey])) ? -1 : 1) * sortOrder;
          }
          return (a[columnKey] - b[columnKey]) * sortOrder;
        });
      }
    }
    setData(sortedData);
  };

  // Add handler for filter change
  const handleFilterChange = (value) => {
    setFilterStatus(value);
    // Reset to page 1 when filter changes
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  const handlePatientSearchChange = (e) => {
    setPatientSearch(e.target.value);
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));
  };

  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  // Mobile Card Component
  const ProgressCard = ({ record }) => {
    const buttonColor = getProgressColor(record.Status);

    return (
      <Card
        hoverable
        styles={{ body: { padding: '16px' } }}
        style={{ height: '100%', borderRadius: '8px' }}
      >
        <Link to={`/pages/conversation/${record.PatientId}`}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Typography.Text strong style={{ fontSize: '16px', display: 'block' }}>
              {record['Patient Name']}
            </Typography.Text>

            <Tag
              style={{
                backgroundColor: `${buttonColor}1A`,
                border: 'none',
                color: buttonColor,
                fontWeight: 400,
                borderRadius: '25px'
              }}
            >
              {record.Status}
            </Tag>

            <Space size="small">
              <CalendarOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                Invited: {formatDateTimeByCountry(
                  record['Invitation Sent'],
                  clinic?.country,
                  'hh:mm A'
                )}
              </Typography.Text>
            </Space>

            {record['Last Contact'] && (
              <Space size="small">
                <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                  Last Contact: {formatDateTimeByCountry(
                    record['Last Contact'],
                    clinic?.country,
                    'hh:mm A'
                  )}
                </Typography.Text>
              </Space>
            )}
          </Space>
        </Link>
      </Card>
    );
  };

  return (
    <Card>
      <Space
        direction={isMobile ? 'vertical' : 'horizontal'}
        style={{ width: '100%', marginBottom: 16 }}
      >
        <Input
          style={{ width: isMobile ? '100%' : 240 }}
          placeholder="Search by patient name"
          prefix={<SearchOutlined />}
          value={patientSearch}
          onChange={handlePatientSearchChange}
          allowClear
        />
        <Select
          style={{ width: isMobile ? '100%' : 200 }}
          placeholder="Filter by status"
          allowClear
          options={statusOptions}
          onChange={handleFilterChange}
        />
      </Space>
      {isMobile ? (
        // Mobile Card View
        <>
          <Row gutter={[12, 12]}>
            {displayData.map((record) => (
              <Col xs={24} sm={12} key={record.PatientId}>
                <ProgressCard record={record} />
              </Col>
            ))}
          </Row>
          {pagination.total > pagination.pageSize && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Space>
                <Button
                  disabled={pagination.current === 1}
                  onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                  size="small"
                >
                  Previous
                </Button>
                <Typography.Text>
                  Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
                </Typography.Text>
                <Button
                  disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                  onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                  size="small"
                >
                  Next
                </Button>
              </Space>
            </div>
          )}
        </>
      ) : (
        // Desktop Table View
        <div className="responsive-table ant-table-row-pointer">
          <Table
            columns={columns}
            dataSource={displayData}
            onChange={handleTableChange}
            rowKey="PatientId"
            sortedInfo={sortedInfo}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              pageSizeOptions: pagination.pageSizeOptions,
              showSizeChanger: true,
            }}
            loading={loading}
          />
        </div>
      )}
    </Card>
  );
};

export default PatientProgressTable;
