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

export const useGetOperationTypes = (organization, data, next, enabled) =>
  useQuery(
    ['getOperationTypes', organization, data, next, enabled],
    async () =>
      next
        ? await anamnesisService.getNextOrganizationTypePage(next)
        : await anamnesisService.getOrganizationTypes({ organization, data }),
    {
      enabled,
      refetchOnWindowFocus: false,
      onSuccess: ({ data }) => data,
    }
  );
