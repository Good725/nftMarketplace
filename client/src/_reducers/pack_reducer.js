import {
  SET_CARD_INDEX,
  ADD_POTENTIAL_CARD,
  UPDATE_POTENTIAL_CARD,
  GET_PROFILE_SHOP_PACKS,
  GET_PACK_CARDS,
  GET_PACK_INFO,
  BUY_FROM_PACK,
  GET_PACKS,
  GET_PACK_BY_CATEGORY,
  ADD_PACK_CARDS_TO_CART,
} from '../_actions/types';

const initialState = {
  cardPackNumber: 0,
  potentialCards: [],
  profileShopPacks: [],
  packCards: [],
  packInfo: [],
  packList: [],
  cardPurchaseInfo: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CARD_INDEX:
      return {
        ...state,
        cardPackNumber: action.payload,
      };

    case ADD_POTENTIAL_CARD:
      return {
        ...state,
        potentialCards: [...state.potentialCards, action.payload],
      };
    case UPDATE_POTENTIAL_CARD:
      console.log(action.payload.index);
      return {
        ...state,
        potentialCards: state.potentialCards.map((card, index) => {
          if (index == action.payload.index) {
            return { ...card, numberEditions: action.payload.edition };
          } else {
            return card;
          }
        }),
      };
    case ADD_POTENTIAL_CARD:
      return {
        ...state,
        finalCards: [...state.finalCards, action.payload],
      };
    case GET_PROFILE_SHOP_PACKS:
      return {
        ...state,
        profileShopPacks: action.payload.packs,
      };
    case GET_PACK_CARDS:
      return {
        ...state,
        packCards: action.payload.pack,
      };
    case GET_PACK_INFO:
      return {
        ...state,
        packInfo: action.payload.pack,
      };
    case BUY_FROM_PACK:
      return {
        ...state,
        cardPurchaseInfo: action.payload.selectedCardsInfo,
      };
    case GET_PACKS:
      return {
        ...state,
        packList: action.payload.packs,
      };
    case GET_PACK_BY_CATEGORY:
      return {
        ...state,
        packList: action.payload.packs,
      };
    case ADD_PACK_CARDS_TO_CART:
      return {
        ...state,
        packsAddedToCart: action.payload.success,
      };
    default:
      return state;
  }
}
