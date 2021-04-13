import Flex from 'components/shared-components/Flex';
import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const PatientInfoListItem = ({ children, className }) => {
  return (
    <div className={className}>
      <Flex justifyContent="between" className="mb-3">
        <Text className="mr-4">{children[0]}:</Text>
        <Text className="text-right text-break">{children[1]}</Text>
      </Flex>
    </div>
  );
};

export default PatientInfoListItem;
