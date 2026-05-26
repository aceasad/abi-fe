import React, { useState, useEffect } from 'react';
import {
  Collapse,
  Button,
  Typography,
  Progress,
} from 'antd';


import { useDispatch } from 'react-redux';
import PatientProgressTable from './PatientProgressTable';
import { getPatientProgress } from '../../../services/PatientService/getPatientProgress'


import { DownOutlined } from '@ant-design/icons';

import { useHistory } from 'react-router-dom';
import axios from 'axios';

const { Panel } = Collapse;

const data = [
  {
    key: "1",
    patientName: "John Doe",
    appointment: "lorem",
    process: "Booking",
    address: "New York",
    progress: 75,
  },
  {
    key: "2",
    patientName: "Jane Smith",
    appointment: "lorem",
    process: "Rescheduling",
    address: "London",
    progress: 55,
  },
  {
    key: "3",
    patientName: "Michael Johnson",
    appointment: "lorem",
    process: "Cancellation",
    address: "Sydney",
    progress: 80,
  },
  {
    key: "4",
    patientName: "Emily Davis",
    appointment: "lorem",
    process: "No Response",
    address: "Paris",
    progress: 45,
  },
  {
    key: "5",
    patientName: "Chris Brown",
    appointment: "lorem",
    process: "Booking",
    address: "Berlin",
    progress: 20,
  },
];

const columnMap = {
  key: 'key',
  patientName: 'patientName',
  appointment:
    'appointment',
  address: 'address',
  progress: 'progress',
};

// export const NESTED_MODAL = {
//   NONE: 0,
//   UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS: 1,
// };

const PatientProgress = ({ title, startOpen }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  // const { isPasIntegrated } = useSelector(state => state.auth.user);

  // const [activeAppointment, setActiveAppointment] = useState(null);
  // useEffect(() => {
  //   if (activeAppointment) {
  //     dispatch(getSingleAppointment(activeAppointment.id));
  //   }
  // }, [activeAppointment, dispatch]);

  // useEffect(() => {
  //     dispatch(getMessageRequiringImmediateAttentionStatuses());
  // }, [dispatch]);

  const getProgresData = async () => {
    data = getPatientProgress()
  }

  useEffect(() => {
    getProgresData()
  }, [])


  // Function to determine progress color
  const getProgressColor = (percent) => {
    if (percent >= 70) {
      return "green";
    } else if (percent >= 30) {
      return "red";
    } else {
      return "orangered";
    }
  };
  let tableColumns = [
    {
      title: "PatientName",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Appointment",
      dataIndex: "appointment",
      key: "appointment",
    },
    {
      title: "Process",
      dataIndex: "process",
      key: "process",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const buttonColor = getProgressColor(record.progress); // Get the color based on progress
        return (
          <>
            <Button
              type="primary"
              style={{ backgroundColor: buttonColor, borderColor: buttonColor }}
            // onClick={() => handleButtonClick(record)}
            >
              Done
            </Button>
          </>
        );
      },
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress) => (
        <Progress
          percent={progress}
          showInfo={false}
          size="small"
          strokeColor={getProgressColor(progress)}
        />
      ),
    },
  ];
  // useEffect(()=>{
  //   if(isPasIntegrated){
  //     tableColumns=tableColumns.splice(3,1)
  //   }
  // },[tableColumns])

  // const [
  //   activePreAppointmentQuestionnaire,
  //   setActivePreAppointmentQuestionnaire,
  // ] = useState(null);
  // useEffect(() => {
  //   if (activePreAppointmentQuestionnaire) {
  //     console.error(activePreAppointmentQuestionnaire);
  //     dispatch(
  //       getSinglePreAppointmentQuestionnaire(
  //         activePreAppointmentQuestionnaire.appointment_id
  //       )
  //     );
  //   }
  // }, [activePreAppointmentQuestionnaire, dispatch]);

  const [isCollapseOpen, setIsCollapseOpen] = useState(startOpen);

  // const goToPatientShowMessages = (data) => {
  //   dispatch(setPatientShowMessages(data));
  //   history.push(ROUTES.PATIENTS);
  // };

  // const [showChildModal, setShowChildModal] = useState({
  //   modal: NESTED_MODAL.NONE,
  //   data: null,
  // });

  // const showPreview = () =>
  //   setShowChildModal({ modal: NESTED_MODAL.NONE, data: null });

  // const showUpdateMessageRequiringImmediateAttentionStatus = (data) => {
  //   setShowChildModal({
  //     modal: NESTED_MODAL.UPDATE_MESSAGE_REQUIRING_IMMEDIATE_ATTENTION_STATUS,
  //     data,
  //   });
  // };

  // const showUpdateMessageRequiringImmediateAttentionStatusWrapper = (
  //   e,
  //   row
  // ) => {
  //   // alert('Coming Soon!');
  //   // return;
  //   e.stopPropagation();
  //   showUpdateMessageRequiringImmediateAttentionStatus(row);
  // };

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

  // const menu = (row) => {
  //   return (
  //     <Menu>
  //       <Menu.Item
  //         key="1"
  //         onClick={({ domEvent }) => {
  //           domEvent.stopPropagation();
  //           // goToPatientShowMessages({ id: row.patient.id });
  //         }}
  //       >
  //         {overviewPageMessages.tableDropdownPatientInfo}
  //       </Menu.Item>
  //       {row.appointment && (
  //         <Menu.Item
  //           key="0"
  //           onClick={({ domEvent }) => {
  //             domEvent.stopPropagation();
  //             // setActiveAppointment({
  //             //   id: row.appointment,
  //             //   type: SCHEDULED,
  //             //   patientId: row.patient.id,
  //             // });
  //           }}
  //         >
  //           {overviewPageMessages.tableDropdownAppointmentInfo}
  //         </Menu.Item>
  //       )}
  //       {row.pre_appointment_questionnaire && (
  //         <Menu.Item
  //           key="1"
  //           onClick={({ domEvent }) => {
  //             domEvent.stopPropagation();
  //             // setActivePreAppointmentQuestionnaire({
  //             //   appointment_id: row?.appointment,
  //             // });
  //           }}
  //         >
  //           {//             overviewPageMessages.tableDropdownPreAppointmentQuestionnaireInfo
  //}
  //         </Menu.Item>
  //       )}
  //       <Menu.Item
  //         key="0"
  //         onClick={({ domEvent }) => {
  //           domEvent.stopPropagation();
  //           // showUpdateMessageRequiringImmediateAttentionStatusWrapper(
  //           //   domEvent,
  //           //   row
  //           // );
  //         }}
  //       >
  //         {//           overviewPageMessages.tableDropdownUpdateMessageRequiringImmediateAttentionStatus
  //}
  //       </Menu.Item>
  //     </Menu>
  //   );
  // };



  return (
    <>
      <PatientProgressTable
        field={data}
        id={''}
        columnMap={columnMap}
      >
        <PatientProgressTable.Table
          columns={tableColumns}
        />
      </PatientProgressTable>
    </>
  );
};

export default PatientProgress;












// const AntDTable = () => {
//   return (
//     <div>
//       <Table
//         columns={columns}
//         dataSource={data}
//         pagination={false} // Optional: Disable pagination for simplicity
//         rowKey="key" // To uniquely identify rows
//       />
//     </div>
//   );
// };

// export default AntDTable;