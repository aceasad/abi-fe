import { createSelector } from "reselect";
import reducers from "../reducers";

const selectUsersDomain = (state) => state.theme || reducers;

const makeSelectCurrentTheme = () =>
  createSelector(selectUsersDomain, (substate) => substate.currentTheme);

export { makeSelectCurrentTheme };
