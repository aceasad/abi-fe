import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import patientService from 'services/PatientService';
import ConversationStatusTimeline from './ConversationStatusTimeline';

const ConversationStatusHistoryModal = ({ patientId, patientName, country, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    let isCancelled = false;
    setLoading(true);
    patientService
      .getConversationStatusHistory(patientId)
      .then((res) => {
        if (!isCancelled) setItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (!isCancelled) setItems([]);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [patientId]);

  return (
    <Modal
      open={!!patientId}
      title={patientName ? `Booking history - ${patientName}` : 'Booking history'}
      onCancel={onClose}
      footer={null}
      closeIcon={
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
          }}
        >
          <CloseOutlined />
        </span>
      }
    >
      <ConversationStatusTimeline items={items} loading={loading} country={country} />
    </Modal>
  );
};

export default ConversationStatusHistoryModal;
