import { useMutation, useQuery } from 'react-query';
import anamnesisService from 'services/AnamnesisService';
import appointmentService from 'services/AppointmentService';
import AppointmentService from 'services/AppointmentService';
import chatService from 'services/ChatService';
import patientService from 'services/PatientService';

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
      refetchOnWindowFocus: false,
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

export const useGetMassInvitePatientCount = (
  ageFrom,
  ageTo,
  gender,
  enabled,
  successCallback
) =>
  useQuery(
    ['getMassInvitePatientsCount', ageFrom, ageTo, gender, enabled],
    () => patientService.getMassInvitePatientCount(ageFrom, ageTo, gender),
    {
      enabled,
      refetchOnWindowFocus: false,
      onSuccess: (data) => successCallback(data.data),
    }
  );

export const useGetMassInviteMessageTemplates = (setTemplates) =>
  useQuery(
    ['getMassInviteMessageTemplates'],
    () => chatService.getMessageTemplates(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => setTemplates(data.data),
    }
  );

export const useGetAppointmentTypes = (setAppointmentTypes) =>
  useQuery(
    ['getAppointmentTypes'],
    () => appointmentService.getAppointmentTypes(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => setAppointmentTypes(data.data.results),
    }
  );

export const useToggleRasaActivity = () =>
  useMutation(chatService.toggleRasaActivity);

export const useMarkConversationAsRead = () =>
  useMutation(chatService.markConversationAsRead);
