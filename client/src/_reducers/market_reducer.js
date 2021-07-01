import {
  ADD_TO_MARKET,
  GET_MARKET_CARDS,
  PURCHASE_FROM_MARKET,
  SET_MARKET_EDITION,
  GET_MARKET_CARD_EDITIONS,
  GET_MARKET_CARD_BY_CATEGORY,
  REMOVE_FROM_MARKET,
  USERS_CARDS_IN_MARKET,
  APPROVED_STATUS,
  SET_APPROVED,
  SET_SALE_WITH_ETH,
  REMOVE_SET_SALE_WITH_ETH,
  GET_TOKEN_PRICE_USD,
  PURCHASE_WITH_ETH,
} from '../_actions/types';

const initialState = {
  marketList: [],
  addToCollection: false,
  marketList: [],
  marketEdition: 0,
  marketCardEditions: [],
  removeSuccess: true,
  userCardsInMarket: [],
  isApproved: false,
  setApproved: [],
  setSaleWithETH: false,
  removeSetSaleWithETH: false,
  purchasedWithETH: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TO_MARKET:
      return {
        ...state,
        addedToMarket: action.payload.success,
      };
    case USERS_CARDS_IN_MARKET:
      return {
        ...state,
        userCardsInMarket: [
          ...state.userCardsInMarket,
          action.payload.editionItem,
        ]
          .filter((item) => item !== '')
          .filter(
            (v, i, a) => a.findIndex((t) => t.prod._id === v.prod._id) === i
          ),
      };
    case GET_MARKET_CARDS:
      return {
        ...state,
        marketList: action.payload.product,
      };
    case GET_MARKET_CARD_BY_CATEGORY:
      return {
        ...state,
        marketList: action.payload.products,
      };
    case PURCHASE_FROM_MARKET:
      return {
        ...state,
        cardPurchased: action.payload.success,
      };
    case REMOVE_FROM_MARKET:
      return {
        ...state,
        removeSuccess: action.payload.success,
      };
    case SET_MARKET_EDITION:
      return {
        ...state,
        marketEdition: action.payload,
      };
    case GET_MARKET_CARD_EDITIONS:
      return {
        ...state,
        marketCardEditions: action.payload.editionsInMarket,
      };
    case APPROVED_STATUS:
      return {
        ...state,
        isApproved: action.payload,
      };
    case SET_APPROVED:
      return {
        ...state,
        setApproved: action.payload,
      };
    case SET_SALE_WITH_ETH:
      return {
        ...state,
        setSaleWithETH: action.payload,
      };
    case REMOVE_SET_SALE_WITH_ETH:
      return {
        ...state,
        removeSetSaleWithETH: action.payload,
      };
    case GET_TOKEN_PRICE_USD:
      return {
        ...state,
        tokenPrice: action.payload,
      };
    case PURCHASE_WITH_ETH:
      return {
        ...state,
        purchasedWithETH: action.payload,
      };
    default:
      return state;
  }
}
