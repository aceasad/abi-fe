import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import patientsService from 'services/PatientService';
import Dropzone from '../DocumentsPage/Dropzone';
import FormField from 'components/custom-components/Form/FormField';
import FormSelect from 'components/custom-components/Form/FormSelect';
import Form from 'antd/lib/form/Form';
import { Field, Formik } from 'formik';

const UploaderPatient = ({ onUploadComplete }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileListToUpload, setFileListToUpload] = useState([]);
  const [showLargeFileWarning, setShowLargeFileWarning] = useState(false);

  const showModal = () => {
    setOpen(true);
    setFileListToUpload([]);
    setShowLargeFileWarning(false);
  };

  const countCSVRows = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').length - 1; // Subtract 1 for header row
        resolve(rows);
      };
      reader.readAsText(file);
    });
  };

  const createPatient = async (payload) => {
    try {
      const response = await patientsService.uploadPatientCSV(payload);
      return response;
    } catch (error) {
      console.error('Upload failed:', error);

      if (error.response?.status === 400) {
        throw new Error('Invalid file format. Please ensure you are uploading a valid CSV file.');
      }

      throw new Error('Upload failed. Please try again.');
    }
  };

  const handleOk = async (values) => {
    if (fileListToUpload.length === 0) return;

    const rowCount = await countCSVRows(fileListToUpload[0]);

    if (rowCount > 300 && !showLargeFileWarning) {
      setShowLargeFileWarning(true);
      return;
    }

    setConfirmLoading(true);

    try {
      await createPatient({
        file: fileListToUpload[0],
      });

      // Add minimum delay of 1 second before completing
      await new Promise(resolve => setTimeout(resolve, 1000));

      setOpen(false);
      setConfirmLoading(false);
      setShowLargeFileWarning(false);

      // Call the callback when done
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      setConfirmLoading(false);
      Modal.error({
        title: 'Upload Failed',
        content: "CSV file is not in valid format",
        okText: 'OK'
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setShowLargeFileWarning(false);
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
            title={showLargeFileWarning
              ? "Large Batch Upload Warning"
              : "Bulk Upload of Patients from EMIS exported CSV"}
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
                {showLargeFileWarning ? 'Proceed with Upload' : 'Upload'}
              </Button>,
            ]}
          >
            {showLargeFileWarning ? (
              <div>
                <p>You are uploading a large batch of patients (more than 300 rows).</p>
                <p>Would you like to proceed with the upload?</p>
              </div>
            ) : (
              <Dropzone
                onChange={setFileListToUpload}
                fileListToUpload={fileListToUpload}
              />
            )}
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default UploaderPatient;