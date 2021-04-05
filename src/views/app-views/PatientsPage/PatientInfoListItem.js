import Flex from 'components/shared-components/Flex';
import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const PatientInfoListItem = ({ children }) => {
  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <Flex justifyContent="between" className="mb-2">
      <Text className="mr-4">
        {capitalizeFirstLetter(children[0].replace(/_/g, ' '))}:
      </Text>
      <Text>{children[1]}</Text>
    </Flex>
  );
};

export default PatientInfoListItem;
