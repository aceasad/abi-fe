import ApiService from './ApiService';

const ENDPOINTS = {
    GET_NOTIFICATIONS: '/notifications/',
    GET_UNREAD_NOTIFICATIONS: '/notifications/unread/',
    MARK_NOTIFICATION_AS_READ: '/notifications/:id/mark-read/',
    MARK_ALL_NOTIFICATIONS_AS_READ: '/notifications/mark-all-read/',
    GET_NOTIFICATIONS_BY_PATIENT: '/notifications/by-patient/',
    GET_BOOKING_NOTIFICATIONS: '/notifications/booking/',
    GET_OFF_TOPIC_NOTIFICATIONS: '/notifications/off-topic/',
    GET_HUMAN_INTERVENTION_NOTIFICATIONS: '/notifications/human-intervention/',
    GET_NOTIFICATIONS_BY_PRIORITY: '/notifications/by-priority/',
    GET_NOTIFICATION_STATS: '/notifications/stats/',
    GET_RECENT_NOTIFICATIONS: '/notifications/recent/',
};

class NotificationService extends ApiService {
    // Get all notifications
    getNotifications = (params = {}) =>
        this.apiClient.get(ENDPOINTS.GET_NOTIFICATIONS, {
            params,
        });

    // Get unread notifications
    getUnreadNotifications = () =>
        this.apiClient.get(ENDPOINTS.GET_UNREAD_NOTIFICATIONS);

    // Mark notification as read
    markNotificationAsRead = (notificationId) =>
        this.apiClient.post(
            ENDPOINTS.MARK_NOTIFICATION_AS_READ.replace(':id', notificationId)
        );

    // Mark all notifications as read
    markAllNotificationsAsRead = () =>
        this.apiClient.post(ENDPOINTS.MARK_ALL_NOTIFICATIONS_AS_READ);

    // Get notifications by patient
    getNotificationsByPatient = (patientId) =>
        this.apiClient.get(ENDPOINTS.GET_NOTIFICATIONS_BY_PATIENT, {
            params: {
                patient_id: patientId,
            },
        });

    // Get booking notifications
    getBookingNotifications = () =>
        this.apiClient.get(ENDPOINTS.GET_BOOKING_NOTIFICATIONS);

    // Get off-topic notifications
    getOffTopicNotifications = () =>
        this.apiClient.get(ENDPOINTS.GET_OFF_TOPIC_NOTIFICATIONS);

    // Get human intervention notifications
    getHumanInterventionNotifications = () =>
        this.apiClient.get(ENDPOINTS.GET_HUMAN_INTERVENTION_NOTIFICATIONS);

    // Get notifications by priority
    getNotificationsByPriority = (priority = 'medium') =>
        this.apiClient.get(ENDPOINTS.GET_NOTIFICATIONS_BY_PRIORITY, {
            params: {
                priority,
            },
        });

    // Get notification statistics
    getNotificationStats = () =>
        this.apiClient.get(ENDPOINTS.GET_NOTIFICATION_STATS);

    // Get recent notifications
    getRecentNotifications = (limit = 20) =>
        this.apiClient.get(ENDPOINTS.GET_RECENT_NOTIFICATIONS, {
            params: {
                limit,
            },
        });

    // Create a new notification (if needed)
    createNotification = (notificationData) =>
        this.apiClient.post(ENDPOINTS.GET_NOTIFICATIONS, notificationData);
}

export default new NotificationService(); 