import React, { useState } from 'react';
import { Button } from 'antd';
import patientsService from 'services/PatientService';
import Modal from 'antd/lib/modal/Modal';
import Dropzone from '../DocumentsPage/Dropzone';
import FormField from 'components/custom-components/Form/FormField';
import FormSelect from 'components/custom-components/Form/FormSelect';
import Form from 'antd/lib/form/Form';
import { Field, Formik } from 'formik';

const UploaderPatient = ({onUploadComplete }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileListToUpload, setFileListToUpload] = useState([]);

  const showModal = () => {
    setOpen(true);
    setFileListToUpload([]);
  };

  const createPatient = async (payload) => {
    const response = await patientsService.uploadPatientCSV(payload);
    // handleUpdateDataSource(response.data);
  };

  const handleOk = (values) => {
    setConfirmLoading(true);

    createPatient({
      file: fileListToUpload[0],
    }).then(() => {
      setOpen(false);
      setConfirmLoading(false);
    });

    setTimeout(() => {
      console.log("Upload complete!");
      
      // Call the callback when done
      if (onUploadComplete) {
        onUploadComplete();
      }
    }, 1000); // Simulate a 2-second upload delay
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        style={{
          marginLeft: 'auto',
        }}
      >
        <Button type="primary" onClick={showModal}>
          Bulk Upload
        </Button>
      </div>
      <Formik
        initialValues={{}}
        onSubmit={handleOk}
        enableReinitialize
        validateOnMount
      >
        {({ values, handleSubmit }) => (
          <Modal
            title="Bulk Upload of Patients from EMIS exported CSV"
            visible={open}
            destroyOnClose
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
              <Button
                key="back"
                onClick={handleCancel}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={handleSubmit}
                htmlType="submit"
                disabled={confirmLoading}
                loading={confirmLoading}
              >
                Upload
              </Button>,
            ]}
          >
            <Dropzone
              onChange={setFileListToUpload}
              fileListToUpload={fileListToUpload}
            />
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default UploaderPatient;
