import ApiService from './ApiService';

const ENDPOINTS = {
  DOCUMENTS: '/documents/',
};

class DocumentsService extends ApiService {
  getDocuments = () => this.apiClient.get(`${ENDPOINTS.DOCUMENTS}`);

  createDocument = (payload) => {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('document_name', payload.document_name);
    if (Array.isArray(payload.appointment_type_ids)) {
      formData.append(
        'appointment_type_ids',
        JSON.stringify(payload.appointment_type_ids)
      );
    }
    if (payload.location) {
      formData.append('location', JSON.stringify(payload.location));
    }

    return this.apiClient.post(ENDPOINTS.DOCUMENTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  updateDocument = (payload) => {
    const formData = new FormData();
    if (payload.document_name != null && payload.document_name !== '') {
      formData.append('document_name', payload.document_name);
    }
    if (Array.isArray(payload.appointment_type_ids) && payload.appointment_type_ids.length > 0) {
      formData.append('appointment_type_ids', JSON.stringify(payload.appointment_type_ids));
    }
    if (payload.location) {
      formData.append('location', JSON.stringify(payload.location));
    }
    if (payload.file) {
      formData.append('file', payload.file);
    }
    return this.apiClient.patch(`${ENDPOINTS.DOCUMENTS}${payload.id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  deleteDocumentById = (id) =>
    this.apiClient.delete(`${ENDPOINTS.DOCUMENTS}${id}/`);

  getAppointments = () => this.apiClient.get(`/appointment-types/`);

  questionAnswering = (payload) =>
    this.apiClient.post(`${ENDPOINTS.DOCUMENTS}question-answering/`, payload);
}

const documentsService = new DocumentsService();
export default documentsService;
