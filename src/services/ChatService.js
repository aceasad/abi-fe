import ApiService from './ApiService';
import {
  ALL_CHATS_PAGINATION_LIMIT,
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

const MAX_CHAT_PAGE_SIZE = 100;
const MAX_CHAT_OFFSET = 20000;

const clampChatPagination = ({ offset = 0, limit }) => ({
  offset: Math.max(0, Math.min(Number(offset) || 0, MAX_CHAT_OFFSET)),
  limit: Math.max(1, Math.min(Number(limit) || ALL_CHATS_PAGINATION_LIMIT, MAX_CHAT_PAGE_SIZE)),
});

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

  getAllChatInformation = (
    offset = 0,
    limit = ALL_CHATS_PAGINATION_LIMIT,
    filter = CHAT_FILTERS.ALL,
    location
  ) => {
    const pagination = clampChatPagination({ offset, limit });
    return this.apiClient.get(ENDPOINTS.ALL_CHATS, {
      params: {
        limit: pagination.limit,
        offset: pagination.offset,
        filter,
        ...(location ? { location } : {}),
      },
    });
  }

  searchConversations = (queryParams, limit = ALL_CHATS_PAGINATION_LIMIT) => {
    const pagination = clampChatPagination({
      offset: queryParams?.offset,
      limit,
    });
    return this.apiClient.get(ENDPOINTS.SEARCH_CHATS, {
      params: {
        ...queryParams,
        limit: pagination.limit,
        ...(queryParams?.offset !== undefined ? { offset: pagination.offset } : {}),
      },
    });
  }

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
