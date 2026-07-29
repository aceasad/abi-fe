import React, { useEffect, useState } from 'react';
import { Card, Typography, Grid } from 'antd';
import patientService from 'services/PatientService';
import ConversationStatusTimeline from 'components/shared-components/ConversationStatusHistory/ConversationStatusTimeline';
import utils from 'utils';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const PatientOverviewBookingHistoryCard = ({ patient, country }) => {
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patient?.id) return;
    let isCancelled = false;
    setLoading(true);
    patientService
      .getConversationStatusHistory(patient.id)
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
  }, [patient?.id]);

  return (
    <Card>
      <div className="mb-3">
        <Title level={4} className="mb-0" style={{ fontSize: isMobile ? '16px' : '20px' }}>
          {"Booking history"}
        </Title>
      </div>
      <ConversationStatusTimeline items={items} loading={loading} country={country} />
    </Card>
  );
};

export default PatientOverviewBookingHistoryCard;
