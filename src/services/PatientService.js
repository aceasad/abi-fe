import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_SMALL_PAGINATION_LIMIT,
  ORDERING,
} from 'constants/ApiConstant';
import ApiService from './ApiService';

const ENDPOINTS = {
  GET_PATIENTS: '/patients/',
  GET_SCHEDULED_APPOINTMENTS: '/appointments/scheduled-appointments/',
  GET_APPOINTMENT_HISTORY: '/appointments/passed-appointments/',
  SEARCH_PATIENTS: '/patients-search/',
  GET_MASS_INVITE_PATIENTS_COUNT: '/patients/mass-invite-patients-count/',
  MARK_CONVERSATION_HUMAN_NOT_REQUIRED:
    '/patients/:id/mark-conversation-human-not-required/',
  MARK_CONVERSATION_NOT_IN_EMERGENCY_SITUATION:
    '/patients/:id/mark-conversation-not-in-emergency-situation/',
  UNMARK_CONVERSATION_OPT_OUT_SITUATION:
    '/patients/:id/unmark-conversation-opt-out-situation/',
  GET_PATIENTS_DETAILS_NEW_PATIENT_FORM: '/patients/patient-details/',
  GET_PATIENT_LOCATIONS: '/patients/locations/',
  VALIDATE_HOME_LOCATION_TIMESLOTS: '/patients/:id/validate-home-location-timeslots/',
  GET_CONVERSATION_STATUS_HISTORY: '/patients/:id/conversation-status-history/',
  UPLOADPATIENTSCSV: '/patients/uploadcsv/',
  PATIENTPROGRESS: '/patients/get-all-communication-status-for-patient/',
  DOWNLOADPATIENTSNOTONWHATSAPP: '/patients/download_not_on_whatsapp_patients_text_file/',
  GET_CAMPAIGNS: '/patients/campaigns/'
};

class PatientService extends ApiService {
  getPatients = ({ page = 1, order, field, search }) =>
    this.apiClient.get(ENDPOINTS.GET_PATIENTS, {
      params: {
        limit: DEFAULT_PAGINATION_LIMIT,
        offset: (page - 1) * DEFAULT_PAGINATION_LIMIT,
        ordering: `${order === ORDERING.DESC ? '-' : ''}${field}`,
        search,
      },
    });

  deletePatient = (id) =>
    this.apiClient.delete(ENDPOINTS.GET_PATIENTS + id + '/');

  getPatientDetails = (id) =>
    this.apiClient.get(ENDPOINTS.GET_PATIENTS + id + '/patient-details/');

  getPatientDetailsNewPatientForm = () =>
    this.apiClient.get(ENDPOINTS.GET_PATIENTS_DETAILS_NEW_PATIENT_FORM);

  getPatientLocations = (location_id) =>
    this.apiClient.get(ENDPOINTS.GET_PATIENT_LOCATIONS, {
      params: location_id ? { location_id: location_id } : undefined,
    });

  validateHomeLocationTimeslots = (patientId, locationId) =>
    this.apiClient.get(
      ENDPOINTS.VALIDATE_HOME_LOCATION_TIMESLOTS.replace(':id', patientId),
      {
        params: { location_id: locationId },
      }
    );

  createPatient = (data) => this.apiClient.post(ENDPOINTS.GET_PATIENTS, data);
  getPatientSingle = (id) =>
    this.apiClient.get(ENDPOINTS.GET_PATIENTS + id + '/');

  updatePatient = (id, data) =>
    this.apiClient.put(ENDPOINTS.GET_PATIENTS + id + '/', data);

  getScheduledAppointments = (id, { field, page = 1 }) =>
    this.apiClient.get(ENDPOINTS.GET_SCHEDULED_APPOINTMENTS + id + '/', {
      params: {
        ordering: field,
        limit: DEFAULT_SMALL_PAGINATION_LIMIT,
        offset: (page - 1) * DEFAULT_SMALL_PAGINATION_LIMIT,
      },
    });

  getAppointmentHistory = (id, page) =>
    this.apiClient.get(ENDPOINTS.GET_APPOINTMENT_HISTORY + id + '/', {
      params: {
        limit: DEFAULT_SMALL_PAGINATION_LIMIT,
        offset: (page - 1) * DEFAULT_SMALL_PAGINATION_LIMIT,
      },
    });

  updatePatientPart = (id, data) =>
    this.apiClient.patch(ENDPOINTS.GET_PATIENTS + id + '/', data);

  searchPatients = (query, organizationId, next) =>
    next
      ? this.apiClient.get(next)
      : this.apiClient.get(ENDPOINTS.SEARCH_PATIENTS, {
        params: {
          search: query,
          organization: organizationId,
        },
      });

  getMoreSearchResults = (next) => next && this.apiClient.get(next);

  getMassInvitePatientCount = (ageFrom, ageTo, gender) =>
    this.apiClient.get(ENDPOINTS.GET_MASS_INVITE_PATIENTS_COUNT, {
      params: {
        ageFrom,
        ageTo,
        gender,
      },
    });

  markConversationHumanNotRequired = (id) =>
    this.apiClient.post(
      ENDPOINTS.MARK_CONVERSATION_HUMAN_NOT_REQUIRED.replace(':id', id)
    );

  markConversationNotInEmergencySituation = (id) =>
    this.apiClient.post(
      ENDPOINTS.MARK_CONVERSATION_NOT_IN_EMERGENCY_SITUATION.replace(':id', id)
    );

  unmarkConversationOptOutSituation = (id) =>
    this.apiClient.post(
      ENDPOINTS.UNMARK_CONVERSATION_OPT_OUT_SITUATION.replace(':id', id)
    );
  uploadPatientCSV = (payload) => {
    const formData = new FormData();
    formData.append('file', payload.file);

    if (payload.campaignName) {
      formData.append('campaign_name', payload.campaignName);
    }

    if (payload.isPeriodicUpdate !== undefined) {
      formData.append('isPeriodicUpdate', payload.isPeriodicUpdate);
    }

    if (payload.batchSize) {
      formData.append('batch_size', payload.batchSize);
    }

    if (payload.startDate) {
      formData.append('start_date', payload.startDate);
    }

    if (payload.startTime) {
      formData.append('start_time', payload.startTime);
    }

    if (payload.frequency) {
      formData.append('frequency', payload.frequency);
    }

    return this.apiClient.post(ENDPOINTS.UPLOADPATIENTSCSV, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  getPatientProgress = () => {
    return this.apiClient.get(ENDPOINTS.PATIENTPROGRESS);
  }
  postDownloadPatientsNotOnWhatsapp = (formData) => {
    return this.apiClient.post(ENDPOINTS.DOWNLOADPATIENTSNOTONWHATSAPP, formData)
  }

  getOrganizationCampaigns = () => {
    return this.apiClient.get(ENDPOINTS.GET_CAMPAIGNS);
  }

  getConversationStatusHistory = (id) =>
    this.apiClient.get(
      ENDPOINTS.GET_CONVERSATION_STATUS_HISTORY.replace(':id', id)
    );
}

const patientService = new PatientService();
export default patientService;
