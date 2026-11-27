import React, { useEffect, useState } from 'react';
import { Timeline, Typography, Empty, Spin, Pagination } from 'antd';
import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import {
  formatDateTimeByCountryInTimezone,
  getConversationProgressColor,
  humanizeConversationStatus,
} from 'utils/helpers';

const { Text } = Typography;

// Reuses the same color coding as the "Booking progress" page so a given
// status always looks the same wherever it's shown.
const getStatusDotColor = (status) =>
  getConversationProgressColor(humanizeConversationStatus(status));

const ConversationStatusTimeline = ({
  items = [],
  loading,
  country,
  patientTimezone,
}) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [items]);

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

  const start = (page - 1) * DEFAULT_SMALL_PAGINATION_LIMIT;
  const pageItems = items.slice(start, start + DEFAULT_SMALL_PAGINATION_LIMIT);

  return (
    <div className="conversation-status-timeline" style={{ paddingLeft: 16 }}>
      <Timeline
        items={pageItems.map((item) => {
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
                    {formatDateTimeByCountryInTimezone(
                      item.changed_at,
                      country,
                      'hh:mm A',
                      [],
                      patientTimezone
                    )}
                  </Text>
                </div>
              </div>
            ),
          };
        })}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <Pagination
          current={page}
          pageSize={DEFAULT_SMALL_PAGINATION_LIMIT}
          total={items.length}
          onChange={setPage}
          hideOnSinglePage
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ConversationStatusTimeline;
