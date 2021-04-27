import { Collapse, Typography } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import messages from '../messages';
import Booking from '../Groups/Booking';
import AbiData from '../Groups/AbiData';
import Uptake from '../Groups/Uptake';
import Appointments from '../Groups/Appointments';

import { DownOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';

const { Panel } = Collapse;

const GroupsCollapse = () => {
  const { formatMessage } = useIntl();
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const collapseHeader = (
    <Flex justifyContent="between" alignItems="center" className="mb-4">
      <Typography.Title level={2} className="mb-0">
        {formatMessage(messages.bookingTitle)},&nbsp;
        {formatMessage(messages.appointmentsTitle)},&nbsp;
        {formatMessage(messages.asaDataTitle)},&nbsp;
        {formatMessage(messages.uptakeTitle)}
      </Typography.Title>

      <DownOutlined
        className={`collapse-arrow-custom ${isCollapseOpen ? 'open' : ''}`}
      />
    </Flex>
  );

  return (
    <Collapse
      expandIconPosition="right"
      ghost
      onChange={() => setIsCollapseOpen(!isCollapseOpen)}
    >
      <Panel
        className="overview-collapse"
        header={collapseHeader}
        showArrow={false}
      >
        <Booking />
        <Appointments />
        <AbiData />
        <Uptake />
      </Panel>
    </Collapse>
  );
};

export default GroupsCollapse;
