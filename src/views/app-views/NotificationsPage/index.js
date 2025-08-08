import React, { useEffect, useState } from 'react';
import {
    Button,
    Typography,
    Card,
    Space,
    Badge,
    List,
    Row,
    Col,
    Grid,
    Spin
} from 'antd';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectLoginDetails } from 'redux/selectors/Auth';
import {
    makeSelectNotifications,
    makeSelectUnreadCount,
    makeSelectFetchLoading,
    makeSelectMarkReadLoading,
    makeSelectMarkAllReadLoading,
    makeSelectBookingNotifications,
    makeSelectOffTopicNotifications
} from 'redux/selectors/Notifications';
import { createWebsocketNotificationUrl, parseReceivedEvent } from 'utils/helpers';
import { addOneMessage, resetChats } from 'redux/actions/Chats';
import {
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    fetchNotifications,
    fetchBookingNotifications,
    fetchOffTopicNotifications
} from 'redux/actions/Notifications';
import WebSocketClient from 'services/WebSocketClient';
import { API_BASE_URL } from 'configs/AppConfig';
import utils from 'utils';
import {
    BellOutlined,
    MessageOutlined,
    UserOutlined,
    ExclamationOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const Notification = () => {
    const { formatMessage } = useIntl();
    const { token } = useSelector(makeSelectLoginDetails());
    const notifications = useSelector(makeSelectNotifications()) || [];
    const unreadCount = useSelector(makeSelectUnreadCount()) || 0;
    const fetchLoading = useSelector(makeSelectFetchLoading()) || false;
    const markReadLoading = useSelector(makeSelectMarkReadLoading()) || false;
    const markAllReadLoading = useSelector(makeSelectMarkAllReadLoading()) || false;
    const bookingNotifications = useSelector(makeSelectBookingNotifications()) || [];
    const offTopicNotifications = useSelector(makeSelectOffTopicNotifications()) || [];
    const dispatch = useDispatch();

    const screens = utils.getBreakPoint(useBreakpoint());
    const isMobile = !screens.includes('lg');

    // State for RASA health check
    const [rasaHealthy, setRasaHealthy] = useState('');

    // WebSocket message handler - refresh notifications when new ones arrive
    const handleReceiveMessage = (event) => {
        const parsedMessage = parseReceivedEvent(event);
        console.log('WebSocket notification received:', parsedMessage);

        // Refresh notifications from backend since new ones are saved there
        dispatch(fetchNotifications());
        dispatch(fetchBookingNotifications());
        dispatch(fetchOffTopicNotifications());
    };

    // Your original WebSocket setup
    useEffect(() => {
        WebSocketClient.isComponentMounted = true;
        return () => {
            WebSocketClient.isComponentMounted = false;
            WebSocketClient.closeConnection();
        };
    }, []);

    useEffect(() => {
        const socketUrl = createWebsocketNotificationUrl(token);
        if (token) {
            WebSocketClient.connect(socketUrl, () => { }, handleReceiveMessage);
            WebSocketClient.waitForConnection();
        }
    }, [token]);

    // Load notifications from API on component mount
    useEffect(() => {
        dispatch(fetchNotifications());
        dispatch(fetchBookingNotifications());
        dispatch(fetchOffTopicNotifications());
    }, [dispatch]);

    // Your original RASA health check
    useEffect(() => {
        fetch(`${API_BASE_URL}/errors/rasa-health/`)
            .then((res) => setRasaHealthy(res.ok))
            .catch(() => setRasaHealthy(false));
    }, []);

    // Mark as read functions using Redux
    const markAsRead = (notificationId) => {
        console.log('Marking notification as read:', notificationId);
        if (markReadLoading) {
            console.log('Already marking as read, skipping...');
            return;
        }
        dispatch(markNotificationAsRead(notificationId));
    };

    const markAllAsRead = () => {
        console.log('Component: Mark all as read clicked');
        dispatch(markAllNotificationsAsRead());
    };

    // Your original time formatting function
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    // Define human intervention notification types
    const humanInterventionTypes = [
        'Emergency Situation',
        'Human Intervention',
        'Opt out',
        'Screened Elsewhere',
        'Decline',
        'Snoozed'
    ];

    // Use categorized notifications from Redux state - filter to show only unread notifications
    const categorizedNotifications = {
        bookingNotes: bookingNotifications.filter(n => !n.is_read),
        offTopic: offTopicNotifications.filter(n => !n.is_read),
        humanIntervention: notifications.filter(n =>
            !n.is_read &&
            humanInterventionTypes.includes(n.notification_type)
        )
    };

    // Debug logging
    console.log('Notification state:', {
        bookingNotifications,
        offTopicNotifications,
        notifications,
        categorizedNotifications
    });

    const getNotificationIcon = (notificationType, priority) => {
        if (priority === 'high') {
            return <ExclamationOutlined style={{ color: '#ff4d4f' }} />;
        }
        switch (notificationType) {
            case 'error':
            case 'emergency':
            case 'Emergency Situation':
                return <ExclamationOutlined style={{ color: '#ff4d4f' }} />;
            case 'message':
                return <MessageOutlined style={{ color: '#1890ff' }} />;
            case 'user':
                return <UserOutlined style={{ color: '#52c41a' }} />;
            case 'booking':
                return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
            case 'urgent':
            case 'intervention':
                return <QuestionCircleOutlined style={{ color: '#faad14' }} />;
            default:
                return <BellOutlined style={{ color: '#faad14' }} />;
        }
    };

    const NotificationCard = ({ title, description, notifications, showEmpty = false }) => (
        <Card
            title={title}
            extra={notifications.length > 0 && <Badge count={notifications.length} />}
            style={{ height: '100%', backgroundColor: 'white' }}
            bodyStyle={{ padding: notifications.length === 0 ? '40px 24px' : '16px 24px' }}
        >
            {notifications.length === 0 && showEmpty ? (
                <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
                    <Text type="secondary">No notifications</Text>
                </div>
            ) : (
                <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '16px', fontSize: '13px' }}>
                        {description}
                    </Text>
                    <List
                        dataSource={notifications}
                        renderItem={(notification) => {
                            console.log('Notification data:', notification);
                            console.log('Patient ID:', notification.patient_id);
                            console.log('Patient object:', notification.patient);
                            return (
                                <List.Item
                                    style={{
                                        padding: '8px 12px',
                                        border: (notification.priority === 'high' || ['error', 'emergency', 'Emergency Situation'].includes(notification.notification_type)) ? '1px solid #ff4d4f' : 'none',
                                        cursor: notification.is_read ? 'default' : 'pointer',
                                        backgroundColor: notification.is_read ? 'white' : '#f9f9f9',
                                        borderRadius: '4px',
                                        marginBottom: '8px',
                                        opacity: notification.is_read ? 0.6 : 1
                                    }}
                                    onClick={() => {
                                        if (!notification.is_read && !markReadLoading) {
                                            console.log('Clicking notification:', notification.id, notification.title);
                                            markAsRead(notification.id);
                                        }
                                    }}
                                >
                                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                        <Space>
                                            {(notification.priority === 'high' || ['error', 'emergency', 'Emergency Situation'].includes(notification.notification_type)) && (
                                                <ExclamationOutlined style={{ color: '#ff4d4f' }} />
                                            )}
                                            <Text
                                                strong={!notification.is_read}
                                                style={{
                                                    color: (notification.priority === 'high' || ['error', 'emergency', 'Emergency Situation'].includes(notification.notification_type)) ? '#ff4d4f' : '#000000',
                                                    fontWeight: notification.is_read ? 'normal' : 'bold'
                                                }}
                                            >
                                                {notification.title}
                                            </Text>
                                            {!notification.is_read && <Badge dot />}
                                        </Space>
                                        <Text
                                            style={{
                                                fontSize: '13px',
                                                color: '#4a4a4a',
                                                display: 'block'
                                            }}
                                        >
                                            {notification.message}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            {formatTime(notification.created_at)}
                                        </Text>
                                    </Space>
                                </List.Item>
                            );
                        }}
                    />
                </div>
            )}
        </Card>
    );

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fafafa', minHeight: '100vh' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 600 }}>
                    Notifications
                    {unreadCount > 0 && (
                        <Badge count={unreadCount} size="small" style={{ marginLeft: '12px' }} />
                    )}
                </Title>
                <Space>
                    {fetchLoading && <Spin size="small" />}
                    {unreadCount > 0 && (
                        <Button
                            type="link"
                            onClick={markAllAsRead}
                            loading={markAllReadLoading}
                        >
                            Mark all as read
                        </Button>
                    )}
                </Space>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <NotificationCard
                        title="Booking notes queries"
                        description="Patient requests about their appointment"
                        notifications={categorizedNotifications.bookingNotes}
                    />
                </Col>

                <Col xs={24} lg={8}>
                    <NotificationCard
                        title="Off-topic queries"
                        description="Non-appointment questions"
                        notifications={categorizedNotifications.offTopic}
                        showEmpty={true}
                    />
                </Col>

                <Col xs={24} lg={8}>
                    <NotificationCard
                        title="Human intervention required"
                        description="Admin-patient contact"
                        notifications={categorizedNotifications.humanIntervention}
                    />
                </Col>
            </Row>

            {/* Fallback: Show all notifications if categorized ones are empty */}
            {(!categorizedNotifications.bookingNotes.length &&
                !categorizedNotifications.offTopic.length &&
                !categorizedNotifications.humanIntervention.length) &&
                notifications.length > 0 && (
                    <Row style={{ marginTop: '24px' }}>
                        <Col span={24}>
                            <NotificationCard
                                title="All Notifications"
                                description="All notifications from the system"
                                notifications={notifications}
                            />
                        </Col>
                    </Row>
                )}


        </div>
    );
};

export default React.memo(Notification);