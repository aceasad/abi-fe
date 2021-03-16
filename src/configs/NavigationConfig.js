import { APP_PREFIX_PATH } from "configs/AppConfig";

const dashBoardNavTree = [
  {
    key: "contacts",
    path: `${APP_PREFIX_PATH}/contacts`,
    title: "Contacts",
    breadcrumb: false,
    submenu: [],
  },
  {
    key: "funnels",
    path: `${APP_PREFIX_PATH}/funnels`,
    title: "Funnels",
    breadcrumb: false,
    submenu: [],
  },
  {
    key: "automation",
    path: `${APP_PREFIX_PATH}/automation`,
    title: "Automation",
    breadcrumb: false,
    submenu: [],
  },
  {
    key: "calendar",
    path: `${APP_PREFIX_PATH}/calendar`,
    title: "Calendar",
    breadcrumb: false,
    submenu: [],
  },
  {
    key: "settings",
    path: `${APP_PREFIX_PATH}/settings`,
    title: "Settings",
    breadcrumb: false,
    submenu: [],
  },
];

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;
