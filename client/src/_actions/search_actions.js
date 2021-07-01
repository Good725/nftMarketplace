import { SET_SEARCH_STRING, SET_SEARCH_CATEGORY } from './types';

export const setSearchString = (search) => {
  return {
    type: SET_SEARCH_STRING,
    payload: search,
  };
};

export const setSearchCategory = (category) => {
  return {
    type: SET_SEARCH_CATEGORY,
    payload: category,
  };
};
