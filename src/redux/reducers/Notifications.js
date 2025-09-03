import { produce } from 'immer';

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    stats: null,
    bookingNotifications: [],
    offTopicNotifications: [],
    humanInterventionNotifications: [],
    // Loading states for different operations
    fetchLoading: false,
    markReadLoading: false,
    markAllReadLoading: false,
    statsLoading: false,
};

const notifications = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            // Sync actions
            case 'ADD_NOTIFICATION':
                const newNotification = action.payload;
                // Ensure notifications is an array
                if (!Array.isArray(draft.notifications)) {
                    draft.notifications = [];
                }
                const exists = draft.notifications.some(notif => notif.id === newNotification.id);
                if (!exists) {
                    // Convert the notification to match backend format
                    const convertedNotification = {
                        ...newNotification,
                        is_read: newNotification.isRead || false,
                        notification_type: newNotification.type || 'general',
                        created_at: newNotification.timestamp || new Date().toISOString(),
                    };
                    draft.notifications.unshift(convertedNotification);
                    draft.unreadCount += 1;
                }
                break;

            case 'MARK_NOTIFICATION_AS_READ':
                const notificationId = action.payload;
                // Update in main notifications array
                const notification = draft.notifications.find(n => n.id === notificationId);
                if (notification && !notification.is_read) {
                    notification.is_read = true;
                    draft.unreadCount = Math.max(0, draft.unreadCount - 1);
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
                draft.markReadLoading = false;
                break;

            case 'MARK_ALL_AS_READ':
                draft.notifications.forEach(notif => {
                    notif.is_read = true;
                });
                draft.unreadCount = 0;
                draft.markAllReadLoading = false;
                break;

            case 'SET_NOTIFICATIONS':
                draft.notifications = action.payload || [];
                draft.unreadCount = Array.isArray(action.payload) ? action.payload.filter(n => !n.is_read).length : 0;
                draft.fetchLoading = false;
                break;

            case 'SET_UNREAD_COUNT':
                draft.unreadCount = action.payload;
                draft.fetchLoading = false;
                break;

            // Saga actions - Fetch notifications
            case 'FETCH_NOTIFICATIONS':
                draft.fetchLoading = true;
                draft.error = null;
                break;

            case 'FETCH_UNREAD_NOTIFICATIONS':
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

            case 'FETCH_NOTIFICATION_STATS':
                draft.statsLoading = true;
                draft.error = null;
                break;

            case 'FETCH_BOOKING_NOTIFICATIONS':
                draft.fetchLoading = true;
                draft.error = null;
                break;

            case 'FETCH_OFF_TOPIC_NOTIFICATIONS':
                draft.fetchLoading = true;
                draft.error = null;
                break;

            case 'FETCH_HUMAN_INTERVENTION_NOTIFICATIONS':
                draft.fetchLoading = true;
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