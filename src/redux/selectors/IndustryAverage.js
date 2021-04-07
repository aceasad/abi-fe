import { createSelector } from 'reselect';

const selectIndustryAverageDomain = (state) => state.industryAverage;

const industryAverageSelector = () =>
  createSelector(
    selectIndustryAverageDomain,
    (substate) => substate.industryAverage
  );

const industryAverageIsUpdated = () =>
  createSelector(selectIndustryAverageDomain, (substate) => substate.isUpdated);

const isLoadingIndustryAverageSelector = () =>
  createSelector(selectIndustryAverageDomain, (substate) => substate.loading);

export {
  industryAverageSelector,
  isLoadingIndustryAverageSelector,
  industryAverageIsUpdated,
};
