import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from 'antd';
import { getPatientDetails } from 'redux/actions/Patient';
import WebSocketClient from 'services/WebSocketClient';
import CreatePatient from './CreatePatient';
import PatientList from './PatientList';
import PatientOverview from './PatientOverview';
import UpdatePatient from './UpdatePatient';
import { makeSelectPatients } from 'redux/selectors/Patient';
import { makeSelectLoginDetails } from 'redux/selectors/Auth';
import { createWebsocketUrl, parseReceivedEvent } from 'utils/helpers';
import { addOneMessage, resetChats } from 'redux/actions/Chats';
import { useMarkConversationAsRead } from 'queries/shared';
import { MESSAGE_STATUS } from 'constants/ChatConstants';

export const PATIENT_PAGE = {
  LIST: 1,
  CREATE: 2,
  EDIT: 3,
  PREVIEW: 4,
};

function Patients({ location: { key, search } }) {
  const [patientPage, setPatientPage] = useState(PATIENT_PAGE.LIST);
  const dispatch = useDispatch();
  const { token } = useSelector(makeSelectLoginDetails());
  const { mutate } = useMarkConversationAsRead();

  useEffect(() => {
    if (search) {
      const layout = new URLSearchParams(search).get('layout');
      setPatientPage({ id: parseInt(layout) });
    }
  }, []);

  const handleReceiveMessage = (event) => {
    const parsedMessage = parseReceivedEvent(event);
    dispatch(addOneMessage(parsedMessage));
    if (
      parsedMessage.is_answer === 0 &&
      parsedMessage.status === MESSAGE_STATUS.SENT
    ) {
      mutate(parsedMessage.patient.id);
    }
  };

  useEffect(() => {
    WebSocketClient.isComponentMounted = true;
    return () => {
      WebSocketClient.isComponentMounted = false;
      WebSocketClient.closeConnection();
      dispatch(resetChats());
    };
  }, []);

  useEffect(() => {
    const socketUrl = createWebsocketUrl(token);
    if (token) {
      WebSocketClient.connect(socketUrl, () => {}, handleReceiveMessage);
      WebSocketClient.waitForConnection();
    }
  }, [token]);

  const showCreate = () => setPatientPage({ id: PATIENT_PAGE.CREATE });
  const showList = () => setPatientPage({ id: PATIENT_PAGE.LIST });
  const updatePatient = (data, prev = PATIENT_PAGE.LIST) =>
    setPatientPage({ id: PATIENT_PAGE.EDIT, data, prev });
  const showPreview = (data) =>
    setPatientPage({ id: PATIENT_PAGE.PREVIEW, data });

  // useEffect(() => {
  //   dispatch(getPatientDetails());
  // }, [dispatch]);

  useEffect(() => {
    if (!search) {
      setPatientPage(PATIENT_PAGE.LIST);
    }
  }, [key]);

  const { patient_show_messages } = useSelector(makeSelectPatients());
  useEffect(() => {
    if (patient_show_messages) {
      setPatientPage({
        id: PATIENT_PAGE.PREVIEW,
        data: patient_show_messages.id,
      });
    }
  }, [patient_show_messages]);

  switch (patientPage.id) {
    case PATIENT_PAGE.LIST:
      return (
        <PatientList
          showCreate={showCreate}
          updatePatient={updatePatient}
          showPreview={showPreview}
        />
      );
    case PATIENT_PAGE.CREATE:
      return <CreatePatient showList={showList} />;
    case PATIENT_PAGE.EDIT:
      return (
        <UpdatePatient
          showList={
            patientPage.prev === PATIENT_PAGE.LIST
              ? showList
              : () => showPreview(patientPage.data)
          }
          patientId={patientPage.data}
        />
      );
    case PATIENT_PAGE.PREVIEW:
      return (
        <PatientOverview
          showList={showList}
          patientId={patientPage.data}
          updatePatient={updatePatient}
          patient_show_messages={patient_show_messages}
        />
      );
    default:
      return (
        <PatientList
          showCreate={showCreate}
          updatePatient={updatePatient}
          showPreview={showPreview}
        />
      );
  }
}

export default Patients;
