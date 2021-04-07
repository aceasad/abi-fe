import React, { useEffect, useState } from 'react';
import { Card, Table, Tooltip, Typography, Button, Modal } from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import UserSettingsFormModal from 'containers/Forms/UserSettings/UserSettingsFormModal';
import { useIntl } from 'react-intl';
import messages from './messages';
import { useDispatch } from 'react-redux';

const { Text, Title } = Typography;
const { confirm } = Modal;

const dummyData = [
  {
    id: 1,
    userName: 'Beau Davenport',
    email: 'beaudavenport@atrium.com',
    superuser: true,
  },
  {
    id: 2,
    userName: 'Rui Ford',
    email: 'ruiford@atrium.com',
    superuser: false,
  },
  {
    id: 3,
    userName: 'Chantal Ingram',
    email: 'chantalingram@atrium.com',
    superuser: false,
  },
];

const UserSettings = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getUs)
  }, []);

  const [userSettingsModalVisible, setUserSettingsModalVisible] = useState(
    false
  );
  const [userModalTitle, setUserModalTitle] = useState('');

  const openUserSettings = (modalTitle) => {
    setUserModalTitle(modalTitle);
    setUserSettingsModalVisible(true);
  };

  const closeUserSettings = () => {
    setUserSettingsModalVisible(false);
  };

  const showDeleteConfirm = (element) => {
    confirm({
      title: formatMessage(messages.deleteConfirmation, {
        user: element.userName,
      }),
      okText: formatMessage(messages.formConfirmationButton),
      okType: 'danger',
      cancelText: formatMessage(messages.formCancelButton),
      onOk() {
        // Implement on confirm logic.
      },
    });
  };

  const tableColumns = [
    {
      title: formatMessage(messages.formName),
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: formatMessage(messages.formEmail),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-right">
          {elm.superuser ? (
            <Text strong className="text-primary mr-2">
              {formatMessage(messages.superadmin)}
            </Text>
          ) : (
            <Tooltip title={formatMessage(messages.editUser)}>
              <Button
                className="mr-2"
                icon={<FormOutlined />}
                onClick={() =>
                  openUserSettings(formatMessage(messages.editUser))
                }
                size="small"
              />
            </Tooltip>
          )}
          <Tooltip title={formatMessage(messages.deleteUser)}>
            <Button
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(elm)}
              size="small"
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <Header className="ant-layout-page-header shadow-sm d-flex justify-content-sm-between">
        <Title className="mb-sm-0">{formatMessage(messages.title)}</Title>
        <Button
          type="primary"
          onClick={() => openUserSettings(formatMessage(messages.createUser))}
        >
          {formatMessage(messages.buttonNew)}
        </Button>
      </Header>
      <Content>
        <Card className="m-4 p-3">
          <Table columns={tableColumns} dataSource={dummyData} rowKey="id" />
          <UserSettingsFormModal
            title={userModalTitle}
            isModalVisible={userSettingsModalVisible}
            closeModal={closeUserSettings}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default UserSettings;
