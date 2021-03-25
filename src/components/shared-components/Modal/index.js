import { Modal } from 'antd';

const ModalComponent = ({
  visible,
  handlePrimaryAction,
  handleSecondaryAction,
  primaryAction,
  secondaryAction,
  title,
  description,
}) => {
  return (
    <div>
      <Modal
        title={title}
        okText={primaryAction}
        cancelText={secondaryAction}
        visible={visible}
        onOk={handlePrimaryAction}
        onCancel={handleSecondaryAction}
      >
        {description}
      </Modal>
    </div>
  );
};

export default ModalComponent;
