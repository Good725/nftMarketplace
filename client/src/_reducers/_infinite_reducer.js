import {
  GET_FEATURED_PRODUCTS,
  GET_FEATURED_PAGE,
  FEATURE_RENDER_COUNT,
  GET_FEED_PRODUCTS,
  GET_FEED_PAGE,
  FEED_RENDER_COUNT,
  GET_SHOP_PRODUCTS,
  GET_SHOP_PAGE,
  SHOP_RENDER_COUNT,
  GET_COLLECTION_PRODUCTS,
  GET_COLLECTION_PAGE,
  COLLECTION_RENDER_COUNT,
  GET_MARKET_PRODUCTS,
  GET_MARKET_PAGE,
  MARKET_RENDER_COUNT,
  GET_SALE_PRODUCTS,
  GET_SALE_PAGE,
  SALE_RENDER_COUNT,
  GET_SEARCH_CARD_PRODUCTS,
  GET_SEARCH_CARD_PAGE,
  SEARCH_CARD_RENDER_COUNT,
  GET_SEARCH_USER_PRODUCTS,
  GET_SEARCH_USER_PAGE,
  SEARCH_USER_RENDER_COUNT,
  LOGOUT_INFINITE,
  RESET_CARD_SEARCH,
  RESET_USER_SEARCH,
  RESET_COLLECTION,
  RESET_SHOP,
} from '../_actions/types';

const initialState = {
  featuredProducts: [],
  featuredPage: 0,
  featuredLoading: false,
  featuredSection: ['placeholder'],
  featureCount: 0,
  feedProducts: [],
  feedPage: 0,
  feedLoading: false,
  feedSection: ['placeholder'],
  feedCount: 0,
  shopProducts: [],
  shopPage: 0,
  shopLoading: false,
  shopSection: ['placeholder'],
  shopCount: 0,
  collectionProducts: [],
  collectionPage: 0,
  collectionLoading: false,
  collectionSection: ['placeholder'],
  collectionCount: 0,
  saleProducts: [],
  salePage: 0,
  saleLoading: false,
  saleSection: ['placeholder'],
  saleCount: 0,
  searchCardProducts: [],
  searchCardPage: 0,
  searchCardSection: ['placeholder'],
  searchCardCount: 0,
  searchCardLoading: false,
  searchUserProducts: [],
  searchUserPage: 0,
  searchUserSection: ['placeholder'],
  searchUserCount: 0,
  searchUserLoading: false,
  marketProducts: [],
  marketPage: 0,
  marketLoading: false,
  marketSection: ['placeholder'],
  marketCount: 0,
};
// eslint-disable-next-line
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_FEATURED_PRODUCTS:
      return {
        ...state,
        featuredProducts: state.featuredProducts.concat(
          action.payload.data.featuredItems
        ),
        featuredLoading: false,
        featuredSection: action.payload.data.featuredItems,
      };
    case GET_FEATURED_PAGE:
      return {
        ...state,
        featuredPage: state.featuredPage + 1,
        featuredLoading: true,
      };
    case FEATURE_RENDER_COUNT:
      return {
        ...state,
        featureCount: state.featureCount + 1,
      };
    case GET_FEED_PRODUCTS:
      return {
        ...state,
        feedProducts: state.feedProducts.concat(action.payload.data.feedItems),
        feedLoading: false,
        feedSection: action.payload.data.feedItems,
      };
    case GET_FEED_PAGE:
      return {
        ...state,
        feedPage: state.feedPage + 1,
        feedLoading: true,
      };
    case FEED_RENDER_COUNT:
      return {
        ...state,
        feedCount: state.feedCount + 1,
      };
    case GET_SHOP_PRODUCTS:
      return {
        ...state,
        shopProducts: state.shopProducts.concat(action.payload.data.shopItems),
        shopLoading: false,
        shopSection: action.payload.data.shopItems,
      };
    case GET_SHOP_PAGE:
      return {
        ...state,
        shopPage: state.shopPage + 1,
        shopLoading: true,
      };
    case SHOP_RENDER_COUNT:
      return {
        ...state,
        shopCount: state.shopCount + 1,
      };
    case GET_COLLECTION_PRODUCTS:
      return {
        ...state,
        collectionProducts: state.collectionProducts.concat(
          action.payload.data.collectionItems
        ),
        collectionLoading: false,
        collectionSection: action.payload.data.collectionItems,
      };
    case GET_COLLECTION_PAGE:
      return {
        ...state,
        collectionPage: state.collectionPage + 1,
        collectionLoading: true,
      };
    case COLLECTION_RENDER_COUNT:
      return {
        ...state,
        collectionCount: state.collectionCount + 1,
      };
    case GET_MARKET_PRODUCTS:
      return {
        ...state,
        marketProducts: state.marketProducts.concat(
          action.payload.data.marketItems
        ),
        marketLoading: false,
        marketSection: action.payload.data.marketItems,
      };
    case GET_MARKET_PAGE:
      return {
        ...state,
        marketPage: state.marketPage + 1,
        marketLoading: true,
      };
    case MARKET_RENDER_COUNT:
      return {
        ...state,
        marketCount: state.marketCount + 1,
      };
    case GET_SEARCH_CARD_PRODUCTS:
      return {
        ...state,
        searchCardProducts: state.searchCardProducts.concat(
          action.payload.data.searchCardItems
        ),
        searchCardLoading: false,
        searchCardSection: action.payload.data.searchCardItems,
      };
    case GET_SEARCH_CARD_PAGE:
      return {
        ...state,
        searchCardPage: state.searchCardPage + 1,
        searchCardLoading: true,
      };
    case SEARCH_CARD_RENDER_COUNT:
      return {
        ...state,
        searchCardCount: state.searchCardCount + 1,
      };
    case GET_SEARCH_USER_PRODUCTS:
      return {
        ...state,
        searchUserProducts: state.searchUserProducts.concat(
          action.payload.data.searchUserItems
        ),
        searchUserLoading: false,
        searchUserSection: action.payload.data.searchUserItems,
      };
    case GET_SEARCH_USER_PAGE:
      return {
        ...state,
        searchUserPage: state.searchUserPage + 1,
        searchUserLoading: true,
      };
    case SEARCH_USER_RENDER_COUNT:
      return {
        ...state,
        searchUserCount: state.searchUserCount + 1,
      };
    case GET_SALE_PRODUCTS:
      return {
        ...state,
        saleProducts: state.saleProducts.concat(action.payload.data.saleItems),
        saleLoading: false,
        saleSection: action.payload.data.saleItems,
      };
    case GET_SALE_PAGE:
      return {
        ...state,
        salePage: state.salePage + 1,
        saleLoading: true,
      };
    case SALE_RENDER_COUNT:
      return {
        ...state,
        saleCount: state.saleCount + 1,
      };
    case RESET_COLLECTION:
      return {
        ...state,
        collectionProducts: [],
        collectionPage: 0,
        collectionSection: ['placeholder'],
        collectionCount: 0,
        collectionLoading: false,
      };
    case RESET_SHOP:
      return {
        ...state,
        shopProducts: [],
        shopPage: 0,
        shopSection: ['placeholder'],
        shopCount: 0,
        shopLoading: false,
      };

    case RESET_CARD_SEARCH:
      return {
        ...state,
        searchCardProducts: [],
        searchCardPage: 0,
        searchCardSection: ['placeholder'],
        searchCardCount: 0,
        searchCardLoading: false,
      };
    case RESET_USER_SEARCH:
      return {
        ...state,
        searchUserProducts: [],
        searchUserPage: 0,
        searchUserSection: ['placeholder'],
        searchUserCount: 0,
        searchUserLoading: false,
      };
    case LOGOUT_INFINITE:
      return {
        ...state,
        featuredProducts: [],
        featuredPage: 0,
        featuredLoading: false,
        featuredSection: ['placeholder'],
        featureCount: 0,
        feedProducts: [],
        feedPage: 0,
        feedLoading: false,
        feedSection: ['placeholder'],
        feedCount: 0,
        shopProducts: [],
        shopPage: 0,
        shopLoading: false,
        shopSection: ['placeholder'],
        shopCount: 0,
        collectionProducts: [],
        collectionPage: 0,
        collectionLoading: false,
        collectionSection: ['placeholder'],
        collectionCount: 0,
        saleProducts: [],
        salePage: 0,
        saleLoading: false,
        saleSection: ['placeholder'],
        saleCount: 0,
        searchProducts: [],
        searchPage: 0,
        searchLoading: false,
        searchSection: ['placeholder'],
        searchCount: 0,
        marketProducts: [],
        marketPage: 0,
        marketLoading: false,
        marketSection: ['placeholder'],
        marketCount: 0,
      };
    default:
      return state;
  }
}
