/* eslint-disable import/no-anonymous-default-export */
import {
  SET_MENU_VIEW,
  SET_BID_OPEN,
  SET_USER_CARD,
  SET_EDITIONS_OPEN,
  SET_TRANSACTIONS_OPEN,
  SET_WITHDRAWAL,
  SET_DEPOSIT,
  SET_CONFIRM,
  SET_OWNED_EDITIONS_OPEN,
  SET_MINT_INFO,
  SET_MARKET_BID_OPEN,
} from '../_actions/types';

const initialState = {
  bid: false,
  marketBid: false,
  navOpen: false,
  editions: false,
  transactions: false,
  deposit: false,
  withdrawal: false,
  ownedEditions: false,
  confirm: false,
  mintInfo: false,
  firstLoginTracker: true,
  introCardGuideTracker: true,
  createCardTracker: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MENU_VIEW:
      return {
        ...state,
        navOpen: action.payload,
      };
    case SET_BID_OPEN:
      return {
        ...state,
        bid: action.payload,
      };
    case SET_MARKET_BID_OPEN:
      return {
        ...state,
        marketBid: action.payload,
      };
    case SET_MINT_INFO:
      return {
        ...state,
        mintInfo: action.payload,
      };

    case SET_EDITIONS_OPEN:
      return {
        ...state,
        editions: action.payload,
      };
    case SET_OWNED_EDITIONS_OPEN:
      return {
        ...state,
        ownedEditions: action.payload,
      };

    case SET_TRANSACTIONS_OPEN:
      return {
        ...state,
        transactions: action.payload,
      };
    case SET_WITHDRAWAL:
      return {
        ...state,
        withdrawal: action.payload,
      };
    case SET_DEPOSIT:
      return {
        ...state,
        deposit: action.payload,
      };
    case SET_CONFIRM:
      return {
        ...state,
        confirm: action.payload,
      };
    case SET_USER_CARD:
      return {
        ...state,
        userCard: action.payload,
      };

    default:
      return state;
  }
};
