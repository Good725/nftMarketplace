import {
  SET_CARD_INDEX,
  ADD_POTENTIAL_CARD,
  UPDATE_POTENTIAL_CARD,
  ADD_PACK,
  GET_PROFILE_SHOP_PACKS,
  GET_PACK_CARDS,
  GET_PACK_INFO,
  BUY_FROM_PACK,
  GET_PACKS,
  GET_PACK_BY_CATEGORY,
  ADD_PACK_CARDS_TO_CART,
} from './types';
import axios from 'axios';
import qs from 'qs';
// TRACKS WHICH CARD THE USER IS ADDING TO THE PACK WHEN
// A PACK IS BEING CREATED
export const setCardIndex = (number) => {
  return {
    type: SET_CARD_INDEX,
    payload: number,
  };
};
// ROUND ONE BEFORE USERS SUBMIT FINAL EDITIONS
// USED TO DISPLAY ALL DATA EASILY IN FINAL EDITION SUBMISSION
export const addPotentialCardToPack = (card) => {
  return {
    type: ADD_POTENTIAL_CARD,
    payload: card,
  };
};
// USED AS FINAL INFO TO BE SENT TO THE BACKEND
// WITH FINAL EDITION NUMBERS SELECTED
export const updatePotentialCardToPack = (edition, index) => {
  console.log(
    'file: pack_actions.js ~ line 30 ~ updatePotentialCardToPack ~ index',
    index
  );
  return {
    type: UPDATE_POTENTIAL_CARD,
    payload: { edition, index },
  };
};

export const addPackAndCards = (packCards, pack) => async (dispatch) => {
  const info = {
    pack,
    packCards,
  };
  try {
    const { data } = await axios.post(`/api/pack/addPack`, info);
    dispatch({
      type: ADD_PACK,
      payload: data,
    });
  } catch {
    console.log('error adding pack');
  }
};

export const getProfileShopPacks = (profileId) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `/api/pack/getProfileShopPacks?id=${profileId}`
    );
    dispatch({
      type: GET_PROFILE_SHOP_PACKS,
      payload: data,
    });
  } catch {
    console.log('error getting pack');
  }
};
export const getPackCards = (packId) => async (dispatch) => {
  console.log(
    'file: pack_actions.js ~ line 80 ~ getPackCards ~ packId',
    packId
  );
  try {
    const { data } = await axios.get(`/api/pack/getPackCards?id=${packId}`);
    dispatch({
      type: GET_PACK_CARDS,
      payload: data,
    });
  } catch {
    console.log('error getting all packs ');
  }
};
export const getPacksByCategory = (category) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `/api/pack/getPacksByCategory?category=${category}`
    );
    dispatch({
      type: GET_PACK_BY_CATEGORY,
      payload: data,
    });
  } catch {
    console.log('error getting pack');
  }
};

export const getPacks = (variable) => async (dispatch) => {
  try {
    const { data } = await axios.post(`/api/pack/getPacks`, variable);
    dispatch({
      type: GET_PACKS,
      payload: data,
    });
  } catch {
    console.log('error adding pack');
  }
};
export const getPackInfo = (packId) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/pack/getPackInfo?id=${packId}`);
    dispatch({
      type: GET_PACK_INFO,
      payload: data,
    });
  } catch {
    console.log('error getting pack');
  }
};

export const buyFromPack = (packId) => async (dispatch) => {
  try {
    const { data } = await axios.put(`/api/pack/buyFromPack?id=${packId}`);

    dispatch({
      type: BUY_FROM_PACK,
      payload: data,
    });
  } catch {
    console.log('error buying pack');
  }
};

export const addPackCardsToUserCart = (card, packId) => async (dispatch) => {
  try {
    const { data } = await axios.put(
      `/api/pack/addPackCardsToCart?id=${packId}`,
      card
    );
    dispatch({
      type: ADD_PACK_CARDS_TO_CART,
      payload: data,
    });
    console.log(data);
  } catch {
    console.log('Error adding cards to user cart from pack');
  }
};
