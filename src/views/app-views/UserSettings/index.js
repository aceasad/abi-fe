import React, { useEffect, useState } from 'react';
import { interpolate } from 'utils/interpolate';
import {
  Table,
  Tooltip,
  Typography,
  Button,
  Modal,
  message,
  Space,
} from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUsers, setUsersPage } from 'redux/actions/User';
import { makeSelectUsers } from 'redux/selectors/Users';
import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import Flex from 'components/shared-components/Flex';

const { Text } = Typography;
const { confirm } = Modal;

const USER_FORM = {
  CREATE: 1,
  UPDATE: 2,
};

const UserSettings = () => {
  const dispatch = useDispatch();
  const { users, page, count, loading } = useSelector(makeSelectUsers());

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const [activeForm, setActiveForm] = useState();

  const afterDelete = () => {
    message.success("User Deleted");
  };

  const onDeleteError = () => {
    message.error("Failed to delete user. Please try again.");
  };

  const showDeleteConfirm = (element) => {
    confirm({
      title: interpolate("Are you sure you want to delete {user}?", {
        user: element.name,
      }),
      okText: "Confirm",
      okType: 'danger',
      cancelText: "Cancel",
      onOk() {
        dispatch(deleteUser({ id: element.id, afterDelete, onDeleteError }));
      },
    });
  };

  const closeUserForm = () => setActiveForm(null);

  const getActiveUserForm = () => {
    switch (activeForm?.id) {
      case USER_FORM.UPDATE:
        return (
          <UpdateUser closeModal={closeUserForm} userId={activeForm.data} />
        );
      case USER_FORM.CREATE:
        return <CreateUser closeModal={closeUserForm} />;
      default:
        return null;
    }
  };

  const handlePaginationChange = (page) => {
    dispatch(setUsersPage(page));
  };

  const tableColumns = [
    {
      title: "Name",
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: "Email",
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-right">
          <Space>
            {elm.is_organization_owner && (
              <Text strong className="text-primary">
                {"clinic admin"}
              </Text>
            )}

            {!elm.is_organization_owner && (
              <>
                <Tooltip title={"Edit User"}>
                  <Button
                    icon={<FormOutlined />}
                    onClick={() =>
                      setActiveForm({ id: USER_FORM.UPDATE, data: elm.id })
                    }
                    size="small"
                  />
                </Tooltip>
                <Tooltip title={"Delete User"}>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteConfirm(elm)}
                    size="small"
                  />
                </Tooltip>
              </>
            )}
          </Space>
        </div>
      ),
    },
  ];
  return (
    <div className="p-2">
      <Flex justifyContent="between">
        <Typography.Title level={3} className="mb-4">
          {"User Settings"}
        </Typography.Title>
        <Button
          type="primary"
          onClick={() => setActiveForm({ id: USER_FORM.CREATE })}
        >
          {"New User"}
        </Button>
      </Flex>

      <Table
        columns={tableColumns}
        rowKey="id"
        dataSource={users.map((pat) => ({ ...pat, key: pat.id }))}
        pagination={{
          defaultPageSize: DEFAULT_PAGINATION_LIMIT,
          total: count,
          onChange: handlePaginationChange,
          hideOnSinglePage: true,
          current: page,
        }}
        loading={loading}
      />
      {getActiveUserForm()}
    </div>
  );
};

export default UserSettings;
