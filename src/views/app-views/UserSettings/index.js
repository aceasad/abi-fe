import React, { useState } from 'react';
import { Table, Tooltip, Typography, Button, Modal } from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import UserSettingsFormModal from 'containers/Forms/UserSettings/UserSettingsFormModal';
import { useIntl } from 'react-intl';
import Flex from 'components/shared-components/Flex';

const { Text } = Typography;
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
      title: formatMessage(
        {
          id: 'user_settings.modal.delete.description',
        },
        { user: element.userName }
      ),
      okText: formatMessage({
        id: 'user_settings.form.button.confirm',
      }),
      okType: 'danger',
      cancelText: formatMessage({
        id: 'user_settings.form.button.cancel',
      }),
      onOk() {
        // Implement on confirm logic.
      },
    });
  };

  const tableColumns = [
    {
      title: formatMessage({ id: 'user_settings.form.name' }),
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: formatMessage({ id: 'user_settings.form.email' }),
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
              {formatMessage({ id: 'user_settings.superadmin' })}
            </Text>
          ) : (
            <Tooltip
              title={formatMessage({
                id: 'user_settings.form.title.edit_user',
              })}
            >
              <Button
                className="mr-2"
                icon={<FormOutlined />}
                onClick={() =>
                  openUserSettings(
                    formatMessage({
                      id: 'user_settings.form.title.edit_user',
                    })
                  )
                }
                size="small"
              />
            </Tooltip>
          )}
          <Tooltip
            title={formatMessage({
              id: 'user_settings.form.title.delete_user',
            })}
          >
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
    <div className="p-2">
      <Flex justifyContent="between">
        <Typography.Title level={2} className="mb-4">
          {formatMessage({
            id: 'user_settings.title',
          })}
        </Typography.Title>
        <Button
          type="primary"
          onClick={() =>
            openUserSettings(
              formatMessage({
                id: 'user_settings.form.titile.create_user',
              })
            )
          }
        >
          {formatMessage({
            id: 'user_settings.form.button.new',
          })}
        </Button>
      </Flex>
      <Table columns={tableColumns} dataSource={dummyData} rowKey="id" />

      <UserSettingsFormModal
        title={userModalTitle}
        isModalVisible={userSettingsModalVisible}
        closeModal={closeUserSettings}
      />
    </div>
  );
};

export default UserSettings;
