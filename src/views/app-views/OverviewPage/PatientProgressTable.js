import { Card, Table, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { DEFAULT_LIMIT } from 'services/StaffService';
import patientService from 'services/PatientService';
import moment from 'moment';
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

  const getProgressColor = (status) => {
    if (status === 'Rescheduled' || status === 'Booked' || status === 'Reminded') {
      return '#18D9C5'; // Green
    } else if (status === 'Asked Question' || status === 'Rescheduling' || status === 'Cancelling' || status === 'Booking' || status === 'Invited' || status === 'Incomplete') {
      return '#FFBF00'; // Yellow
    } else if (status === 'Cancelled' || status === 'No Response' || status === 'Inactive') {
      return '#FF474C'; // Red
    } else {
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
    REMINDED: { status: 'Reminded', progressbar: 100 }
  };

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
        const formattedDatetime = moment(invitationSent).format('DD/MM/YYYY hh:mm A');
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
          const formattedDatetime = moment(lastContacted).format('DD/MM/YYYY hh:mm A');
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
          <Button type="primary" style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
            {record.Status}
          </Button>
        );
      },
    },
  ];

  const getProgressData = async () => {
    try {
      const res = await patientService.getPatientProgress(); // Fetch all data
      const formattedData = res.data; // Assuming the response data is an array of items

      // Process the data and map status
      formattedData.forEach((item) => {
        const process = item.Process.toUpperCase();
        const mapped = statusMapping[process] || { status: 'Unknown', progressbar: 0 };

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
    // Update displayed data when page or pageSize changes
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    setDisplayData(data.slice(startIndex, endIndex)); // Update displayed data
  }, [pagination.current, pagination.pageSize, data]);

  // Handle sorting change
  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter); // Store the sorting information

    // Perform sorting client-side based on the column and order
    const sortedData = [...data]; // Create a copy of the current data

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
          if (moment(a[columnKey]).isValid() && moment(b[columnKey]).isValid()) {
            return (moment(a[columnKey]).isBefore(moment(b[columnKey])) ? -1 : 1) * sortOrder;
          }
          return (a[columnKey] - b[columnKey]) * sortOrder;
        });
      }
    }

    setData(sortedData); // Set the sorted data to state
  };

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize,
    });
  };

  return (
    <Card>
      <div className="responsive-table ant-table-row-pointer">
        <Table
          columns={columns}
          dataSource={displayData} // Show only the paginated data
          onChange={handleTableChange}
          rowKey="PatientId" // To uniquely identify rows
          sortedInfo={sortedInfo}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            pageSizeOptions: pagination.pageSizeOptions, // Available page size options
            onChange: handlePaginationChange,
            showSizeChanger: true, // Show the page size changer
            onShowSizeChange: handlePaginationChange, // Handle page size change
          }}
          loading={loading}
        />
      </div>
    </Card>
  );
};

export default PatientProgressTable;
