import { Modal } from 'antd';

const ModalComponent = ({
  visible,
  handlePrimaryAction,
  handleSecondaryAction,
  primaryAction,
  secondaryAction,
  title,
  description,
  confirmLoading,
}) => {
  return (
    <div>
      <Modal
        title={title}
        okText={primaryAction}
        cancelText={secondaryAction}
        open={visible}
        onOk={handlePrimaryAction}
        onCancel={handleSecondaryAction}
        confirmLoading={confirmLoading}
      >
        {description}
      </Modal>
    </div>
  );
};

export default ModalComponent;
