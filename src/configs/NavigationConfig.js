import React from 'react';
import {
  PieChartOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  WhatsAppOutlined,
  SettingOutlined,
  PaperClipOutlined,
  LineChartOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { APP_PAGES_PREFIX_PATH } from 'configs/AppConfig';

const pagesNavTree = [
  {
    key: 'overview',
    path: `${APP_PAGES_PREFIX_PATH}/overview`,
    title: 'sidenav.pages.overview',
    icon: PieChartOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'kpis',
    path: `${APP_PAGES_PREFIX_PATH}/kpis`,
    title: 'sidenav.pages.kpis',
    icon: LineChartOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'conversation',
    path: `${APP_PAGES_PREFIX_PATH}/conversation`,
    title: 'sidenav.pages.conversation',
    icon: WhatsAppOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'notifications',
    path: `${APP_PAGES_PREFIX_PATH}/notifications`,
    title: 'sidenav.pages.notifications',
    icon: NotificationOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'appointments',
    path: `${APP_PAGES_PREFIX_PATH}/appointments`,
    title: 'sidenav.pages.appointments',
    icon: CalendarOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'patients',
    path: `${APP_PAGES_PREFIX_PATH}/patients`,
    title: 'sidenav.pages.patients',
    icon: TeamOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'staff',
    path: `${APP_PAGES_PREFIX_PATH}/staff`,
    title: 'sidenav.pages.staff',
    icon: UserOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'documents',
    path: `${APP_PAGES_PREFIX_PATH}/documents`,
    title: 'sidenav.pages.documents',
    icon: PaperClipOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'settings',
    path: `${APP_PAGES_PREFIX_PATH}/settings`,
    title: 'sidenav.pages.settings',
    icon: SettingOutlined,
    breadcrumb: false,
    submenu: [],
  },
];

export const getNavigationConfig = (pasProvider) => {
  const isMedbridge = pasProvider?.toLowerCase() === 'medbridge';
  if (isMedbridge) {
    return pagesNavTree.filter((item) => item.key !== 'staff');
  }
  return [...pagesNavTree];
};

export const useNavigationConfig = () => {
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  return getNavigationConfig(PASProvider);
};

const navigationConfig = [...pagesNavTree];

export default navigationConfig;
