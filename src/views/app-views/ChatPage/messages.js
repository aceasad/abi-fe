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
    defaultMessage: 'Mass invites',
  },
  searchPlaceholder: {
    id: `${globalScope}.text.search`,
    defaultMessage: 'Search',
  },
  userInfo: {
    id: `${scope}.menu.user_info_label`,
    defaultMessage: 'Patient info',
  },
  muteChat: {
    id: `${scope}.menu.mute_chat`,
    defaultMessage: 'Mute chat',
  },
  deleteChat: {
    id: `${scope}.menu.delete_chat`,
    defaultMessage: 'Delete chat',
  },
  typeAMessagePlaceholder: {
    id: `${scope}.chat.type_a_message_placeholder`,
    defaultMessage: 'Type a message...',
  },
  pauseAsa: {
    id: `${scope}.chat.pause_asa`,
    defaultMessage: 'Pause Asa',
  },
  unpauseAsa: {
    id: `${scope}.chat.unpause_asa`,
    defaultMessage: 'Unpause Asa',
  },
  contactedPatient: {
    id: `${scope}.chat.resolve_human_required`,
    defaultMessage: 'Contacted patient',
  },
  emergencyResolved: {
    id: `${scope}.chat.resolve_emergency_situation`,
    defaultMessage: 'Emergency resolved',
  },
  optOut: {
    id: `${scope}.chat.opt_out`,
    defaultMessage: 'Opt-Out',
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
    defaultMessage: 'Appointment type',
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
    defaultMessage: 'Mass invites',
  },
  inviteSent: {
    id: `${scope}.text.invite_sent`,
    defaultMessage: 'Mass invite sent!',
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
  inEmergencySituationFilter: {
    id: `${scope}.filters.in_emergency_situation`,
    defaultMessage: 'In emergency situation',
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
    defaultMessage: 'Please pause Asa to send a message',
  },
  chatDisabledPlaceholder: {
    id: `${scope}.placeholder.chat_disabled`,
    defaultMessage: 'Last message was more than 24 hours ago',
  },
});
