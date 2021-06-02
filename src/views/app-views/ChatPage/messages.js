import { defineMessages } from 'react-intl';
export const scope = 'chat_page';
export const globalScope = 'global';
export const staffScope = 'staff_page';

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
  male: {
    id: `${staffScope}.text.male`,
    defaultMessage: 'Male',
  },
  female: {
    id: `${staffScope}.text.female`,
    defaultMessage: 'Female',
  },
  other: {
    id: `${staffScope}.text.other`,
    defaultMessage: 'Other',
  },
  ageFromLabel: {
    id: `${scope}.label.age_from`,
    defaultMessage: 'Age from',
  },
  ageToLabel: {
    id: `${scope}.label.age_to`,
    defaultMessage: 'Age to',
  },
  genderLabel: {
    id: `${scope}.label.gender`,
    defaultMessage: 'Gender',
  },
  appointmentTypeLabel: {
    id: `${scope}.label.appointment_type`,
    defaultMessage: 'Appointment Type',
  },
  templateLabel: {
    id: `${scope}.label.template`,
    defaultMessage: 'Template',
  },
  messageLabel: {
    id: `${scope}.label.message`,
    defaultMessage: 'Message: ',
  },
  sendButton: {
    id: `${scope}.button.send`,
    defaultMessage: 'Send',
  },
  cancelButton: {
    id: `${scope}.button.cancel`,
    defaultMessage: 'Cancel',
  },
  massInvitesLabel: {
    id: `${scope}.label.mass_invites`,
    defaultMessage: 'Mass Invites',
  },
  inviteSent: {
    id: `${scope}.text.invite_sent`,
    defaultMessage: 'Mass Invite sent!',
  },
});
