import { Form } from 'antd';
import { useGetMassInvitePatientCount } from 'queries/shared';
import React from 'react';
import messages from './messages';

const PatientCountField = ({ form: { values }, setNumberOfInvites }) => {

  const { data } = useGetMassInvitePatientCount(
    values.ageFrom,
    values.ageTo,
    values.gender.toString(),
    !!values.ageFrom && !!values.ageTo && !!values.gender.length,
    setNumberOfInvites
  );

  return (
    <Form.Item>
      <span>
        {messages.numberOfInvitesLabel} {data?.data}
      </span>
    </Form.Item>
  );
};

export default PatientCountField;
