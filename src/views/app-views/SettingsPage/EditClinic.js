import React from 'react';
import ClinicPage from '../ClinicPage';

const clinicData = {
  photo: null,
  name: 'Klinika',
  phone_number: '124124124',
  address: 'adresa neka',
  google_maps_link: 'https://google.com',
  parking_availability: 'NO',
  parking_size: 0,
  start_of_work: '08:00',
  end_of_work: '22:00',
};

const EditClinic = () => {
  return (
    <>
      <ClinicPage clinicData={clinicData} />
    </>
  );
};

export default EditClinic;
