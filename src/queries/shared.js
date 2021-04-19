import { useQuery } from 'react-query';
import AppointmentService from 'services/AppointmentService';

export const useGetAvailableTimeslots = (
  doctor,
  patient,
  appointmentType,
  date,
  setDisabledCallback
) =>
  useQuery(
    ['getAvailableTimeslots', doctor, patient, appointmentType, date],
    () =>
      AppointmentService.getAvailabileTimeslots(
        doctor,
        patient,
        appointmentType,
        date
      ),
    {
      enabled: !!date && !!doctor && !!patient && !!appointmentType,
      onSuccess: (data) => setDisabledCallback(data),
    }
  );
