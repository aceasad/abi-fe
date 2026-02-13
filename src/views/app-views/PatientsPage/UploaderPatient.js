import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Input, Checkbox, Select, message, Radio, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import patientsService from 'services/PatientService';
import Dropzone from '../DocumentsPage/Dropzone';
import { Formik, Field } from 'formik';
import appointmentService from 'services/AppointmentService';
import FormDatePicker from 'components/custom-components/Form/FormDatePicker';
import FormTimePicker from 'components/custom-components/Form/FormTimePicker';
import dayjs from 'utils/dayjs';
import { DATE_FORMAT_DD_MM_YYYY, DATE_FORMAT_YYYY_MM_DD } from 'constants/DateConstant';

const UploaderPatient = ({ onUploadComplete }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileListToUpload, setFileListToUpload] = useState([]);
  const [showLargeFileWarning, setShowLargeFileWarning] = useState(false);
  const [fileRows, setFileRows] = useState(0);
  const [appointmentTypesData, setAppointmentTypesData] = useState([]);
  const [appointmentDaysCountLoading, setAppointmentDaysCountLoading] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [isPeriodicUpdate, setIsPeriodicUpdate] = useState(false);
  const [inviteSchedule, setInviteSchedule] = useState('invite_now'); // 'invite_now' or 'periodic'
  const [batchSize, setBatchSize] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [frequency, setFrequency] = useState('');
  const [validationError, setValidationError] = useState('');

  const frequencyOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Every two weeks', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Daily', value: 'daily' }
  ];

  const handlePeriodicToggle = (checked) => {
    setIsPeriodicUpdate(checked);
    setValidationError('');

    if (!checked) {
      setBatchSize('');
      setStartDate('');
      setStartTime('');
      setFrequency('');
    }
  };

  const handleInviteScheduleChange = (e, setFieldValue) => {
    const value = e.target.value;
    setInviteSchedule(value);
    // Explicitly set isPeriodicUpdate: false for 'invite_now', true for 'periodic'
    setIsPeriodicUpdate(value === 'periodic' ? true : false);
    setValidationError('');

    if (value !== 'periodic') {
      setBatchSize('');
      if (setFieldValue) {
        setFieldValue('startDate', '');
        setFieldValue('startTime', '');
      }
      setStartDate('');
      setStartTime('');
      setFrequency('');
    }
  };

  const showModal = () => {
    setOpen(true);
    setFileListToUpload([]);
    setShowLargeFileWarning(false);
    setCampaignName('');
    setIsPeriodicUpdate(false);
    setInviteSchedule('invite_now');
    setBatchSize('');
    setStartDate('');
    setStartTime('');
    setFrequency('');
    setFileRows(0);
    setAppointmentTypesData([]);
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

  // Custom dropzone for the initial upload screen
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onabort = () => console.error('file reading was aborted');
        reader.onerror = () => console.error('file reading has failed');
        reader.readAsBinaryString(file);
      });
      setFileListToUpload([...fileListToUpload, ...acceptedFiles]);
    },
    [fileListToUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    }
  });

  function formatBytes(a, b = 2, k = 1024) {
    let d = Math.floor(Math.log(a) / Math.log(k));
    return 0 == a
      ? '0 Bytes'
      : parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b))) +
      ' ' +
      ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d];
  }

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

  // Reset periodic upload settings when returning to the initial screen
  useEffect(() => {
    if (!showLargeFileWarning) {
      setIsPeriodicUpdate(false);
      setInviteSchedule('invite_now');
      setBatchSize('');
      setStartDate('');
      setStartTime('');
      setFrequency('');
    }
  }, [showLargeFileWarning]);

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
        // Response is now an array of appointment types with their data
        setAppointmentTypesData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setAppointmentTypesData([]);
      } finally {
        setAppointmentDaysCountLoading(false);
      }
      setShowLargeFileWarning(true);
      return;
    }

    // Validate periodic upload fields if enabled
    if (inviteSchedule === 'periodic') {
      // Check if fields are filled
      const batchSizeStr = String(batchSize || '').trim();
      const formStartDate = values.startDate || '';
      const formStartTime = values.startTime || '';

      if (!batchSizeStr || !formStartDate || !formStartTime || !frequency) {
        const errorMsg = 'Please fill in all periodic upload fields: Batch Size, Start Date, Start Time, and Frequency.';
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

      // Convert date from DD/MM/YYYY to YYYY-MM-DD for validation
      const dateInYYYYMMDD = formStartDate ? dayjs(formStartDate, DATE_FORMAT_DD_MM_YYYY).format(DATE_FORMAT_YYYY_MM_DD) : '';

      // Validate start date and time: must be in the future
      const now = new Date();
      const selectedDate = dateInYYYYMMDD ? new Date(dateInYYYYMMDD) : null;
      if (selectedDate) {
        selectedDate.setHours(0, 0, 0, 0);
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // All frequencies require a future date (not today or past)
      if (selectedDate && selectedDate <= today) {
        const errorMsg = 'Start date must be a future date. It cannot be today or a date in the past.';
        setValidationError(errorMsg);
        message.error(errorMsg);
        return;
      }

      // Validate that the combined date and time is in the future
      if (dateInYYYYMMDD && formStartTime) {
        const [hours, minutes] = formStartTime.split(':').map(Number);
        const selectedDateTime = new Date(dateInYYYYMMDD);
        selectedDateTime.setHours(hours, minutes, 0, 0);

        if (selectedDateTime <= now) {
          const errorMsg = 'Start date and time must be in the future. Please select a time that has not yet passed.';
          setValidationError(errorMsg);
          message.error(errorMsg);
          return;
        }
      }
    }

    // Clear any previous validation errors if validation passes
    setValidationError('');

    setConfirmLoading(true);

    try {
      // Convert date and time to UTC if periodic update is enabled
      let utcStartDate = undefined;
      let utcStartTime = undefined;

      const formStartDate = values.startDate || '';
      const formStartTime = values.startTime || '';

      if (inviteSchedule === 'periodic' && formStartDate && formStartTime) {
        // Convert date from DD/MM/YYYY to YYYY-MM-DD
        const dateInYYYYMMDD = dayjs(formStartDate, DATE_FORMAT_DD_MM_YYYY).format(DATE_FORMAT_YYYY_MM_DD);

        // Capture client timezone
        const clientTimezoneOffset = new Date().getTimezoneOffset(); // Offset in minutes
        const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Log client timezone information
        console.log('Client Timezone:', clientTimezone);
        console.log('Client Timezone Offset (minutes):', clientTimezoneOffset);

        // Combine local date and time into a date string
        const [hours, minutes] = formStartTime.split(':').map(Number);
        const localDateTimeString = `${dateInYYYYMMDD}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

        // Create Date object - JavaScript interprets this in local timezone
        const localDateTime = new Date(localDateTimeString);

        // Convert to UTC - toISOString() automatically converts to UTC
        const utcDateTimeString = localDateTime.toISOString();

        // Extract UTC date and time components
        utcStartDate = utcDateTimeString.split('T')[0];
        const utcTimePart = utcDateTimeString.split('T')[1];
        utcStartTime = utcTimePart.substring(0, 5); // Extract HH:MM from HH:MM:SS.sssZ
      }

      // Use inviteSchedule as the source of truth
      const isPeriodic = inviteSchedule === 'periodic';
      await createPatient({
        file: fileListToUpload[0],
        campaignName: campaignName,
        isPeriodicUpdate: isPeriodic,
        batchSize: isPeriodic ? batchSize : undefined,
        startDate: isPeriodic ? utcStartDate : undefined,
        startTime: isPeriodic ? utcStartTime : undefined,
        frequency: isPeriodic ? frequency : undefined,
      });

      // Add minimum delay of 1 second before completing
      await new Promise(resolve => setTimeout(resolve, 1000));

      setOpen(false);
      setConfirmLoading(false);
      setShowLargeFileWarning(false);
      setIsPeriodicUpdate(false);
      setInviteSchedule('invite_now');
      setBatchSize('');
      setStartDate('');
      setStartTime('');
      setFrequency('');

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
      initialValues={{
        startDate: startDate || '',
        startTime: startTime || ''
      }}
      onSubmit={handleOk}
      enableReinitialize
      validateOnMount
    >
      {({ values, handleSubmit, setFieldValue }) => (
        <Modal
          title={showLargeFileWarning
            ? "Bulk Upload of Patients"
            : "Bulk Upload of Patients"}
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
              {showLargeFileWarning ? 'Next' : 'Next'}
            </Button>,
          ]}
        >
          {appointmentDaysCountLoading ? (
            <div style={{ textAlign: 'center', padding: '2em 0' }}>
              <Spin size="large" style={{ marginBottom: 16, display: 'block' }} />
              <p>Loading available appointment days...</p>
            </div>
          ) : showLargeFileWarning ? (
            <div>
              {/* Information Box */}
              <div style={{
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <p style={{ margin: 0, marginBottom: '16px', color: '#262626' }}>
                  You are about to upload <strong>{fileRows} patients</strong>.
                </p>
                {appointmentTypesData.length > 0 ? (
                  <div>
                    <p style={{ margin: 0, marginBottom: '12px', color: '#262626', fontWeight: 500 }}>
                      Available appointments in the next 30 days:
                    </p>
                    {appointmentTypesData.map((appointmentType, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: index < appointmentTypesData.length - 1 ? '12px' : 0,
                          padding: '12px',
                          backgroundColor: '#fafafa',
                          borderRadius: '4px',
                          border: '1px solid #e8e8e8'
                        }}
                      >
                        <p style={{ margin: 0, marginBottom: '4px', color: '#595959', fontSize: '14px' }}>
                          Appointment Type: <strong>{appointmentType.appointment_type_name || 'Unknown Type'} </strong>
                        </p>
                        <p style={{ margin: 0, marginBottom: '4px', color: '#595959', fontSize: '14px' }}>
                          Available days: <strong>{appointmentType.available_days ?? 0}</strong>
                        </p>
                        <p style={{ margin: 0, color: '#595959', fontSize: '14px' }}>
                          Total slots: <strong>{appointmentType.total_slots ?? 0}</strong>
                        </p>
                        {appointmentType.locations && appointmentType.locations.length > 0 && (
                          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e8e8e8' }}>
                            <p style={{ margin: 0, marginBottom: '4px', color: '#8c8c8c', fontSize: '12px', fontWeight: 500 }}>
                              Locations:
                            </p>
                            {appointmentType.locations.map((location, locIndex) => (
                              <p key={locIndex} style={{ margin: 0, marginLeft: '12px', color: '#8c8c8c', fontSize: '12px' }}>
                                {location.location_id} - {location.location_name} - {location.available_days} days, {location.total_slots} slots
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, color: '#595959' }}>
                    No appointment availability data available.
                  </p>
                )}
              </div>

              {validationError && (
                <div style={{
                  marginTop: 16,
                  marginBottom: 24,
                  padding: '12px 16px',
                  backgroundColor: '#fff2f0',
                  border: '1px solid #ffccc7',
                  borderRadius: '4px',
                  color: '#ff4d4f'
                }}>
                  <strong>Validation Error:</strong> {validationError}
                </div>
              )}

              {/* Select the invite schedule Section */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{
                  margin: 0,
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '16px',
                }}>
                  Select the invite schedule
                </h3>
                <p style={{
                  margin: 0,
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: '#595959'
                }}>
                  When a patient is invited, Asa will start a conversation with them.
                </p>
                <p style={{
                  margin: 0,
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: '#595959'
                }}>
                  Select when to reach out to your uploaded patients
                </p>

                <Radio.Group
                  value={inviteSchedule}
                  onChange={(e) => handleInviteScheduleChange(e, setFieldValue)}
                  style={{ width: '100%' }}
                >
                  <div
                    onClick={() => handleInviteScheduleChange({ target: { value: 'invite_now' } }, setFieldValue)}
                    style={{
                      marginBottom: '12px',
                      border: inviteSchedule === 'invite_now' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: '4px',
                      padding: '12px 16px',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <Radio value="invite_now" style={{ width: '100%', pointerEvents: 'none' }}>
                      Invite now
                    </Radio>
                  </div>
                  <div
                    onClick={() => handleInviteScheduleChange({ target: { value: 'periodic' } }, setFieldValue)}
                    style={{
                      border: inviteSchedule === 'periodic' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: '4px',
                      padding: '12px 16px',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <Radio value="periodic" style={{ width: '100%', pointerEvents: 'none' }}>
                      Periodic upload
                    </Radio>
                  </div>
                </Radio.Group>

                {inviteSchedule === 'periodic' && (
                  <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9'
                  }}>
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
                      <p style={{
                        marginTop: 8,
                        marginBottom: 0,
                        fontSize: '14px',
                        color: '#595959',
                        lineHeight: '1.5'
                      }}>
                        The number of patients to contact in every round of invites
                      </p>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                        Frequency
                      </label>
                      <Select
                        placeholder="Select frequency"
                        value={frequency || undefined}
                        onChange={(value) => {
                          setFrequency(value);
                          setValidationError('');
                        }}
                        style={{ width: '100%' }}
                      >
                        {frequencyOptions.map((option) => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                      <p style={{
                        marginTop: 8,
                        marginBottom: 0,
                        fontSize: '14px',
                        color: '#595959',
                        lineHeight: '1.5'
                      }}>
                        How often the batch of patients should be added
                      </p>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <Field
                        component={FormDatePicker}
                        label="Start Date"
                        name="startDate"
                        required
                        disabledDate={(current) => {
                          // Disable today and all past dates, only allow future dates
                          return current && current <= dayjs().endOf('day');
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <Field
                        component={FormTimePicker}
                        label="Start Time"
                        name="startTime"
                        required
                      />
                      <p style={{
                        marginTop: 8,
                        marginBottom: 0,
                        fontSize: '14px',
                        color: '#595959',
                        lineHeight: '1.5'
                      }}>
                        Select the date and time the patients should be added
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#262626' }}>
                  Campaign name
                </label>
                <Input
                  placeholder="Delivery type"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
                <p style={{
                  marginTop: 8,
                  marginBottom: 0,
                  fontSize: '14px',
                  color: '#595959',
                  lineHeight: '1.5'
                }}>
                  The name helps you identify this batch of patients within the Asa platform.
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 12,
                  fontWeight: 600,
                  fontSize: '16px',
                }}>
                  Upload a CSV of Patients
                </label>
                <div
                  {...getRootProps()}
                  style={{
                    border: isDragActive ? '2px dashed #1890ff' : '1px solid #d9d9d9',
                    borderRadius: '4px',
                    backgroundColor: isDragActive ? '#e6f7ff' : '#fafafa',
                    padding: '40px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <input {...getInputProps()} />
                  {fileListToUpload.length === 0 ? (
                    <>
                      <UploadOutlined style={{
                        fontSize: '48px',
                        color: '#000',
                        marginBottom: '16px',
                        display: 'block'
                      }} />
                      <p style={{
                        margin: 0,
                        color: '#595959',
                        fontSize: '14px'
                      }}>
                        Click to select a file or drag and drop a file.
                      </p>
                    </>
                  ) : (
                    <div>
                      {fileListToUpload.map((file) => (
                        <div key={file.path || file.name} style={{ color: '#262626' }}>
                          <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                            {file.path || file.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            {formatBytes(file.size)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </Formik>
  </>);
};

export default UploaderPatient;