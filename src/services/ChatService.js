import ApiService from './ApiService';
import {
  ALL_CHATS_FETCH_LIMIT,
  // ALL_CHATS_PAGINATION_LIMIT,
  CHAT_MESSAGES_PAGINATION_LIMIT,
} from 'constants/ApiConstant';
import { CHAT_FILTERS } from 'constants/ChatConstants';

const ENDPOINTS = {
  SINGLE_CHAT: '/messages/conversations/:patientId/',
  ALL_CHATS: '/messages/conversations-info/',
  SEARCH_CHATS: '/messages/search-conversations/',
  MARK_CONVERSATION_AS_READ:
    '/messages/conversations/:patientId/mark-conversation-as-read/',
  TOGGLE_RASA_ACTIVITY: '/patients/:patientId/toggle-rasa/',
  GET_MESSAGE_TEMPLATES: '/message-templates/',
  SEND_MASS_INVITE: '/messages/send-mass-invite/',
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

  // Paginated version (kept for reference):
  // getAllChatInformation = (
  //   offset = 0,
  //   limit = ALL_CHATS_PAGINATION_LIMIT,
  //   filter = CHAT_FILTERS.ALL
  // ) =>
  //   this.apiClient.get(ENDPOINTS.ALL_CHATS, {
  //     params: { limit, offset, filter },
  //   });
  getAllChatInformation = (filter = CHAT_FILTERS.ALL) =>
    this.apiClient.get(ENDPOINTS.ALL_CHATS, {
      params: { limit: ALL_CHATS_FETCH_LIMIT, filter },
    });

  // Paginated version (kept for reference):
  // searchConversations = (queryParams, limit = ALL_CHATS_PAGINATION_LIMIT) =>
  //   this.apiClient.get(ENDPOINTS.SEARCH_CHATS, {
  //     params: { ...queryParams, limit },
  //   });
  searchConversations = (queryParams) =>
    this.apiClient.get(ENDPOINTS.SEARCH_CHATS, {
      params: { ...queryParams, limit: ALL_CHATS_FETCH_LIMIT },
    });

  markConversationAsRead = (patientId) =>
    this.apiClient.put(
      ENDPOINTS.MARK_CONVERSATION_AS_READ.replace(':patientId', patientId)
    );

  toggleRasaActivity = (patientId) =>
    this.apiClient.put(
      ENDPOINTS.TOGGLE_RASA_ACTIVITY.replace(':patientId', patientId)
    );

  sendMassInvite = (data) =>
    this.apiClient.post(ENDPOINTS.SEND_MASS_INVITE, data);

  getMessageTemplates = () =>
    this.apiClient.get(ENDPOINTS.GET_MESSAGE_TEMPLATES);
}

const chatService = new ChatService();
export default chatService;
