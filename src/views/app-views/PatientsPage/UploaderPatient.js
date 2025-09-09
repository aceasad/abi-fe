import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import patientsService from 'services/PatientService';
import Dropzone from '../DocumentsPage/Dropzone';
import { Formik } from 'formik';
import appointmentService from 'services/AppointmentService';

const UploaderPatient = ({ onUploadComplete }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileListToUpload, setFileListToUpload] = useState([]);
  const [showLargeFileWarning, setShowLargeFileWarning] = useState(false);
  const [fileRows, setFileRows] = useState(0);
  const [monthlyDays, setmonthlyDays] = useState(0);
  const [monthlyTimeslots, setmonthlyTimeslots] = useState(0);
  const [appointmentDaysCountLoading, setAppointmentDaysCountLoading] = useState(false);
  const [campaignName, setCampaignName] = useState('');

  const showModal = () => {
    setOpen(true);
    setFileListToUpload([]);
    setShowLargeFileWarning(false);
    setCampaignName('');
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
    setFileRows(rowCount);

    // Fetch appointment days count before showing the warning
    if (!showLargeFileWarning) {
      setAppointmentDaysCountLoading(true);
      try {
        const response = await appointmentService.getTotalAppointmentDaysCount();
        // Assuming response.data has the structure { days: X, timeslots: Y }
        setmonthlyDays(response.data?.available_days ?? 0);
        setmonthlyTimeslots(response.data?.total_slots ?? 0);
      } catch (err) {
        setmonthlyDays(0);
        setmonthlyTimeslots(0);
      } finally {
        setAppointmentDaysCountLoading(false);
      }
      setShowLargeFileWarning(true);
      return;
    }

    setConfirmLoading(true);

    try {
      await createPatient({
        file: fileListToUpload[0],
        campaignName: campaignName,
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

  return (<>
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
            ? "Are you sure you want to proceed with the upload?"
            : "Bulk Upload of Patients from EMIS exported CSV"}
          open={open}
          destroyOnHidden
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
              disabled={confirmLoading || appointmentDaysCountLoading}
              loading={confirmLoading}
            >
              {showLargeFileWarning ? 'Proceed with Upload' : 'Upload'}
            </Button>,
          ]}
        >
          {appointmentDaysCountLoading ? (
            <div style={{ textAlign: 'center', padding: '2em 0' }}>
              <span className="ant-spin ant-spin-spinning" style={{ fontSize: 24, marginBottom: 16, display: 'inline-block' }} />
              <p>Loading available appointment days...</p>
            </div>
          ) : showLargeFileWarning ? (
            <div>
              <p>
                You are about to upload <strong>{fileRows}  patients </strong>. In the next 30 days, there are <strong>{monthlyDays ?? 0} days with available appointments </strong>, offering a total of <strong>{monthlyTimeslots} available timeslots</strong>.
              </p>
              <p>Would you like to proceed with the upload?</p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                  Campaign Name
                </label>
                <Input
                  placeholder="Enter campaign name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
              <Dropzone
                onChange={setFileListToUpload}
                fileListToUpload={fileListToUpload}
              />
            </div>
          )}
        </Modal>
      )}
    </Formik>
  </>);
};

export default UploaderPatient;