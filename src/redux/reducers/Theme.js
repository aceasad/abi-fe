import {
  TOGGLE_COLLAPSED_NAV,
  CHANGE_LOCALE,
  SIDE_NAV_STYLE_CHANGE,
  NAV_TYPE_CHANGE,
  TOP_NAV_COLOR_CHANGE,
  HEADER_NAV_COLOR_CHANGE,
  TOGGLE_MOBILE_NAV,
  SWITCH_THEME,
} from '../constants/Theme';
import { THEME_CONFIG } from 'configs/AppConfig';
import { produce } from 'immer';

const initTheme = {
  ...THEME_CONFIG,
};

/* eslint-disable default-case */
const theme = (state = initTheme, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case TOGGLE_COLLAPSED_NAV:
        draft.navCollapsed = action.navCollapsed;
        break;
      case SIDE_NAV_STYLE_CHANGE:
        draft.sideNavTheme = action.sideNavTheme;
        break;
      case CHANGE_LOCALE:
        draft.locale = action.locale;
        break;
      case NAV_TYPE_CHANGE:
        draft.navType = action.navType;
        break;
      case TOP_NAV_COLOR_CHANGE:
        draft.topNavColor = action.topNavColor;
        break;
      case HEADER_NAV_COLOR_CHANGE:
        draft.headerNavColor = action.headerNavColor;
        break;
      case TOGGLE_MOBILE_NAV:
        draft.mobileNav = action.mobileNav;
        break;
      case SWITCH_THEME:
        draft.currentTheme = action.currentTheme;
        break;
    }
  });

export default theme;
