import Flex from 'components/shared-components/Flex';
import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const PatientInfoListItem = ({ children, className }) => {
  return (
    <div className={className}>
      <Flex justifyContent="between" className="mb-3">
        <Text className="mr-4" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          {children[0]}:
        </Text>
        <Text className="text-right text-break">
          {children[1]}
          {children[0] === 'Height' && <span className="ml-1">cm</span>}
          {children[0] === 'Weight' && <span className="ml-1">kg</span>}
        </Text>
      </Flex>
    </div>
  );
};

export default PatientInfoListItem;
