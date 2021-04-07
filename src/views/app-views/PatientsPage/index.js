import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getPatientDetails } from 'redux/actions/Patient';
import CreatePatient from './CreatePatient';
import PatientList from './PatientList';
import PatientOverview from './PatientOverview';
import UpdatePatient from './UpdatePatient';

export const PATIENT_PAGE = {
  LIST: 1,
  CREATE: 2,
  EDIT: 3,
  PREVIEW: 4,
};
function Patients() {
  const [patientPage, setPatientPage] = useState(PATIENT_PAGE.LIST);
  const dispatch = useDispatch();

  const showCreate = () => setPatientPage({ id: PATIENT_PAGE.CREATE });
  const showList = () => setPatientPage({ id: PATIENT_PAGE.LIST });
  const updatePatient = (data, prev = PATIENT_PAGE.LIST) =>
    setPatientPage({ id: PATIENT_PAGE.EDIT, data, prev });
  const showPreview = (data) =>
    setPatientPage({ id: PATIENT_PAGE.PREVIEW, data });

  useEffect(() => {
    dispatch(getPatientDetails());
  }, [dispatch]);

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
