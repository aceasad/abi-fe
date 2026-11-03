import { produce } from 'immer';

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    bookingNotifications: [],
    offTopicNotifications: [],
    humanInterventionNotifications: [],
    fetchLoading: false,
    markReadLoading: false,
    markAllReadLoading: false,
};

const notifications = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case 'MARK_NOTIFICATION_AS_READ':
                const notificationId = action.payload;
                let wasUnread = false;
                const markRead = (items) => {
                    const item = items.find((n) => n.id === notificationId);
                    if (item && !item.is_read) {
                        wasUnread = true;
                        item.is_read = true;
                    }
                };
                markRead(draft.notifications);
                markRead(draft.bookingNotifications);
                markRead(draft.offTopicNotifications);
                markRead(draft.humanInterventionNotifications);
                if (wasUnread) {
                    draft.unreadCount = Math.max(0, (draft.unreadCount || 0) - 1);
                }
                draft.markReadLoading = false;
                break;

            case 'MARK_ALL_AS_READ':
                [draft.notifications, draft.bookingNotifications, draft.offTopicNotifications, draft.humanInterventionNotifications]
                    .forEach((items) => {
                        items.forEach((notif) => {
                            notif.is_read = true;
                        });
                    });
                draft.unreadCount = 0;
                draft.markAllReadLoading = false;
                break;

            case 'SET_NOTIFICATIONS':
                draft.notifications = action.payload || [];
                draft.fetchLoading = false;
                break;

            case 'SET_UNREAD_COUNT':
                draft.unreadCount = action.payload;
                draft.fetchLoading = false;
                break;

            case 'FETCH_UNREAD_NOTIFICATIONS':
                draft.fetchLoading = true;
                draft.error = null;
                break;

            case 'FETCH_NOTIFICATION_DASHBOARD':
                draft.fetchLoading = true;
                draft.error = null;
                break;

            case 'MARK_NOTIFICATION_AS_READ_SAGA':
                draft.markReadLoading = true;
                draft.error = null;
                break;

            case 'MARK_NOTIFICATION_AS_READ_SAGA_ERROR':
                draft.markReadLoading = false;
                break;

            case 'MARK_ALL_NOTIFICATIONS_AS_READ':
                draft.markAllReadLoading = true;
                draft.error = null;
                break;

            // Category-specific actions
            case 'SET_BOOKING_NOTIFICATIONS':
                draft.bookingNotifications = action.payload || [];
                draft.fetchLoading = false;
                break;

            case 'SET_OFF_TOPIC_NOTIFICATIONS':
                draft.offTopicNotifications = action.payload || [];
                draft.fetchLoading = false;
                break;

            case 'SET_HUMAN_INTERVENTION_NOTIFICATIONS':
                console.log('Setting human intervention notifications:', action.payload);
                draft.humanInterventionNotifications = action.payload || [];
                draft.fetchLoading = false;
                break;

            default:
                break;
        }
    });
};

export default notifications; 