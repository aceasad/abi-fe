import React, { useState } from 'react';
import { Button } from 'antd';
import documentsService from 'services/DocumentsService';
import Modal from 'antd/lib/modal/Modal';
import Dropzone from './Dropzone';

const Uploader = ({ handleUpdateDataSource }) => {
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

  const handleOk = () => {
    setConfirmLoading(true);

    createDocument({
      file: fileListToUpload[0],
      document_name: 'test',
      appointment_type_name: 'screening',
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
          Upload Document
        </Button>
      </div>
      <Modal
        title="Upload Your Document"
        visible={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Dropzone
          onChange={setFileListToUpload}
          fileListToUpload={fileListToUpload}
        />
      </Modal>
    </>
  );
};

export default Uploader;
