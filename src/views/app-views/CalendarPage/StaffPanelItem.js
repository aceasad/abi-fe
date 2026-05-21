import React from 'react';
import { Badge, Col, Row, Space, Typography, Tooltip } from 'antd';
import { NO_SHOW_SCORE_THRESHOLD } from 'utils/constants';
import { getNoShowScore, removeLeadingZeroFromTime } from 'utils/helpers';

const StaffPanelItem = ({ data }) => {
  const likelyToMiss = 'Likely to miss an appointment';
  const likelyToAttend = 'Likely to attend an appointment';

  const noShowScore = getNoShowScore(data);

  return (
    <Row className="pl-2">
      <Col span={9}>
        {`${removeLeadingZeroFromTime(
          data.start_datetime
        )}-${removeLeadingZeroFromTime(data.end_datetime)}`.toLowerCase()}
      </Col>
      <Col span={15}>
        <Space>
          <Typography.Text strong>{data.patient}</Typography.Text>
          <Tooltip
            placement="bottomRight"
            title={
              noShowScore < NO_SHOW_SCORE_THRESHOLD
                ? likelyToAttend
                : likelyToMiss
            }
          >
            <Badge
              status={
                noShowScore < NO_SHOW_SCORE_THRESHOLD ? 'success' : 'warning'
              }
            />
          </Tooltip>
        </Space>
      </Col>
    </Row>
  );
};

export default StaffPanelItem;
