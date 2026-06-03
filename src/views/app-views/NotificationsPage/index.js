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
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectLoginDetails } from 'redux/selectors/Auth';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import {
    makeSelectNotifications,
    makeSelectVisibleUnreadCount,
    makeSelectFetchLoading,
    makeSelectMarkReadLoading,
    makeSelectMarkAllReadLoading,
    makeSelectBookingNotifications,
    makeSelectOffTopicNotifications
} from 'redux/selectors/Notifications';
import {
    createWebsocketNotificationUrl,
    parseReceivedEvent,
    formatDateByCountry
} from 'utils/helpers';
import { addOneMessage, resetChats } from 'redux/actions/Chats';
import {
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    fetchNotifications,
    fetchBookingNotifications,
    fetchOffTopicNotifications,
    fetchUnreadNotifications
} from 'redux/actions/Notifications';
import WebSocketClient from 'services/WebSocketClient';
import authService from 'services/AuthService';
import { API_BASE_URL } from 'configs/AppConfig';
import utils from 'utils';
import {
    HUMAN_INTERVENTION_NOTIFICATION_TYPES,
    isVisibleNotification,
    isVisibleUnreadNotification,
} from 'utils/notificationVisibility';
import {
    BellOutlined,
    MessageOutlined,
    UserOutlined,
    ExclamationOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined,
    CloseOutlined
} from '@ant-design/icons';

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const Notification = () => {
    const { token } = useSelector(makeSelectLoginDetails());
    const clinic = useSelector(makeSelectClinic());
    const notifications = useSelector(makeSelectNotifications()) || [];
    const visibleUnreadCount = useSelector(makeSelectVisibleUnreadCount()) || 0;
    const fetchLoading = useSelector(makeSelectFetchLoading()) || false;
    const markReadLoading = useSelector(makeSelectMarkReadLoading()) || false;
    const markAllReadLoading = useSelector(makeSelectMarkAllReadLoading()) || false;
    const bookingNotifications = useSelector(makeSelectBookingNotifications()) || [];
    const offTopicNotifications = useSelector(makeSelectOffTopicNotifications()) || [];
    const dispatch = useDispatch();

    const screens = utils.getBreakPoint(useBreakpoint());
    const isMobile = !screens.includes('lg');
    const isTablet = screens.includes('md') && !screens.includes('lg');

    // State for RASA health check
    const [rasaHealthy, setRasaHealthy] = useState('');

    // WebSocket message handler - refresh notifications when new ones arrive
    const handleReceiveMessage = (event) => {
        const parsedMessage = parseReceivedEvent(event);

        // Refresh notifications from backend since new ones are saved there
        dispatch(fetchNotifications());
        dispatch(fetchBookingNotifications());
        dispatch(fetchOffTopicNotifications());
        dispatch(fetchUnreadNotifications());
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
        if (!token) return undefined;
        let cancelled = false;
        WebSocketClient.connect({
            getUrl: async () => {
                if (cancelled) return '';
                await authService.ensureFreshAccessTokenForSocket();
                const fresh = authService.getToken();
                if (!fresh?.access) throw new Error('Missing access token');
                return createWebsocketNotificationUrl(fresh);
            },
            onopen: () => { },
            onmessage: handleReceiveMessage,
        });
        WebSocketClient.waitForConnection();
        return () => {
            cancelled = true;
            // See ChatPage: avoid double closeConnection (mount cleanup already closes on unmount).
        };
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
        if (markReadLoading) {
            return;
        }
        dispatch(markNotificationAsRead(notificationId));
    };

    const markAllAsRead = () => {
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
        return formatDateByCountry(date, clinic?.country);
    };

    // Use categorized notifications from Redux state - filter to show only unread notifications
    const categorizedNotifications = {
        bookingNotes: bookingNotifications.filter(isVisibleUnreadNotification),
        offTopic: offTopicNotifications.filter(isVisibleUnreadNotification),
        humanIntervention: notifications.filter(
            (n) =>
                isVisibleUnreadNotification(n) &&
                HUMAN_INTERVENTION_NOTIFICATION_TYPES.includes(n.notification_type)
        ),
    };

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
            title={<Text strong style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: 600 }}>{title}</Text>}
            extra={notifications.length > 0 && (
                <Badge
                    count={notifications.length}
                    size={isMobile ? 'small' : 'default'}
                    style={{
                        transform: 'translateY(-2px)'
                    }}
                />
            )}
            style={{ height: '100%', backgroundColor: 'white', borderRadius: '8px' }}
            styles={{
                header: {
                    padding: isMobile ? '16px 16px' : '20px 16px 12px 16px',
                    minHeight: isMobile ? '56px' : '12px',
                    height: isMobile ? '56px' : '12px'
                },
                body: {
                    padding: notifications.length === 0 ? (isMobile ? '24px 16px' : '40px 24px') : (isMobile ? '12px 16px' : '16px 24px')
                }
            }}
        >
            {notifications.length === 0 && showEmpty ? (
                <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
                    <Text type="secondary" style={{ fontSize: isMobile ? '13px' : '14px' }}>No notifications</Text>
                </div>
            ) : (
                <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '16px', fontSize: isMobile ? '12px' : '13px' }}>
                        {description}
                    </Text>
                    <List
                        dataSource={notifications}
                        renderItem={(notification) => {
                            return (
                                <List.Item
                                    style={{
                                        padding: isMobile ? '12px 12px' : '14px 16px',
                                        border: notification.notification_type === 'Emergency Situation' ? '1px solid #ff4d4f' : 'none',
                                        cursor: 'default',
                                        backgroundColor: notification.is_read ? 'white' : '#f9f9f9',
                                        borderRadius: '6px',
                                        marginBottom: isMobile ? '8px' : '10px',
                                        opacity: notification.is_read ? 0.6 : 1,
                                        position: 'relative'
                                    }}
                                >
                                    <Space direction="vertical" size={6} style={{ width: '100%' }}>
                                        <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1, paddingRight: '8px' }}>
                                                <Link
                                                    to={`/pages/conversation/${notification.patient_id}`}
                                                    style={{
                                                        color: notification.notification_type === 'Emergency Situation' ? '#ff4d4f' : '#000000',
                                                        fontWeight: notification.is_read ? 'normal' : 600,
                                                        textDecoration: 'none',
                                                        fontSize: isMobile ? '14px' : '15px',
                                                        wordBreak: 'break-word',
                                                        lineHeight: '1.5'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {notification.title}
                                                </Link>
                                                {!notification.is_read && (
                                                    <Badge dot style={{ marginLeft: '6px' }} />
                                                )}
                                            </div>
                                            {!notification.is_read && (
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<CloseOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!markReadLoading) {
                                                            markAsRead(notification.id);
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '4px 6px',
                                                        minWidth: 'auto',
                                                        color: '#8c8c8c',
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                        flexShrink: 0
                                                    }}
                                                />
                                            )}
                                        </Space>
                                        <Text
                                            style={{
                                                fontSize: isMobile ? '12px' : '13px',
                                                color: '#4a4a4a',
                                                display: 'block',
                                                wordBreak: 'break-word',
                                                lineHeight: '1.5'
                                            }}
                                        >
                                            {notification.message}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: isMobile ? '11px' : '12px' }}>
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
        <div style={{ padding: isMobile ? '16px' : '0px', maxWidth: '100%', overflowX: 'hidden' }}>
            <div className="mb-4" style={{ paddingTop: isMobile ? 0 : '24px' }}>
                {isMobile ? (
                    // Mobile: Title and actions stacked
                    <>
                        <div style={{ marginBottom: '12px' }}>
                            <Title level={3} style={{ marginTop: "8px" }}>
                                Notifications
                                {visibleUnreadCount > 0 && (
                                    <Badge
                                        count={visibleUnreadCount}
                                        size="default"
                                        style={{ marginLeft: '12px' }}
                                    />
                                )}
                            </Title>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
                            {fetchLoading && <Spin size="small" />}
                            {visibleUnreadCount > 0 && (
                                <Button
                                    type="link"
                                    onClick={markAllAsRead}
                                    loading={markAllReadLoading}
                                    size="small"
                                    style={{ padding: 0 }}
                                >
                                    Mark all as read
                                </Button>
                            )}
                        </div>
                    </>
                ) : (
                    // Desktop/Tablet: Title and actions side by side
                    <Row gutter={16} align="middle">
                        <Col flex="auto">
                            <Title level={3} style={{ marginTop: "8px" }}>
                                Notifications
                                {visibleUnreadCount > 0 && (
                                    <Badge
                                        count={visibleUnreadCount}
                                        size="default"
                                        style={{ marginLeft: '12px' }}
                                    />
                                )}
                            </Title>
                        </Col>
                        <Col>
                            <Space>
                                {fetchLoading && <Spin size="small" />}
                                {visibleUnreadCount > 0 && (
                                    <Button
                                        type="link"
                                        onClick={markAllAsRead}
                                        loading={markAllReadLoading}
                                    >
                                        Mark all as read
                                    </Button>
                                )}
                            </Space>
                        </Col>
                    </Row>
                )}
            </div>

            <Row gutter={isMobile ? [12, 12] : [24, 24]}>
                <Col xs={24} sm={12} lg={8}>
                    <NotificationCard
                        title="Booking notes queries"
                        description="Patient requests about their appointment"
                        notifications={categorizedNotifications.bookingNotes}
                    />
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <NotificationCard
                        title="Off-topic queries"
                        description="Non-appointment questions"
                        notifications={categorizedNotifications.offTopic}
                    />
                </Col>

                <Col xs={24} sm={12} lg={8}>
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
                                notifications={notifications.filter(isVisibleNotification)}
                            />
                        </Col>
                    </Row>
                )}


        </div>
    );
};

export default React.memo(Notification);