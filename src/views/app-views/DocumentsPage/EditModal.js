import React, { useState } from 'react';
import { Button, message } from 'antd';
import Form from 'antd/lib/form/Form';
import FormField from 'components/custom-components/Form/FormField';
import FormSelect from 'components/custom-components/Form/FormSelect';
import { Field, Formik } from 'formik';
import documentsService from 'services/DocumentsService';
import Modal from 'antd/lib/modal/Modal';
import Dropzone from './Dropzone';

const EditModal = ({
  record,
  appointmentTypes,
  locations,
  isMedbridge,
  handleUpdateDataSource,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileListToUpload, setFileListToUpload] = useState([]);

  const showModal = () => {
    setOpen(true);
    setFileListToUpload([]);
  };

  const handleCancel = () => {
    setOpen(false);
    setFileListToUpload([]);
  };

  const handleSubmit = (values) => {
    setConfirmLoading(true);
    const selectedDocumentType = isMedbridge
      ? values.document_type
      : 'appointment_type';

    const selectedLocation = isMedbridge
      ? (locations || []).find(
          (location) => String(location?.location_id) === String(values.location_id)
        )
      : null;

    const payload = {
      id: record.id,
      document_name: values.document_name,
      document_type: selectedDocumentType,
      appointment_type_id:
        selectedDocumentType === 'appointment_type' ? values.appointment_type_id || null : null,
      location_id:
        selectedDocumentType === 'location' ? values.location_id || null : null,
      location: selectedLocation || undefined,
      file: fileListToUpload[0],
    };

    documentsService
      .updateDocument(payload)
      .then((response) => {
        handleUpdateDataSource(response.data);
        setOpen(false);
        message.success('Document updated');
      })
      .catch((error) => {
        const data = error?.response?.data;
        if (typeof data === 'string') {
          message.error(data);
          return;
        }
        if (data && typeof data === 'object') {
          const firstError = Object.values(data)?.[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            message.error(firstError[0]);
            return;
          }
        }
        message.error('Failed to update document');
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const appointmentOptions = (appointmentTypes || []).map((type) => ({
    id: type.id,
    name: type.name,
  }));

  const locationOptions = (locations || [])
    .filter((location) => location?.location_id)
    .map((location) => ({
      ...location,
      id: String(location.location_id),
      name: `${location.location_name || location.location_id} (${location.location_id})`,
    }));

  const handleLocationSelect = (setFieldValue, _fieldName, value) => {
    const selectedLocation = (locations || []).find(
      (location) => String(location?.location_id) === String(value)
    );
    const locationName = selectedLocation?.location_description || selectedLocation?.location_name;
    if (locationName) {
      setFieldValue('document_name', locationName);
    }
  };

  return (
    <>
      <Button type="link" onClick={showModal}>
        Edit
      </Button>
      <Formik
        enableReinitialize
        initialValues={{
          document_name: record.document_name || '',
          document_type: record.document_type || 'appointment_type',
          appointment_type_id: record.appointment_type_id || '',
          location_id: record.location_id ? String(record.location_id) : '',
        }}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, dirty }) => (
          <Modal
            title="Edit document"
            open={open}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            destroyOnClose
            footer={[
              <Button key="back" onClick={handleCancel} onMouseDown={(e) => e.preventDefault()}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={handleSubmit}
                htmlType="submit"
                disabled={(!dirty && !fileListToUpload.length) || confirmLoading}
                loading={confirmLoading}
              >
                Save
              </Button>,
            ]}
          >
            <p style={{ marginBottom: 8, color: '#666' }}>
              Replace file (optional). Leave empty to keep the current file.
            </p>
            <Dropzone
              onChange={(files) => {
                if (!files.length) {
                  setFileListToUpload([]);
                  return;
                }
                setFileListToUpload([files[files.length - 1]]);
              }}
              fileListToUpload={fileListToUpload}
            />
            <div style={{ marginTop: 24 }}>
              <Form layout="vertical" name="document-edit-form">
                <Field label="Document name" component={FormField} name="document_name" />
                <Field
                  label="Document Type"
                  component={FormSelect}
                  name="document_type"
                  options={
                    isMedbridge
                      ? [
                          { id: 'appointment_type', name: 'Appointment Type Specific' },
                          { id: 'location', name: 'Clinic Location Specific' },
                        ]
                      : [{ id: 'appointment_type', name: 'Appointment Type Specific' }]
                  }
                  optionField="name"
                  defaultOption={values.document_type}
                />
                {values.document_type === 'appointment_type' && (
                  <Field
                    label="Appointment type"
                    component={FormSelect}
                    name="appointment_type_id"
                    options={appointmentOptions}
                    optionField="name"
                    defaultOption={values.appointment_type_id}
                    showSearch
                    filterOption={(input, option) =>
                      `${option?.value ?? ''} ${option?.children ?? ''}`
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                )}
                {isMedbridge && values.document_type === 'location' && (
                  <Field
                    label="Location"
                    component={FormSelect}
                    name="location_id"
                    options={locationOptions}
                    optionField="name"
                    defaultOption={values.location_id}
                    afterSelectChange={handleLocationSelect}
                    showSearch
                    filterOption={(input, option) =>
                      `${option?.value ?? ''} ${option?.children ?? ''}`
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                )}
              </Form>
            </div>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default EditModal;
