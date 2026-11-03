import { produce } from 'immer';
import { getVisibleUnreadNotificationCount } from 'utils/notificationVisibility';

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
                // Update in main notifications array
                const notification = draft.notifications.find(n => n.id === notificationId);
                if (notification && !notification.is_read) {
                    notification.is_read = true;
                }
                // Update in categorized arrays
                const bookingNotification = draft.bookingNotifications.find(n => n.id === notificationId);
                if (bookingNotification && !bookingNotification.is_read) {
                    bookingNotification.is_read = true;
                }
                const offTopicNotification = draft.offTopicNotifications.find(n => n.id === notificationId);
                if (offTopicNotification && !offTopicNotification.is_read) {
                    offTopicNotification.is_read = true;
                }
                const humanInterventionNotification = draft.humanInterventionNotifications.find(n => n.id === notificationId);
                if (humanInterventionNotification && !humanInterventionNotification.is_read) {
                    humanInterventionNotification.is_read = true;
                }
                draft.unreadCount = getVisibleUnreadNotificationCount(draft);
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
                draft.unreadCount = getVisibleUnreadNotificationCount(draft);
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
                draft.unreadCount = getVisibleUnreadNotificationCount(draft);
                draft.fetchLoading = false;
                break;

            case 'SET_OFF_TOPIC_NOTIFICATIONS':
                draft.offTopicNotifications = action.payload || [];
                draft.unreadCount = getVisibleUnreadNotificationCount(draft);
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