import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Checkbox, message } from 'antd';
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
  const [isPeriodicUpdate, setIsPeriodicUpdate] = useState(false);
  const [batchSize, setBatchSize] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [validationError, setValidationError] = useState('');

  const showModal = () => {
    setOpen(true);
    setFileListToUpload([]);
    setShowLargeFileWarning(false);
    setCampaignName('');
    setIsPeriodicUpdate(false);
    setBatchSize('');
    setStartDate('');
    setStartTime('');
    setFileRows(0);
    setValidationError('');
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

  // Count CSV rows when file is selected
  useEffect(() => {
    if (fileListToUpload.length > 0) {
      countCSVRows(fileListToUpload[0]).then((rows) => {
        setFileRows(rows);
      });
    } else {
      setFileRows(0);
    }
  }, [fileListToUpload]);

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

    // Validate periodic upload fields if enabled
    if (isPeriodicUpdate) {
      // Check if fields are filled
      const batchSizeStr = String(batchSize || '').trim();
      if (!batchSizeStr || !startDate || !startTime) {
        const errorMsg = 'Please fill in all periodic upload fields: Batch Size, Start Date, and Start Time.';
        setValidationError(errorMsg);
        message.error(errorMsg);
        return;
      }

      // Validate batch size: must be > 0 and not bigger than total rows
      const batchSizeNum = parseInt(batchSizeStr, 10);
      if (isNaN(batchSizeNum) || batchSizeNum <= 0) {
        const errorMsg = 'Batch size must be greater than 0.';
        setValidationError(errorMsg);
        message.error(errorMsg);
        return;
      }

      if (batchSizeNum > rowCount) {
        const errorMsg = `Batch size cannot be greater than the total number of rows in the CSV file (${rowCount} rows).`;
        setValidationError(errorMsg);
        message.error(errorMsg);
        return;
      }

      // Validate start date: must be in the future (not today or past)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today for comparison
      const selectedDate = new Date(startDate);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        const errorMsg = 'Start date must be a future date. It cannot be today or a date in the past.';
        setValidationError(errorMsg);
        message.error(errorMsg);
        return;
      }
    }

    // Clear any previous validation errors if validation passes
    setValidationError('');

    setConfirmLoading(true);

    try {
      await createPatient({
        file: fileListToUpload[0],
        campaignName: campaignName,
        isPeriodicUpdate: isPeriodicUpdate,
        batchSize: isPeriodicUpdate ? batchSize : undefined,
        startDate: isPeriodicUpdate ? startDate : undefined,
        startTime: isPeriodicUpdate ? startTime : undefined,
      });

      // Add minimum delay of 1 second before completing
      await new Promise(resolve => setTimeout(resolve, 1000));

      setOpen(false);
      setConfirmLoading(false);
      setShowLargeFileWarning(false);
      setIsPeriodicUpdate(false);
      setBatchSize('');
      setStartDate('');
      setStartTime('');

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

              {validationError && (
                <div style={{
                  marginTop: 16,
                  padding: '12px 16px',
                  backgroundColor: '#fff2f0',
                  border: '1px solid #ffccc7',
                  borderRadius: '4px',
                  color: '#ff4d4f'
                }}>
                  <strong>Validation Error:</strong> {validationError}
                </div>
              )}

              {isPeriodicUpdate && (
                <div style={{ marginTop: 24, padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <div style={{ marginBottom: 16 }}>
                    <Checkbox
                      checked={isPeriodicUpdate}
                      onChange={(e) => {
                        setIsPeriodicUpdate(e.target.checked);
                        setValidationError('');
                      }}
                    >
                      Periodic Bulk Upload
                    </Checkbox>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                      Batch Size
                      {fileRows > 0 && (
                        <span style={{ fontWeight: 'normal', color: '#666', marginLeft: 8 }}>
                          (Max: {fileRows} rows)
                        </span>
                      )}
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter batch size"
                      value={batchSize}
                      onChange={(e) => {
                        setBatchSize(e.target.value);
                        setValidationError('');
                      }}
                      style={{ width: '100%' }}
                      min={1}
                      max={fileRows > 0 ? fileRows : undefined}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setValidationError('');
                      }}
                      style={{ width: '100%' }}
                      min={(() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        return tomorrow.toISOString().split('T')[0];
                      })()}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                      Start Time
                    </label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        setValidationError('');
                      }}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>
                </div>
              )}

              {!isPeriodicUpdate && (
                <div style={{ marginTop: 16 }}>
                  <Checkbox
                    checked={isPeriodicUpdate}
                    onChange={(e) => setIsPeriodicUpdate(e.target.checked)}
                  >
                    Periodic Bulk Upload
                  </Checkbox>
                </div>
              )}

              <p style={{ marginTop: 16 }}>Would you like to proceed with the upload?</p>
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
              <div style={{ marginBottom: 16 }}>
                <Checkbox
                  checked={isPeriodicUpdate}
                  onChange={(e) => setIsPeriodicUpdate(e.target.checked)}
                >
                  Periodic Bulk Upload
                </Checkbox>
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