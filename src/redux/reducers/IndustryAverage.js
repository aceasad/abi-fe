import {
  UPDATED_INDUSTRY_AVERAGE_SUCCESS,
  UPDATED_INDUSTRY_AVERAGE_ERROR,
  GET_INDUSTRY_AVERAGE_SUCCESS,
  GET_INDUSTRY_AVERAGE_ERROR,
  SET_LOADING,
} from '../constants/IndustryAverage';
import produce from 'immer';
const initialState = {
  isUpdated: false,
  loading: false,
  message: null,
  industryAverage: null,
};

const industryAverage = (state = initialState, action) =>
  produce(state, (draft) => {
    // eslint-disable-next-line default-case
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
        break;
      case SET_LOADING:
        draft.message = action.flag;
        break;
    }
  });
export default industryAverage;
