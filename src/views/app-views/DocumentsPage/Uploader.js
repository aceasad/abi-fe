import React, { useState } from 'react';
import { Button } from 'antd';
import documentsService from 'services/DocumentsService';
import Modal from 'antd/lib/modal/Modal';
import Dropzone from './Dropzone';
import FormField from 'components/custom-components/Form/FormField';
import FormSelect from 'components/custom-components/Form/FormSelect';
import Form from 'antd/lib/form/Form';
import { Field, Formik } from 'formik';

const Uploader = ({ handleUpdateDataSource, appointmentTypes }) => {
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
    let appointment_type_name;
    try{
      appointment_type_name = appointmentTypes.find(
        (type) => type.id === values.appointmentType
      )['name'];  
  
    }catch{
      appointment_type_name = null;
    }
    console.log(appointment_type_name)
    createDocument({
      file: fileListToUpload[0],
      document_name: values.document_name,
      appointment_type_name,
    }).then(() => {
      setOpen(false);
      setConfirmLoading(false);
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        style={{
          marginLeft: 'auto',
          marginBottom: '2rem',
        }}
      >
        <Button type="primary" onClick={showModal}>
          Upload document
        </Button>
      </div>
      <Formik
        initialValues={{
          appointmentType: '',
        }}
        onSubmit={handleOk}
        enableReinitialize
        validateOnMount
      >
        {({ values, handleSubmit }) => (
          <Modal
            title="Upload Your Document"
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
            <div style={{ marginTop: '30px' }}>
              <Form layout="vertical" name="document-form">
                <Field
                  label="Document Name"
                  component={FormField}
                  name="document_name"
                />
                <Field
                  label="Appointment Type"
                  component={FormSelect}
                  name="appointmentType"
                  options={appointmentTypes}
                  optionField="name"
                  defaultOption={values.appointmentType}
                />
              </Form>
            </div>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default Uploader;
