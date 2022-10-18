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
    formData.append('appointment_type_name', payload.appointment_type_name);

    return this.apiClient.post(ENDPOINTS.DOCUMENTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  updateDocument = (payload) =>
    this.apiClient.patch(`${ENDPOINTS.DOCUMENTS}${payload.id}/`, payload);

  deleteDocumentById = (id) =>
    this.apiClient.delete(`${ENDPOINTS.DOCUMENTS}${id}/`);
}

const documentsService = new DocumentsService();
export default documentsService;
