import axios from 'axios';
import {
  UPDATE_SOLD,
  UPDATE_BID,
  UPDATE_MINTED,
  GET_PRODUCTS,
  INCREMENT_SOLD,
  ADD_TO_COLLECTION,
  GET_SUGGESTED_PRODUCTS,
  GET_FEATURED_PRODUCTS,
  GET_PRODUCT_BY_CATEGORY,
  GET_PRODUCT_ITEM,
  PLACE_INITIAL_PRODUCT_BID,
  AUCTION_OVER,
  AUCTION_ITEMS_CART,
  DELETE_AUCTION,
  GET_ALL_AUCTIONS,
  SET_AUCTION_FINISHED,
  RETURN_BID_UPDATE_STATUS,
  UPDATE_SALE_DEADLINE,
  GET_ALL_MARKET_AUCTIONS,
  DELETE_MARKET_AUCTION,
  MARKET_AUCTION_OVER,
  PLACE_INITIAL_MARKET_BID,
  MARKET_AUCTION_ITEMS_CART,
  UPDATE_MARKET_BID,
  RETURN_MARKET_BID_UPDATE_STATUS,
  RESET_MARKET_BID_SUCCESS,
  RESET_BID_SUCCESS,
} from './types';
import { PRODUCT_SERVER } from '../components/Config.js';

export const updateSold = (AmountSold, productId) => {
  const request = axios
    .post(`${PRODUCT_SERVER}/updateSold?id=${productId}&sold=${AmountSold}`)
    .then((response) => response.data);
  //I didnt get an error a few time when both were get
  return {
    type: UPDATE_SOLD,
    payload: request,
  };
};

export const updateMinted =
  (editionId, productId, tokenId) => async (dispatch) => {
    try {
      const { data } = await axios.patch(
        `/api/product/updateMinted?id=${productId}&editionId=${editionId}&tokenId=${tokenId}`
      );
      dispatch({
        type: UPDATE_MINTED,
        payload: data,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  };

export const getFeaturedProducts = (products) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      '/api/product/featuredProducts',
      products
    );
    dispatch({
      type: GET_FEATURED_PRODUCTS,
      payload: data,
    });
  } catch (error) {
    // alert('Error getting featured cards');
  }
};
export const incrementSold = (productId) => {
  const request = axios
    .post(`${PRODUCT_SERVER}/incrementSold?id=${productId}`)
    .then((response) => response.data);
  //I didnt get an error a few time when both were get
  return {
    type: INCREMENT_SOLD,
    payload: request,
  };
};

// GETTING ALL CARDS OR FILTERED CARDS IN SEARCH COMPONENT
export const getProducts = (variables) => async (dispatch) => {
  try {
    const { data } = await axios.post('/api/product/getProducts', variables);
    dispatch({
      type: GET_PRODUCTS,
      payload: data,
    });
  } catch {
    return;
    // alert('Failed to fetch product data');
  }
};

export const getProductByCategory = (category) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `/api/product/getProductsByCategory?category=${category}`
    );
    dispatch({
      type: GET_PRODUCT_BY_CATEGORY,
      payload: data,
    });
  } catch {
    return;
    // alert('Failed to fetch product data');
  }
};
export const getSuggestedProducts = (variables) => async (dispatch) => {
  try {
    const { data } = await axios.post('/api/product/getProducts', variables);
    dispatch({
      type: GET_SUGGESTED_PRODUCTS,
      payload: data,
    });
  } catch {
    return;
    // alert('Failed to fetch product data');
  }
};

// GETTING THE CARDS THAT USER OWNS
export const getProductsByUser = (creatorId) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `/api/users/getotheruser?_id=${creatorId}`
    );
    dispatch({
      type: GET_PRODUCTS,
      payload: data,
    });
  } catch {
    // return alert('Failed to fetch product data');
  }
};
// small action setting a boolean which determines how profile collection will run
// mainly created because profilecollection useEffect doesnt update after
// clicking add to collection unless props.users is a dependency
// which in turn causes an endless loop
// profilecollectionpage will need to be refactored eventually
// this will ensure that the profile collection loads the userData
// from the redux state which will have the updated card #s
// after the user clicked addto collection
export const setAddToCollection = () => {
  return { type: ADD_TO_COLLECTION };
};

export const getSingleProduct = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/product/getProduct?id=${id}`);

    dispatch({
      type: GET_PRODUCT_ITEM,
      payload: data,
    });
  } catch {
    // return alert('Failed to fetch single product');
  }
};

export const placeInitialProductBid = (id, bid) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `/api/product/placeInitialProductBid?id=${id}&bid=${bid}`
    );
    dispatch({
      type: PLACE_INITIAL_PRODUCT_BID,
      payload: data,
    });
  } catch {
    console.log('initial error');
    return alert('Failed to place bid');
  }
};

export const resetBid = () => {
  return {
    type: RESET_BID_SUCCESS,
  };
};
export const editBid = (bidId, amount, bid, userId) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `/api/product/updateBid?id=${bidId}&amount=${amount}&bid=${bid}&userId=${userId}`
    );

    dispatch({
      type: UPDATE_BID,
      payload: data,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

export const resetEditBid = () => {
  return {
    type: RETURN_BID_UPDATE_STATUS,
  };
};
export const auctionOver = (number) => {
  console.log(
    'file: product_actions.js ~ line 164 ~ auctionOver ~ number',
    number
  );
  return {
    type: AUCTION_OVER,
    payload: number,
  };
};

export const auctionItemsToCart = (sortedItems, index) => async (dispatch) => {
  try {
    const info = {
      sortedItems,
      index,
    };
    const { data } = await axios.post(`/api/product/auctionOverUsers`, info);
    dispatch({
      type: AUCTION_ITEMS_CART,
      payload: data,
    });
  } catch {
    // return alert('Auction failed to end');
  }
};

export const deleteAuction = (id) => async (dispatch) => {
  try {
    const { data } = await axios.put(`/api/product/deleteAuction?id=${id}`);

    dispatch({
      type: DELETE_AUCTION,
      payload: data,
    });
  } catch {
    // return alert('couldnt delete items');
  }
};

export const getAllAuctions = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/api/product/allAuctions');
    dispatch({
      type: GET_ALL_AUCTIONS,
      payload: data,
    });
  } catch {
    // alert('Failed to get auctions');\
  }
};

export const placeInitialMarketBid = (id, bid, edition) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `/api/product/placeInitialMarketBid?id=${id}&bid=${bid}&edition=${edition}`
    );

    dispatch({
      type: PLACE_INITIAL_MARKET_BID,
      payload: data,
    }).then(() => {
      return {
        type: RESET_MARKET_BID_SUCCESS,
      };
    });
  } catch {
    console.log('initial error');
    return alert('Failed to place bid');
  }
};
export const editMarketBid =
  (bidId, amount, bid, userId, edition) => async (dispatch) => {
    try {
      const { data } = await axios.get(
        `/api/product/updateMarketBid?id=${bidId}&amount=${amount}&bid=${bid}&userId=${userId}&edition=${edition}`
      );

      dispatch({
        type: UPDATE_MARKET_BID,
        payload: data,
      }).then(() => {
        return {
          type: RETURN_MARKET_BID_UPDATE_STATUS,
          payload: false,
        };
      });
    } catch (error) {
      console.log(error);
      return;
    }
  };
export const marketAuctionOver = (number) => {
  return {
    type: MARKET_AUCTION_OVER,
    payload: number,
  };
};

export const auctionMarketItemsToCart =
  (sortedItems, index, edition) => async (dispatch) => {
    try {
      const info = {
        sortedItems,
        index,
        edition,
      };
      const { data } = await axios.post(
        `/api/product/auctionMarketOverUsers`,
        info
      );
      dispatch({
        type: MARKET_AUCTION_ITEMS_CART,
        payload: data,
      });
    } catch {
      // return alert('Auction failed to end');
    }
  };

export const deleteMarketAuction = (id, edition) => async (dispatch) => {
  try {
    const { data } = await axios.put(
      `/api/product/deleteMarketAuction?id=${id}&edition=${edition}`
    );

    dispatch({
      type: DELETE_MARKET_AUCTION,
      payload: data,
    });
  } catch {
    // return alert('couldnt delete items');
  }
};

export const getAllMarketAuctions = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/api/product/allMarketAuctions');
    dispatch({
      type: GET_ALL_MARKET_AUCTIONS,
      payload: data,
    });
  } catch {
    // alert('Failed to get auctions');\
  }
};

export const setProductFinished = (id) => async (dispatch) => {
  try {
    const { data } = await axios.put(
      `/api/product/setAuctionFinished?id=${id}`
    );
    dispatch({
      type: SET_AUCTION_FINISHED,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const changeDeadlineDate = (_id, date) => async (dispatch) => {
  try {
    const item = {
      _id,
      date,
    };
    const { data } = await axios.put('/api/product/saleDeadline', item);
    dispatch({
      type: UPDATE_SALE_DEADLINE,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};
