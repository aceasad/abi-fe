import {
  EXISTING_CONDITIONS,
  PREVIOUS_OPERATIONS,
} from 'redux/reducers/Anemnesis';
import { createSelector } from 'reselect';

const anamnesisDomain = (state) => state.anemnesis;

const makeSelectExistingMedicalConditions = () =>
  createSelector(anamnesisDomain, (substate) => substate[EXISTING_CONDITIONS]);

const makeSelectPreviousOperations = () =>
  createSelector(anamnesisDomain, (substate) => substate[PREVIOUS_OPERATIONS]);

export { makeSelectExistingMedicalConditions, makeSelectPreviousOperations };
