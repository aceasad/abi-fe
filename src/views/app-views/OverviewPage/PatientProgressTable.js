import { Card, Table, Progress, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { DEFAULT_LIMIT } from 'services/StaffService';
import patientService from 'services/PatientService'
// Sample data for the table


// Function to determine progress color


// Columns configuration


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
  const getProgressColor = (status) => {
    console.log(status);

    if (status == 'Completed') {
      return "#008000";
    } else if (status == 'In Progress') {
      return "#f5836b";
    } else if (status == 'Answered') {
      return "#A020F0";
    } else {
      // return "#9C27B0";
      return "#03A9F4";
    }
  };

  const statusMapping = {
    "RESCHEDULING": { status: "Started", progressbar: 20 },
    "CANCELLING": { status: "Started", progressbar: 20 },
    "BOOKING": { status: "Started", progressbar: 20 },
    "NO_RESPONSE": { status: "In Progress", progressbar: 50 },
    "BOOKED": { status: "Completed", progressbar: 100 },
    "RESCHEDULED": { status: "Completed", progressbar: 100 },
    "CANCELLED": { status: "Completed", progressbar: 100 },
    "ASKED_QUESTION": { status: "Answered", progressbar: 100 }
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "Patient Name",
      key: "Patient Name",
    },

    {
      title: "Process",
      dataIndex: "Process",
      key: "Process",
    },
    {
      title: "Status",
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
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (_, record) => {
        return (
          <>
            <Progress
              percent={record.Progressbar}
              showInfo={false}
              size="small"
              strokeColor={getProgressColor(record.Status)}
            />
          </>
        )
      },
    },
  ];
  const getProgresData = async () => {
    var res = await patientService.getPatientProgress()
    const formattedData = res.data
    formattedData.forEach(item => {
      const process = item.Process.toUpperCase(); // Ensure consistent key lookup
      const mapped = statusMapping[process] || { status: "Unknown", progressbar: 0 };

      // Add new keys to the object
      item.Process = process
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase()); // Format process value
      item.Status = mapped.status;
      item.Progressbar = mapped.progressbar;
    });

    console.log(formattedData);

    // for (const item in formattedData) {
    //   // item['Process'] = item['Process'].replace("_", " ").capitalize()
    //   console.log(item['Process']);
    // }
    // console.log(formattedData)
    // setData(res.data)
    setData(formattedData)

  }

  useEffect(() => {
    getProgresData()
  }, [])

  return (
    <Card>
      {/* <Typography.Title level={4}>{title}</Typography.Title> */}
      <div className="responsive-table ant-table-row-pointer">
        <Table
          columns={columns}
          dataSource={data}
          // pagination={{
          //   defaultPageSize: pageSize,
          //   total: data.length,
          //   onChange: handlePaginationChange,
          //   hideOnSinglePage: true,
          //   current: 1,
          // }}
          rowKey={(record) => data.indexOf(record)}// To uniquely identify rows
        />
      </div>
    </Card>
  )
}


// PatientProgressTable.defaultProps = {
//   onRow: () => ({}),
//   handleChange: () => {},
// };

// const PatientProgress = ({
//   id,
//   field,
//   children,
//   columnMap,
// }) => {
//   if (!children) throw new Error('Component must have children');

// const { items, loading, page, count } = useSelector(
//   makeSelectMessagesRequiringImmediateAttentionRequestData(field)
// );

// const dispatch = useDispatch();

// useEffect(() => {
//   dispatch(getMessagesRequiringImmediateAttention({ id, field }));
// }, [dispatch, id, field]);

// const handlePaginationChange = (page) => {
//   dispatch(setMessagesRequiringImmediateAttentionPage({ page, field, id }));
// };

// const handleChange = (_, __, sortField, e) => {
//   if (e.action === 'sort')
//     // dispatch(
//     //   setMessagesRequiringImmediateAttentionOrder({
//     //     ...sortField,
//     //     sort_field: columnMap
//     //       ? columnMap[
//     //           Array.isArray(sortField.field)
//     //             ? sortField.field.join('_')
//     //             : sortField.field
//     //         ]
//     //       : sortField.field,
//     //     field,
//     //     id,
//     //   })
//     // );
//     console.log("Add code for order / sort here")
// };

//   const elements = React.Children.map(children, (child) => {
//     if (
//       React.isValidElement(child) &&
//       child.type.name === PatientProgressTable.name
//     ) {
//       return React.cloneElement(child, {
//         items,
//         pageSize: DEFAULT_LIMIT,
//         // loading,
//         // page,
//         // count,
//         // handlePaginationChange,
//         handleChange,
//       });
//     }
//     return child;
//   });
//   return <div>{elements}</div>;
// };

// PatientProgressTable.Table = PatientProgressTable;

export default PatientProgressTable;
