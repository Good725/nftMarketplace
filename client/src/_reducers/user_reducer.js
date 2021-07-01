import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  GET_USERS,
  GET_SUGGESTED_USERS,
  LOGOUT_USER,
  GET_SHOP_ITEMS_USER,
  ADD_TO_CART_USER,
  GET_CART_ITEMS_USER,
  REMOVE_CART_ITEM_USER,
  ADD_TO_LINKS_USER,
  END_TOUR,
  GET_LINKS_ITEMS_USER,
  REMOVE_LINKS_ITEM_USER,
  ADD_COINS,
  ADD_COINS_OTHER,
  ADD_TO_MUSEUM,
  GET_CARD_OWNER,
  UPDATE_LEVEL,
  ADD_SUCCESSFUL_PURCHASE,
  GET_PROFILE_USER,
  SET_PROFILE_SECTION,
  UPDATE_MONEY,
  CHECK_PASSWORD,
  CHANGE_PASSWORD,
  RESET_PASSWORD_CHANGE,
  SET_WITHDRAWAL_AMOUNT,
  SET_DEPOSIT_AMOUNT,
  END_CREATE_TOUR,
  RESET_PROFILE,
  END_CARD_TOUR,
  INCREMENT_TOUR,
  INCREMENT_CREATE_TOUR,
  INCREMENT_CARD_TOUR,
  TRACK_TOUR,
  TRACK_CREATE_TOUR,
  TRACK_CARD_TOUR,
  UPDATE_CATEGORY,
} from '../_actions/types';

const initialState = {
  userData: {},
  searchedUsers: [],
  suggestedUsers: [],
  cardOwner: [],
  profileUser: false,
  shopDetail: false,
  cartDetail: [],
  profileSection: 'Collection',
  passwordSuccess: false,
  passwordChangeSuccess: false,
  wrongPasswordMessage: '',
  firstLoginTracker: true,
  introCardGuideTracker: true,
  createCardTracker: true,
};
// eslint-disable-next-line
export default function (state = initialState, action) {
  switch (action.type) {
    case REGISTER_USER:
      return { ...state, register: action.payload };
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
    case AUTH_USER:
      return { ...state, userData: action.payload };
    case GET_USERS:
      return { ...state, searchedUsers: action.payload.users };
    case CHECK_PASSWORD:
      return {
        ...state,
        passwordCheck: action.payload.passwordSuccess,
        wrongPasswordMessage: action.payload.message,
      };
    case CHANGE_PASSWORD:
      return { ...state, passwordChangeSuccess: action.payload.success };
    case RESET_PASSWORD_CHANGE:
      return { ...state, passwordCheck: false, passwordChangeSuccess: false };
    case RESET_PROFILE:
      return {
        ...state,
        profileUser: false,
      };
    case END_CARD_TOUR:
      return {
        ...state,
        cardTour: action.payload.success,
      };
    case GET_SUGGESTED_USERS:
      return { ...state, suggestedUsers: action.payload.users };
    case GET_PROFILE_USER:
      return { ...state, profileUser: action.payload.users[0] };
    case SET_PROFILE_SECTION:
      return { ...state, profileSection: action.payload };
    case LOGOUT_USER:
      return { ...state };
    case GET_CARD_OWNER:
      return { ...state, cardOwner: action.payload.user };
    case GET_SHOP_ITEMS_USER:
      return {
        ...state,
        shopDetail: action.payload,
      };
    case INCREMENT_TOUR:
      return {
        ...state,
        firstLoginIncrement: action.payload.success,
      };
    case INCREMENT_CREATE_TOUR:
      return {
        ...state,
        createTourIncrement: action.payload.success,
      };
    case INCREMENT_CARD_TOUR:
      return {
        ...state,
        introCardGuideIncrement: action.payload.success,
      };
    case TRACK_TOUR:
      return {
        ...state,
        firstLoginTracker: action.payload,
      };
    case TRACK_CREATE_TOUR:
      return {
        ...state,
        createTourTracker: action.payload,
      };
    case TRACK_CARD_TOUR:
      return {
        ...state,
        introCardGuideTracker: action.payload,
      };
    case ADD_TO_CART_USER:
      return {
        ...state,
        userData: {
          ...state.userData,
          cart: action.payload,
        },
      };

    case GET_CART_ITEMS_USER:
      return {
        ...state,
        cartDetail: action.payload,
      };
    case REMOVE_CART_ITEM_USER:
      return {
        ...state,
        cartDetail: action.payload.cartDetail,
        userData: {
          ...state.userData,
          cart: action.payload.cart,
        },
      };
    case ADD_TO_LINKS_USER:
      return {
        ...state,
        userData: {
          ...state.userData,
          links: action.payload,
        },
      };
    case GET_LINKS_ITEMS_USER:
      return {
        ...state,
        linksDetail: action.payload,
      };
    case REMOVE_LINKS_ITEM_USER:
      return {
        ...state,
        linksDetail: action.payload.linksDetail,
        userData: {
          ...state.userData,
          links: action.payload.links,
        },
      };
    case ADD_COINS:
      return {
        ...state,
        userData: {
          ...state.userData,
          money: action.payload,
        },
      };

    case ADD_COINS_OTHER:
      return {
        ...state,
        userData: {
          ...state.userData,
          money: action.payload,
        },
      };
    case ADD_TO_MUSEUM:
      return {
        ...state,
        userData: {
          ...state.userData,
          museum: action.payload,
        },
      };

    case UPDATE_LEVEL:
      return {
        ...state,
        userData: {
          ...state.userData,
          level: action.payload,
        },
      };
    case UPDATE_CATEGORY:
      return {
        ...state,
        categorySuccess: action.payload,
      };
    case ADD_SUCCESSFUL_PURCHASE:
      return {
        ...state,
        userData: {
          ...state.userData,
          history: action.payload,
        },
      };

    case UPDATE_MONEY:
      return {
        ...state,
        userData: {
          ...state.userData,
          money: action.payload.money,
        },
      };
    case SET_WITHDRAWAL_AMOUNT:
      return {
        ...state,
        withdrawSuccess: action.payload.success,
      };
    case SET_DEPOSIT_AMOUNT:
      return {
        ...state,
        depositSuccess: action.payload.success,
      };

    default:
      return state;
  }
}
