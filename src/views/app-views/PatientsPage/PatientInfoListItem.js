import Flex from 'components/shared-components/Flex';
import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const PatientInfoListItem = ({ children }) => {
  return (
    <Flex justifyContent="between" className="mb-2">
      <Text className="mr-4">{children[0]}:</Text>
      <Text className="text-right text-break">{children[1]}</Text>
    </Flex>
  );
};

export default PatientInfoListItem;
