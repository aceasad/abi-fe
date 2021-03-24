import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import CardComponent from 'components/shared-components/Card';
import { setStaffPage, getStaff } from 'redux/actions/Staff';

import messages from './messages';
import StaffCardOptions from './StaffCardOptions';
import PaginationComponent from 'components/shared-components/Pagination';
import { makeSelectStaff, makeSelectPagination } from 'redux/selectors/Staff';
import Loading from 'components/shared-components/Loading';

export const OPTION_KEYS = {
  EDIT: 1,
  DELETE: 2,
};

const StaffList = () => {
  const { count, page } = useSelector(makeSelectPagination());
  const { staff, loading } = useSelector(makeSelectStaff());
  const dispatch = useDispatch();

  const { formatMessage } = useIntl();

  useEffect(() => {
    dispatch(getStaff());
  }, []);

  const handleOptionClick = (staffId, key) => {
    // eslint-disable-next-line default-case
    switch (key) {
      case OPTION_KEYS.DELETE:
        //TO-DO
        break;
      case OPTION_KEYS.EDIT:
        //TO-DO
        break;
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div>
        <h1>{formatMessage(messages.staff)}</h1>
        <button>{formatMessage(messages.addNewStaff)}</button>
      </div>

      {staff.map((staffItem) => (
        <CardComponent
          key={staffItem.id}
          title={staffItem.first_name + ' ' + staffItem.last_name}
          description={staffItem.seniority + ' ' + staffItem.specialization}
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
      ))}
      <PaginationComponent
        page={page}
        count={count}
        handlePageChange={(page) => dispatch(setStaffPage(page))}
      />
    </div>
  );
};

export default StaffList;
