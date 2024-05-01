import ApiService from './ApiService';

const ENDPOINTS = {
    SYNCPAS: '/appointments/pas_sync/',
}
class PasService extends ApiService {

    updatePas = () =>{
        return this.apiClient.get(ENDPOINTS.SYNCPAS)
    }


}

const pasService = new PasService();
export default pasService;