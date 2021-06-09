import ApiService from './ApiService';
import {
  ALL_CHATS_PAGINATION_LIMIT,
  CHAT_MESSAGES_PAGINATION_LIMIT,
} from 'constants/ApiConstant';

const ENDPOINTS = {
  SINGLE_CHAT: '/messages/conversations/:patientId/',
  ALL_CHATS: '/messages/conversations-info/',
  SEARCH_CHATS: '/messages/search-conversations/',
  MARK_CONVERSATION_AS_READ:
    '/messages/conversations/:patientId/mark-conversation-as-read/',
  TOGGLE_RASA_ACTIVITY: '/patients/:patientId/toggle-rasa/',
};

class ChatService extends ApiService {
  getSingleChat = (
    patientId,
    offset = 0,
    limit = CHAT_MESSAGES_PAGINATION_LIMIT
  ) =>
    this.apiClient.get(ENDPOINTS.SINGLE_CHAT.replace(':patientId', patientId), {
      params: {
        limit,
        offset,
      },
    });

  getAllChatInformation = (offset = 0, limit = ALL_CHATS_PAGINATION_LIMIT) =>
    this.apiClient.get(ENDPOINTS.ALL_CHATS, { params: { limit, offset } });

  searchConversations = (query) =>
    this.apiClient.get(ENDPOINTS.SEARCH_CHATS, { params: { query } });

  markConversationAsRead = (patientId) =>
    this.apiClient.put(
      ENDPOINTS.MARK_CONVERSATION_AS_READ.replace(':patientId', patientId)
    );

  toggleRasaActivity = (patientId) =>
    this.apiClient.put(
      ENDPOINTS.TOGGLE_RASA_ACTIVITY.replace(':patientId', patientId)
    );
}

const chatService = new ChatService();
export default chatService;
