import { Card, Table, Button, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { DEFAULT_LIMIT } from 'services/StaffService';
import patientService from 'services/PatientService';
import dayjs from 'utils/dayjs';
import { Link } from 'react-router-dom';

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
        const formattedDatetime = dayjs(invitationSent).format('DD/MM/YYYY hh:mm A');
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
          const formattedDatetime = dayjs(lastContacted).format('DD/MM/YYYY hh:mm A');
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
      console.log(formattedData)
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

    // Then apply pagination
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    setDisplayData(filteredData.slice(startIndex, endIndex));

    // Update pagination total
    setPagination(prev => ({
      ...prev,
      total: filteredData.length,
    }));
  }, [pagination.current, pagination.pageSize, data, filterStatus]);

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

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Select
          style={{ width: 200 }}
          placeholder="Filter by status"
          allowClear
          options={statusOptions}
          onChange={handleFilterChange}
        />
      </div>
      <div className="responsive-table ant-table-row-pointer">
        <Table
          columns={columns}
          dataSource={displayData}
          onChange={handleTableChange}  // This will now handle both sorting and pagination
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
    </Card>
  );
};

export default PatientProgressTable;
