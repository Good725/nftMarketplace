import { SET_SEARCH_STRING, SET_SEARCH_CATEGORY } from '../_actions/types';

const initialState = {
  searchString: '',
  searchCategory: 'Cards',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_STRING:
      return {
        ...state,
        searchString: action.payload,
      };

    // SETS CATEGORY ARGUMENT IN SEARCH SUGGESTION ROUTE
    //  FOR WHICH SUGGESTIONS WILL BE SHOWN
    // UNDERNEATH SEARCH BAR
    case SET_SEARCH_CATEGORY:
      return {
        ...state,
        searchCategory: action.payload,
      };
    default:
      return state;
  }
}
