import { Card, Table, Progress, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { DEFAULT_LIMIT } from 'services/StaffService';
import patientService from 'services/PatientService'
import moment from 'moment';

const PatientProgressTable = ({
  column,
  items,
  onRow,
  handleChange,
  pageSize = 10,
  count = 16,
  handlePaginationChange,
  page,
  loading,
  title,
}) => {

  const [data, setData] = useState([])
  const [sortedInfo, setSortedInfo] = useState({});

  const getProgressColor = (status) => {
    if (status == 'Rescheduled' || status == 'Booked') {
      return "#18D9C5"; // Green
    } else if (status == 'Asked Question' || status == 'Rescheduling' || status == 'Cancelling' || status == 'Booking') {
      return "#FFBF00"; // Yellow
    } else if (status == 'Cancelled' || status == 'No Response') {
      return "#FF474C"; // Red
    } else {
      // return "#9C27B0";
      return "#E880FF";
    }
  };

  const statusMapping = {
    "RESCHEDULING": { status: "Rescheduling", progressbar: 20 },
    "CANCELLING": { status: "Cancelling", progressbar: 20 },
    "BOOKING": { status: "Booking", progressbar: 20 },
    "NO_RESPONSE": { status: "No Response", progressbar: 50 },
    "BOOKED": { status: "Booked", progressbar: 100 },
    "RESCHEDULED": { status: "Rescheduled", progressbar: 100 },
    "CANCELLED": { status: "Cancelled", progressbar: 100 },
    "ASKED_QUESTION": { status: "Asked Question", progressbar: 100 }
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "Patient Name",
      key: "Patient Name",
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'Patient Name' && sortedInfo.order,
      render: text => <div>{text}</div>,
    },
    {
      title: "Invitation Sent",
      dataIndex: "Inviration Sent",
      key: "Invitation Sent",
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'Invitation Sent' && sortedInfo.order,
      render: (_, record) => {
        const invitationSent = record["Invitation Sent"]; // or whatever field name contains the datetime
        const formattedDatetime = moment(invitationSent).format('DD/MM/YYYY hh:mm A');
        return (
          <div className="text-left text-uppercase">{`${formattedDatetime}`}
          </div>
        );
      },
    },
    {
      title: "Last Contact",
      dataIndex: "Last Contact",
      key: "Last Contact",
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'Last Contact' && sortedInfo.order,
      render: (_, record) => {
        const lastContacted = record["Last Contact"]; // or whatever field name contains the datetime
        if (lastContacted !== null) {
          const formattedDatetime = moment(lastContacted).format('DD/MM/YYYY hh:mm A');
          return (
            <div className="text-left text-uppercase">{`${formattedDatetime}`}
            </div>
          );
        } else {
          return (
            <div className="text-left">{`${"Not Contacted"}`}
            </div>
          );

        }
      },
    },
    {
      title: "Booking Progress",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const buttonColor = getProgressColor(record.Status); // Get the color based on progress
        return (
          <>
            <Button
              type="primary"
              style={{ backgroundColor: buttonColor, borderColor: buttonColor }}
            // onClick={() => handleButtonClick(record)}
            >
              {record.Status}
            </Button>
          </>
        );
      },
    },
  ];
  const getProgresData = async () => {
    var res = await patientService.getPatientProgress()
    const formattedData = res.data
    formattedData.forEach(item => {
      const process = item.Process.toUpperCase(); // Ensure consistent key lookup
      const mapped = statusMapping[process] || { status: "Unknown", progressbar: 0 };

      item.Process = process
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase()); // Format process value
      item.Status = mapped.status;
      item.Progressbar = mapped.progressbar;
    });

    console.log(formattedData);
    setData(formattedData)

  }

  useEffect(() => {
    getProgresData()
  }, [])

  // Handle sorting change
  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter); // Store the sorting information

    // Perform sorting client-side based on the column and order
    const sortedData = [...data]; // Create a copy of the current data
    if (sorter.order) {
      const sortOrder = sorter.order === 'ascend' ? 1 : -1;
      const columnKey = sorter.field;
      sortedData.sort((a, b) => {
        // Handle string sorting
        if (typeof a[columnKey] === 'string') {
          return (a[columnKey].localeCompare(b[columnKey])) * sortOrder;
        }
        // Handle date sorting
        if (moment(a[columnKey]).isValid() && moment(b[columnKey]).isValid()) {
          return (moment(a[columnKey]).isBefore(moment(b[columnKey])) ? -1 : 1) * sortOrder;
        }
        // Handle numerical sorting
        return (a[columnKey] - b[columnKey]) * sortOrder;
      });
    }
    setData(sortedData); // Set the sorted data to state
  };
  return (
    <Card>
      <div className="responsive-table ant-table-row-pointer">
        <Table
          columns={columns}
          dataSource={data}
          onChange={handleTableChange} 
          rowKey="PatientId"// To uniquely identify rows
        />
      </div>
    </Card>
  )
}

export default PatientProgressTable;


    //   {
    //     title: "Progress",
    //     dataIndex: "progress",
    //     key: "progress",
    //     render: (_, record) => {
    //       return (
    //         <>
    //           <Progress
    //             percent={record.Progressbar}
    //             showInfo={false}
    //             size="small"
    //             strokeColor={getProgressColor(record.Status)}
    //           />
    //         </>
    //       )
    //     },
    //   },

    
    // {
    //   title: "Process",
    //   dataIndex: "Process",
    //   key: "Process",
    // },