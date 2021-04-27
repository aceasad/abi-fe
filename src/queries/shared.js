import { useQuery } from 'react-query';
import anamnesisService from 'services/AnamnesisService';
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

export const useSearchMedicalConditions = (organizationId, query, enabled) =>
  useQuery(
    ['searchMedicalConditions', organizationId, query, enabled],
    () => anamnesisService.searchMedicalConditions(organizationId, query),
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
