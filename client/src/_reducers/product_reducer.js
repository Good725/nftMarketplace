import {
  GET_PRODUCTS,
  GET_SUGGESTED_PRODUCTS,
  ADD_TO_COLLECTION,
  GET_PRODUCT_BY_CATEGORY,
  GET_FEATURED_PRODUCTS,
  GET_PRODUCT_ITEM,
  PLACE_INITIAL_PRODUCT_BID,
  AUCTION_OVER,
  GET_ALL_AUCTIONS,
  UPDATE_MINTED,
  UPDATE_BID,
  RETURN_BID_UPDATE_STATUS,
  UPDATE_SALE_DEADLINE,
  PLACE_INITIAL_MARKET_BID,
  UPDATE_MARKET_BID,
  RETURN_MARKET_BID_UPDATE_STATUS,
  MARKET_AUCTION_OVER,
  GET_ALL_MARKET_AUCTIONS,
  RESET_MARKET_BID_SUCCESS,
  RESET_BID_SUCCESS,

  // AUCTION_ITEMS_CART,
  // DELETE_AUCTION,
  // SET_AUCTION_FINISHED,
} from '../_actions/types';

const initialState = {
  productList: [],
  suggestedProducts: [],
  addToCollection: false,
  marketList: [],
  featuredProducts: [],
  singleItem: '',
  sortedItems: [],
  allAuctions: [],
  auctionFinished: 0,
  bidSuccess: false,
  bidUpdateSuccess: false,
  marketBidSuccess: false,
  allMarketAuctions: [],
  marketAuctionFinished: 0,
  marketBidUpdateSuccess: false,
  deadlineChangeSuccess: true,
};
// eslint-disable-next-line
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        productList: action.payload.products,
      };
    case GET_PRODUCT_ITEM:
      return {
        ...state,
        singleItem: action.payload.product,
      };

    case GET_PRODUCT_BY_CATEGORY:
      return {
        ...state,
        productList: action.payload.products,
      };
    case GET_SUGGESTED_PRODUCTS:
      return {
        ...state,
        suggestedProducts: action.payload.products,
      };

    case ADD_TO_COLLECTION:
      return {
        ...state,
        addToCollection: !state.addToCollection,
      };
    case PLACE_INITIAL_PRODUCT_BID:
      return {
        ...state,
        bidSuccess: action.payload.success,
      };
    case RESET_BID_SUCCESS:
      return {
        ...state,
        bidSuccess: false,
      };
    case UPDATE_BID:
      return {
        ...state,
        bidUpdateSuccess: action.payload.success,
      };
    case RETURN_BID_UPDATE_STATUS:
      return {
        ...state,
        bidUpdateSuccess: false,
      };
    case AUCTION_OVER:
      return {
        ...state,
        auctionFinished: action.payload,
      };
    case GET_ALL_AUCTIONS:
      return {
        ...state,
        allAuctions: action.payload.allAuctions,
      };

    // MARKET AUCTION
    case PLACE_INITIAL_MARKET_BID:
      return {
        ...state,
        marketBidSuccess: action.payload.success,
      };

    case RESET_MARKET_BID_SUCCESS:
      return {
        ...state,
        marketBidSuccess: false,
      };
    case UPDATE_MARKET_BID:
      return {
        ...state,
        marketBidUpdateSuccess: action.payload.success,
      };
    case RETURN_MARKET_BID_UPDATE_STATUS:
      return {
        ...state,
        marketBidUpdateSuccess: action.payload,
      };
    case MARKET_AUCTION_OVER:
      return {
        ...state,
        marketAuctionFinished: action.payload,
      };
    case GET_ALL_MARKET_AUCTIONS:
      return {
        ...state,
        allMarketAuctions: action.payload.allMarketAuctions,
      };

    case UPDATE_MINTED:
      return {
        ...state,
        singleItem: {
          ...state.singleItem,
          editions: action.payload.editions,
        },
      };
    case UPDATE_SALE_DEADLINE:
      return {
        ...state,
        deadlineChangeSuccess: action.payload.success,
        singleItem: action.payload.product,
      };

    default:
      return state;
  }
}
