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
    if (payload.document_type) {
      formData.append('document_type', payload.document_type);
    }
    if (payload.appointment_type_id != null && payload.appointment_type_id !== '') {
      formData.append('appointment_type_id', payload.appointment_type_id);
    }
    if (payload.location_id != null && payload.location_id !== '') {
      formData.append('location_id', payload.location_id);
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
    if (payload.document_type) {
      formData.append('document_type', payload.document_type);
    }
    if (payload.appointment_type_id != null) {
      formData.append('appointment_type_id', payload.appointment_type_id);
    }
    if (payload.location_id != null) {
      formData.append('location_id', payload.location_id);
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
