import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectIndustryAverageDomain = (state) => state.industryAverage;

const industryAverageSelector = () =>
  createSelector(
    selectIndustryAverageDomain,
    (substate) => substate.industryAverage
  );
const isLoadingIndustryAverageSelector = () =>
  createSelector(selectIndustryAverageDomain, (substate) => substate.loading);
export { industryAverageSelector, isLoadingIndustryAverageSelector };
