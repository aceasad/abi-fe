import React, { useState } from 'react';
import { Button } from 'antd';
import documentsService from 'services/DocumentsService';
import Modal from 'antd/lib/modal/Modal';

const DeleteModal = ({ initialValues, handleUpdateDataSource }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const deleteDocument = async (payload) => {
    await documentsService.deleteDocumentById(payload.id);

    handleUpdateDataSource(payload.id, 'delete');
  };

  const handleOk = (initialValues) => {
    setConfirmLoading(true);

    deleteDocument(initialValues).then(() => {
      setOpen(false);
      setConfirmLoading(false);
    });
  };

  return (
    <>
      <Button type="link" onClick={showModal}>
        Delete
      </Button>
      <Modal
        title="Delete document"
        visible={open}
        onOk={() => {
          handleOk(initialValues);
        }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this document?</p>
      </Modal>
    </>
  );
};

export default DeleteModal;
