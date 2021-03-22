import languageReducer from "containers/LanguageProvider/reducer";
import { combineReducers } from "redux";
import Auth from "./Auth";
import Clinic from "./Clinic";
import Theme from "./Theme";
import { connectRouter } from "connected-react-router";

// eslint-disable-next-line import/no-anonymous-default-export
export default (history) =>
  combineReducers({
    theme: Theme,
    auth: Auth,
    clinic: Clinic,
    language: languageReducer,
    router: connectRouter(history),
  });
