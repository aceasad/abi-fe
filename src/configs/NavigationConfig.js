import {
  PieChartOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  WhatsAppOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

const pagesNavTree = [
  {
    key: 'overview',
    path: `${APP_PREFIX_PATH}/overview`,
    title: 'sidenav.pages.overview',
    icon: PieChartOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'appointments',
    path: `${APP_PREFIX_PATH}/appointments`,
    title: 'sidenav.pages.appointments',
    icon: CalendarOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'patients',
    path: `${APP_PREFIX_PATH}/patients`,
    title: 'sidenav.pages.patients',
    icon: TeamOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'staff',
    path: `${APP_PREFIX_PATH}/staff`,
    title: 'sidenav.pages.staff',
    icon: UserOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'conversation',
    path: `${APP_PREFIX_PATH}/conversation`,
    title: 'sidenav.pages.conversation',
    icon: WhatsAppOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'settings',
    path: `${APP_PREFIX_PATH}/settings`,
    title: 'sidenav.pages.setting',
    icon: SettingOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: "conversations",
    path: `${APP_PREFIX_PATH}/conversations`,
    title: "Conversations",
    breadcrumb: false,
    submenu: [],
  },
];

const navigationConfig = [...pagesNavTree];

export default navigationConfig;
