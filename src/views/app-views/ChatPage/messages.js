import { defineMessages } from 'react-intl';
export const scope = 'chat_page';
export const globalScope = 'global';

export default defineMessages({
  conversationsTitle: {
    id: `${scope}.title`,
    defaultMessage: 'Conversations',
  },
  conversationsMassInvites: {
    id: `${scope}.button.mass_invites`,
    defaultMessage: 'Mass Invites',
  },
  searchPlaceholder: {
    id: `${globalScope}.text.search`,
    defaultMessage: 'Search',
  },
  userInfo: {
    id: `${scope}.menu.user_info_label`,
    defaultMessage: 'User Info',
  },
  muteChat: {
    id: `${scope}.menu.mute_chat`,
    defaultMessage: 'Mute Chat',
  },
  deleteChat: {
    id: `${scope}.menu.delete_chat`,
    defaultMessage: 'Delete Chat',
  },
  typeAMessagePlaceholder: {
    id: `${scope}.chat.type_a_message_placeholder`,
    defaultMessage: 'Type a message...',
  },
  rasaPaused: {
    id: `${scope}.chat.rasa_paused`,
    defaultMessage: 'Rasa paussed',
  },
  socketErrorMessage: {
    id: `${scope}.chat.socket_error_message`,
    defaultMessage: 'Please refresh page to reconnect',
  },
});
