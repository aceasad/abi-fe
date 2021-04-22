import { Button, Card, Col, Form, Input, Row, Typography } from 'antd';
import Flex from 'components/shared-components/Flex';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { DeleteFilled } from '@ant-design/icons';
import Scrollbars from 'react-custom-scrollbars';

const { Title } = Typography;

const list = [
  { id: 1, condition: 'condition 1' },
  { id: 2, condition: 'condition 2' },
  { id: 3, condition: 'condition 3' },
  { id: 4, condition: 'condition 4' },
  { id: 5, condition: 'condition 5' },
  { id: 6, condition: 'condition 6' },
  { id: 7, condition: 'condition 7' },
  { id: 8, condition: 'condition 8' },
];

const PatientFormExistingConditions = () => {
  const { formatMessage } = useIntl();

  const conditionList = list.map((item) => (
    <Flex
      key={item.id}
      justifyContent="between"
      alignItems="center"
      className="list-with-delete-item list-with-delete-item-regular"
    >
      <Typography.Text>{item.condition}</Typography.Text>
      <DeleteFilled className="list-with-delete-icon cursor-pointer" />
    </Flex>
  ));

  return (
    <Card className="p-4">
      <Row gutter={16}>
        <Col span={6}>
          <Title type="secondary" level={2} className="mt-4">
            {formatMessage(messages.cardTitleExistingConditions)}
          </Title>
        </Col>

        <Col span={18}>
          <Form layout="vertical">
            <Form.Item label="Add existing medical conditions">
              <Input.Group compact className="d-flex">
                <Form.Item name="existing_conditions" noStyle>
                  <Input placeholder="Press enter to add" />
                </Form.Item>
                <Button>{formatMessage(messages.addNew)}</Button>
              </Input.Group>
            </Form.Item>
          </Form>
          <div>
            <div className="list-with-delete-header">
              <Typography.Text strong type="secondary">
                {formatMessage(messages.columnTitleCondition)}
              </Typography.Text>
            </div>
            <div className="list-with-delete-body">
              <Scrollbars>{conditionList}</Scrollbars>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default PatientFormExistingConditions;
