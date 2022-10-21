import React, { useState } from 'react';
import { Button } from 'antd';
import Form from 'antd/lib/form/Form';
import FormField from 'components/custom-components/Form/FormField';
import { Field, Formik } from 'formik';
import documentsService from 'services/DocumentsService';
import Modal from 'antd/lib/modal/Modal';

const AksQuestions = ({ initialValues }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleQuestionAnswering = async (payload) =>
    await documentsService.questionAnswering(payload);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (values) => {
    setConfirmLoading(true);

    const payload = {
      document_id: values.id,
      message: values.message,
    };

    handleQuestionAnswering(payload)
      .then(() => {
        setConfirmLoading(false);
      })
      .catch(() => {
        setConfirmLoading(false);
      });
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Aks Questions
      </Button>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleSubmit }) => (
          <Modal
            title="Question Answering"
            visible={open}
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
                Done
              </Button>,
            ]}
          >
            <Form layout="vertical" name="login-form">
              <Field
                label="Your Question"
                component={FormField}
                name="message"
              />
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={confirmLoading}
                style={{ width: '100%' }}
              >
                Answer
              </Button>
            </Form>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default AksQuestions;
