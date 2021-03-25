import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectIndustryAverageDomain = (state) => state.industryAverage;

const industryAverageSelector = () =>
  createSelector(
    selectIndustryAverageDomain,
    (substate) => substate.industryAverage
  );

export { industryAverageSelector };
