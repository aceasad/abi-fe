import React from 'react';
import { Timeline, Typography, Empty, Spin } from 'antd';
import {
  formatDateTimeByCountry,
  getConversationProgressColor,
  humanizeConversationStatus,
} from 'utils/helpers';

const { Text } = Typography;

// Reuses the same color coding as the "Booking progress" page so a given
// status always looks the same wherever it's shown.
const getStatusDotColor = (status) =>
  getConversationProgressColor(humanizeConversationStatus(status));

const ConversationStatusTimeline = ({ items = [], loading, country }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <Spin />
      </div>
    );
  }

  if (!items.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />;
  }

  return (
    <div className="conversation-status-timeline" style={{ paddingLeft: 16 }}>
      <Timeline
        items={items.map((item) => {
          const dotColor = getStatusDotColor(item.status);
          return {
            key: item.id,
            // Rendered as an explicit colored dot rather than passing `color`
            // directly: antd only fills the dot solid for its own preset
            // color names, otherwise it just tints the border, making our
            // custom hex colors barely visible.
            dot: (
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: dotColor,
                }}
              />
            ),
            children: (
              <div>
                <Text strong>{humanizeConversationStatus(item.status)}</Text>
                {item.previous_status && (
                  <Text type="secondary">
                    {` (from ${humanizeConversationStatus(item.previous_status)})`}
                  </Text>
                )}
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatDateTimeByCountry(item.changed_at, country)}
                  </Text>
                </div>
              </div>
            ),
          };
        })}
      />
    </div>
  );
};

export default ConversationStatusTimeline;
