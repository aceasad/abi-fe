import React, { useState } from 'react';
import { Button } from 'antd';
import Form from 'antd/lib/form/Form';
import FormField from 'components/custom-components/Form/FormField';
import { Field, Formik } from 'formik';
import documentsService from 'services/DocumentsService';
import Modal from 'antd/lib/modal/Modal';

const EditModal = ({ initialValues, handleUpdateDataSource }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const updateDocumentValues = async (payload) => {
    const response = await documentsService.updateDocument(payload);

    handleUpdateDataSource(response.data);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (values) => {
    setConfirmLoading(true);

    const payload = {
      id: initialValues.id,
      document_name: values.document_name,
      appointment_type_name: values.appointment_type,
    };

    updateDocumentValues(payload).then(() => {
      setOpen(false);
      setConfirmLoading(false);
    });
  };

  return (
    <>
      <Button type="link" onClick={showModal}>
        Edit
      </Button>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        // validationSchema={validationSchema}
        enableReinitialize
      >
        {({ handleSubmit, dirty, isValid }) => (
          <Modal
            title="Title"
            visible={open}
            // onOk={handleOk}
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
                disabled={!dirty || !isValid || confirmLoading}
              >
                Save
              </Button>,
            ]}
          >
            <Form layout="vertical" name="login-form">
              <Field
                label="Document Name"
                component={FormField}
                name="document_name"
              />
              <Field
                label="Appointment Type"
                component={FormField}
                name="appointment_type"
              />
            </Form>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default EditModal;
