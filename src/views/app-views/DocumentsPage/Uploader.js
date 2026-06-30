import React, { useState } from 'react';
import { Button, message } from 'antd';
import documentsService from 'services/DocumentsService';
import Modal from 'antd/lib/modal/Modal';
import Dropzone from './Dropzone';
import FormField from 'components/custom-components/Form/FormField';
import FormSelect from 'components/custom-components/Form/FormSelect';
import Form from 'antd/lib/form/Form';
import { Field, Formik } from 'formik';
import {
  DOCUMENT_TYPE_OPTIONS_DEFAULT,
  DOCUMENT_TYPE_OPTIONS_MEDBRIDGE,
  DOCUMENT_LANGUAGE_OPTIONS,
  usesAppointmentType,
  usesLocation,
} from './documentTypeHelpers';

const Uploader = ({ handleUpdateDataSource, appointmentTypes, locations, isMedbridge }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileListToUpload, setFileListToUpload] = useState([]);

  const showModal = () => {
    setOpen(true);
    setFileListToUpload([]);
  };

  const createDocument = async (payload) => {
    const response = await documentsService.createDocument(payload);

    handleUpdateDataSource(response.data);
  };

  const handleOk = (values) => {
    setConfirmLoading(true);
    const selectedDocumentType = isMedbridge
      ? values.document_type
      : 'appointment_type';
    const selectedLocation = (locations || []).find(
      (location) => String(location?.location_id) === String(values.location_id)
    );

    createDocument({
      file: fileListToUpload[0],
      document_name: values.document_name,
      document_type: selectedDocumentType,
      appointment_type_id: usesAppointmentType(selectedDocumentType)
        ? values.appointment_type_id
        : null,
      location_id: usesLocation(selectedDocumentType) ? values.location_id : null,
      location: usesLocation(selectedDocumentType) ? selectedLocation || null : null,
      language: values.language || 'en',
    })
      .then(() => {
        setOpen(false);
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
        message.error('Unable to upload document');
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const handleCancel = () => {
    setOpen(false);
  };

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
      <Button type="primary" onClick={showModal}>
        Upload document
      </Button>
      <Formik
        initialValues={{
          document_name: '',
          document_type: 'appointment_type',
          appointment_type_id: '',
          location_id: '',
          language: 'en',
        }}
        onSubmit={handleOk}
        enableReinitialize
        validateOnMount
      >
        {({ values, handleSubmit }) => (
          <Modal
            title="Upload Your Document"
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
            <div style={{ marginTop: '30px' }}>
              <Form layout="vertical" name="document-form">
                <Field
                  label="Document Name"
                  component={FormField}
                  name="document_name"
                />
                <Field
                  label="Document Type"
                  component={FormSelect}
                  name="document_type"
                  options={
                    isMedbridge ? DOCUMENT_TYPE_OPTIONS_MEDBRIDGE : DOCUMENT_TYPE_OPTIONS_DEFAULT
                  }
                  optionField="name"
                  defaultOption={values.document_type}
                />
                <Field
                  label="Language"
                  component={FormSelect}
                  name="language"
                  options={DOCUMENT_LANGUAGE_OPTIONS}
                  optionField="name"
                  defaultOption={values.language}
                />
                {usesAppointmentType(values.document_type) && (
                  <Field
                    label="Appointment Type"
                    component={FormSelect}
                    name="appointment_type_id"
                    options={appointmentTypes}
                    optionField="name"
                    defaultOption={values.appointment_type_id}
                  />
                )}
                {isMedbridge && usesLocation(values.document_type) && (
                  <Field
                    label="Location"
                    component={FormSelect}
                    name="location_id"
                    options={(locations || [])
                      .filter((location) => location?.location_id)
                      .map((location) => ({
                        ...location,
                        id: String(location.location_id),
                        name: `${location.location_name || location.location_id} (${location.location_id})`,
                      }))}
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

export default Uploader;
