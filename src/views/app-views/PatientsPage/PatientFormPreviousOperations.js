import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Typography,
} from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { DeleteFilled } from '@ant-design/icons';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';

const { Title } = Typography;

const dummyData = [
  { id: 1, operation: 'operation 1', date: '2016/02/01' },
  { id: 2, operation: 'operation 2', date: '2018/01/01' },
  { id: 3, operation: 'operation 3', date: '2012/01/01' },
  { id: 4, operation: 'operation 4', date: '2001/01/01' },
  { id: 5, operation: 'operation 5', date: '2004/11/01' },
  { id: 6, operation: 'operation 6', date: '2003/01/01' },
  { id: 7, operation: 'operation 7', date: '2020/07/01' },
  { id: 8, operation: 'operation 8', date: '2015/01/01' },
];

const PatientFormPreviousOperationss = () => {
  const { formatMessage } = useIntl();
  const dateFormat = 'YYYY/MM/DD';

  const conditionList = dummyData.map((item) => (
    <div
      key={item.id}
      className="list-with-delete-item list-with-delete-item-small"
    >
      <Row gutter={16}>
        <Col span={16} className="d-flex align-items-center">
          <Typography.Text>{item.operation}</Typography.Text>
        </Col>
        <Col span={6}>
          <DatePicker
            size="small"
            defaultValue={moment(item.date, dateFormat)}
            format={dateFormat}
          />
        </Col>
        <Col span={2} className="d-flex align-items-center justify-content-end">
          <DeleteFilled className="list-with-delete-icon cursor-pointer" />
        </Col>
      </Row>
    </div>
  ));

  return (
    <Card className="p-4">
      <Row gutter={16}>
        <Col span={6}>
          <Title type="secondary" level={2} className="mt-4">
            {formatMessage(messages.cardTitlePreviousOperatins)}
          </Title>
        </Col>

        <Col span={18}>
          <Form layout="vertical">
            <Form.Item label="Add previous operation">
              <Input.Group compact className="d-flex">
                <Form.Item name="previous_operations" noStyle>
                  <Input placeholder="Press enter to add" />
                </Form.Item>
                <Button onClick={() => {}}>
                  {formatMessage(messages.addNew)}
                </Button>
              </Input.Group>
            </Form.Item>
          </Form>
          <div>
            <Row className="list-with-delete-header">
              <Col span={16}>
                <Typography.Text strong type="secondary">
                  {formatMessage(messages.columnTitleOperation)}
                </Typography.Text>
              </Col>
              <Col span={8}>
                <Typography.Text strong type="secondary">
                  {formatMessage(messages.columnTitleTimeOfSurgery)}
                </Typography.Text>
              </Col>
            </Row>
            <div className="list-with-delete-body-small">
              <Scrollbars>{conditionList}</Scrollbars>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default PatientFormPreviousOperationss;
