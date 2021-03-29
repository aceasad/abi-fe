import languageReducer from 'containers/LanguageProvider/reducer';
import { combineReducers } from 'redux';
import Auth from './Auth';
import IndustryAverage from './IndustryAverage';
import Clinic from './Clinic';
import Theme from './Theme';
import Staff from './Staff';
import { connectRouter } from 'connected-react-router';
import { SIGNOUT_SUCCESS } from 'redux/constants/Auth';

// eslint-disable-next-line import/no-anonymous-default-export
export default (history) => {
  const combinedReducer = combineReducers({
    router: connectRouter(history),
    theme: Theme,
    auth: Auth,
    industryAverage: IndustryAverage,
    clinic: Clinic,
    staff: Staff,

    language: languageReducer,
  });

  const rootReducer = (state, action) => {
    if (action.type === SIGNOUT_SUCCESS) {
      state = undefined;
    }
    return combinedReducer(state, action);
  };
  return rootReducer;
};
