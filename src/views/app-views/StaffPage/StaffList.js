import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import CardComponent from 'components/shared-components/Card';
import { setStaffPage, getStaff } from 'redux/actions/Staff';

import messages from './messages';
import StaffCardOptions from './StaffCardOptions';
import PaginationComponent from 'components/custom-components/Pagination';
import { makeSelectStaff, makeSelectPagination } from 'redux/selectors/Staff';
import Loading from 'components/shared-components/Loading';
import Modal from 'components/shared-components/Modal';
import { deleteStaff } from 'redux/actions/Staff';
import { message, List, Button, PageHeader } from 'antd';

export const OPTION_KEYS = {
  EDIT: '1',
  DELETE: '2',
};

const StaffList = ({ showCreate, editUser }) => {
  const [staffForDelete, setStaffForDelete] = useState();

  const { count, page } = useSelector(makeSelectPagination());
  const { staff, loading } = useSelector(makeSelectStaff());

  const dispatch = useDispatch();

  const { formatMessage } = useIntl();

  useEffect(() => {
    dispatch(getStaff());
  }, []);

  useEffect(() => {
    if (staff.length === 0 && page > 1) dispatch(setStaffPage(page - 1));
  }, [staff]);

  const afterDelete = () => {
    setStaffForDelete(null);
    message.success(formatMessage(messages.deletedSuccess));
  };

  const handleDelete = () => {
    dispatch(deleteStaff({ id: staffForDelete, afterDelete }));
  };

  const handleOptionClick = (data, key) => {
    // eslint-disable-next-line default-case
    switch (key) {
      case OPTION_KEYS.DELETE:
        setStaffForDelete(data);
        break;
      case OPTION_KEYS.EDIT:
        editUser(data);
        break;
    }
  };

  const getStaffFirstAndLastName = () => {
    if (staffForDelete) {
      const foundStaff = staff.find((s) => s.id === staffForDelete);
      return foundStaff.first_name + ' ' + foundStaff.last_name;
    }
    return '';
  };

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={formatMessage(messages.staff)}
        extra={[
          <Button type="primary" onClick={showCreate}>
            {formatMessage(messages.addNewStaff)}
          </Button>,
        ]}
      />

      {loading ? (
        <Loading />
      ) : (
        <>
          <List
            grid={{
              gutter: 8,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 5,
            }}
            dataSource={staff}
            renderItem={(staffItem) => (
              <List.Item>
                <CardComponent
                  key={staffItem.id}
                  title={staffItem.first_name + ' ' + staffItem.last_name}
                  description={
                    staffItem.seniority + ' ' + staffItem.specialization
                  }
                  avatar={staffItem.profile_picture}
                  action={formatMessage(messages.seeAppointments)}
                  Options={() => (
                    <StaffCardOptions
                      handleMenuClick={({ key }) =>
                        handleOptionClick(staffItem.id, key)
                      }
                    />
                  )}
                  handleClick={() => {
                    //TO-DO
                  }}
                />
              </List.Item>
            )}
          />
          <PaginationComponent
            page={page}
            count={count}
            handlePageChange={(page) => dispatch(setStaffPage(page))}
          />
          <Modal
            title={formatMessage(messages.deleteTitle)}
            description={formatMessage(messages.deleteDescription, {
              label: getStaffFirstAndLastName(),
            })}
            primaryAction={formatMessage(messages.delete)}
            secondaryAction={formatMessage(messages.cancel)}
            visible={staffForDelete}
            handlePrimaryAction={handleDelete}
            handleSecondaryAction={() => setStaffForDelete(null)}
          />
        </>
      )}
    </>
  );
};

export default StaffList;
