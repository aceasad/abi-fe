import ApiService from './ApiService';
import {
  ALL_CHATS_PAGINATION_LIMIT,
  CHAT_MESSAGES_PAGINATION_LIMIT,
} from 'constants/ApiConstant';

const ENDPOINTS = {
  SINGLE_CHAT: '/messages/conversations/:patientId/',
  ALL_CHATS: '/messages/conversations-info/',
};

class ChatService extends ApiService {
  getSingleChat = (
    patientId,
    next = null,
    limit = CHAT_MESSAGES_PAGINATION_LIMIT
  ) =>
    next
      ? this.apiClient.get(next)
      : this.apiClient.get(
          ENDPOINTS.SINGLE_CHAT.replace(':patientId', patientId),
          {
            params: {
              limit,
            },
          }
        );

  getAllChatInformation = (next = null, limit = ALL_CHATS_PAGINATION_LIMIT) =>
    next
      ? this.apiClient.get(next)
      : this.apiClient.get(ENDPOINTS.ALL_CHATS, { params: { limit } });
}

const chatService = new ChatService();
export default chatService;
