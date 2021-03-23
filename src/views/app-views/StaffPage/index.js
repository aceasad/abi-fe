import CardComponent from 'components/shared-components/Card';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getStaff } from 'redux/actions/Staff';
import { makeSelectStaff } from 'redux/selectors/Staff';

import messages from './messages';
import StaffCardOptions from './StaffCardOptions';

export const OPTION_KEYS = {
  EDIT: 1,
  DELETE: 2,
};

const StaffPage = () => {
  const dispatch = useDispatch();
  const staff = useSelector(makeSelectStaff());
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
    </div>
  );
};

export default StaffPage;
