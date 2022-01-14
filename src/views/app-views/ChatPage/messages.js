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
    defaultMessage: 'Patient Info',
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
    defaultMessage: 'Asa paused',
  },
  markResolved: {
    id: `${scope}.chat.mark_resolved`,
    defaultMessage: 'Mark resolved',
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
  socketErrorMessage: {
    id: `${scope}.chat.socket_error_message`,
    defaultMessage: 'Please refresh page to reconnect',
  },
  numberOfInvitesLabel: {
    id: `${scope}.label.number_of_invites`,
    defaultMessage: 'Number of invites: ',
  },
  humanInterventionRequiredFilter: {
    id: `${scope}.filters.human_invervention_required`,
    defaultMessage: 'Human intervention required',
  },
  likelyToMissNextAppointmentFilter: {
    id: `${scope}.filters.likely_to_miss_next_appointment`,
    defaultMessage: 'Likely to miss their next appointment',
  },
  allFilter: {
    id: `${scope}.filters.all`,
    defaultMessage: 'All',
  },
  pauseRasaPlaceholder: {
    id: `${scope}.placeholder.pause_rasa`,
    defaultMessage: 'Please pause chatbot to send a message',
  },
  chatDisabledPlaceholder: {
    id: `${scope}.placeholder.chat_disabled`,
    defaultMessage: 'Last message was more than 24 hours ago',
  },
});
