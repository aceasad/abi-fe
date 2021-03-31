import languageReducer from 'containers/LanguageProvider/reducer';
import { combineReducers } from 'redux';
import auth from './Auth';
import industryAverage from './IndustryAverage';
import clinic from './Clinic';
import theme from './Theme';
import staff from './Staff';
import patient from './Patient';
import { connectRouter } from 'connected-react-router';
import { SIGNOUT_SUCCESS } from 'redux/constants/Auth';

// eslint-disable-next-line import/no-anonymous-default-export
export default (history) => {
  const combinedReducer = combineReducers({
    router: connectRouter(history),
    theme,
    auth,
    industryAverage,
    clinic,
    staff,
    patient,
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
