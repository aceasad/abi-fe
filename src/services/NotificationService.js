import ApiService from './ApiService';

const ENDPOINTS = {
    GET_UNREAD_NOTIFICATIONS: '/notifications/unread/',
    MARK_NOTIFICATION_AS_READ: '/notifications/:id/mark-read/',
    MARK_ALL_NOTIFICATIONS_AS_READ: '/notifications/mark-all-read/',
    GET_BOOKING_NOTIFICATIONS: '/notifications/booking/',
    GET_OFF_TOPIC_NOTIFICATIONS: '/notifications/off-topic/',
    GET_HUMAN_INTERVENTION_NOTIFICATIONS: '/notifications/human-intervention/',
};

class NotificationService extends ApiService {
    getUnreadNotifications = (params = {}) =>
        this.apiClient.get(ENDPOINTS.GET_UNREAD_NOTIFICATIONS, { params });

    markNotificationAsRead = (notificationId) =>
        this.apiClient.post(
            ENDPOINTS.MARK_NOTIFICATION_AS_READ.replace(':id', notificationId)
        );

    markAllNotificationsAsRead = () =>
        this.apiClient.post(ENDPOINTS.MARK_ALL_NOTIFICATIONS_AS_READ);

    getBookingNotifications = (params = {}) =>
        this.apiClient.get(ENDPOINTS.GET_BOOKING_NOTIFICATIONS, { params });

    getOffTopicNotifications = (params = {}) =>
        this.apiClient.get(ENDPOINTS.GET_OFF_TOPIC_NOTIFICATIONS, { params });

    getHumanInterventionNotifications = (params = {}) =>
        this.apiClient.get(ENDPOINTS.GET_HUMAN_INTERVENTION_NOTIFICATIONS, { params });
}

export default new NotificationService();
