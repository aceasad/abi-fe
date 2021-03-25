import {
  UPDATED_INDUSTRY_AVERAGE_SUCCESS,
  UPDATED_INDUSTRY_AVERAGE_ERROR,
  GET_INDUSTRY_AVERAGE_SUCCESS,
  GET_INDUSTRY_AVERAGE_ERROR,
} from '../constants/IndustryAverage';
import produce from 'immer';
const initialState = { isUpdated: false, message: null, industryAverage: null };

const industryAverage = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPDATED_INDUSTRY_AVERAGE_SUCCESS:
        draft.isUpdated = true;
        break;
      case UPDATED_INDUSTRY_AVERAGE_ERROR:
        draft.message = action.message;
        break;
      case GET_INDUSTRY_AVERAGE_SUCCESS:
        draft.industryAverage = action.industryAverage;
        break;
      case GET_INDUSTRY_AVERAGE_ERROR:
        draft.message = action.message;
    }
  });
export default industryAverage;
