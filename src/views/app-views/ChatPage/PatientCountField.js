import { Form } from 'antd';
import { useGetMassInvitePatientCount } from 'queries/shared';
import React from 'react';

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
        {"Number of invites: "} {data?.data}
      </span>
    </Form.Item>
  );
};

export default PatientCountField;
