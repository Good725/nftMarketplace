import axios from 'axios';
import {
  GET_FEATURED_PRODUCTS,
  GET_FEATURED_PAGE,
  FEATURED_LOADING,
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
  RESET_SHOP,
  RESET_COLLECTION,
} from './types';

export const setFeaturedLoading = (bool) => {
  return {
    type: FEATURED_LOADING,
    payload: bool,
  };
};
export const setFeatureCount = () => {
  return {
    type: FEATURE_RENDER_COUNT,
  };
};

export const logoutInfinite = () => {
  return {
    type: LOGOUT_INFINITE,
  };
};
export const getFeaturedProducts = (products, page) => async (dispatch) => {
  const item = {
    products,
    page,
  };

  try {
    const { data } = await axios.post('/api/infinite/featuredProducts', item);
    const info = {
      data,
      page,
    };
    dispatch({
      type: GET_FEATURED_PRODUCTS,
      payload: info,
    });
  } catch (error) {
    // alert('Error getting featured cards');
  }
};

export const getFeaturedPage = () => {
  return {
    type: GET_FEATURED_PAGE,
  };
};

export const setFeedCount = () => {
  return {
    type: FEED_RENDER_COUNT,
  };
};

export const getFeedProducts = (page) => async (dispatch) => {
  try {
    const item = {
      page,
    };
    const { data } = await axios.post('/api/infinite/feedProducts', item);
    const info = {
      data,
      page,
    };
    dispatch({
      type: GET_FEED_PRODUCTS,
      payload: info,
    });
  } catch (error) {
    // alert('Error getting featured cards');
  }
};

export const getFeedPage = () => {
  return {
    type: GET_FEED_PAGE,
  };
};

export const setMarketCount = () => {
  return {
    type: MARKET_RENDER_COUNT,
  };
};

export const getMarketProducts = (page, category) => async (dispatch) => {
  try {
    const item = {
      page,
      category,
    };

    const { data } = await axios.post('/api/infinite/marketProducts', item);
    const info = {
      data,
      page,
    };
    dispatch({
      type: GET_MARKET_PRODUCTS,
      payload: info,
    });
  } catch (error) {
    // alert('Error getting featured cards');
  }
};

export const getMarketPage = () => {
  return {
    type: GET_MARKET_PAGE,
  };
};

export const setShopCount = () => {
  return {
    type: SHOP_RENDER_COUNT,
  };
};

export const getShopProducts = (page, productIds) => async (dispatch) => {
  try {
    const item = {
      page,
      productIds,
    };

    const { data } = await axios.post('/api/infinite/shopProducts', item);
    const info = {
      data,
      page,
    };
    dispatch({
      type: GET_SHOP_PRODUCTS,
      payload: info,
    });
  } catch (error) {
    // alert('Error getting featured cards');
  }
};

export const getShopPage = () => {
  return {
    type: GET_SHOP_PAGE,
  };
};

export const resetShop = () => {
  return {
    type: RESET_SHOP,
  };
};

export const setCollectionCount = () => {
  return {
    type: COLLECTION_RENDER_COUNT,
  };
};

export const getCollectionProducts = (page, productIds) => async (dispatch) => {
  try {
    const item = {
      page,
      productIds,
    };

    const { data } = await axios.post('/api/infinite/collectionProducts', item);
    const info = {
      data,
      page,
    };
    dispatch({
      type: GET_COLLECTION_PRODUCTS,
      payload: info,
    });
  } catch (error) {
    // alert('Error getting featured cards');
  }
};

export const getCollectionPage = () => {
  return {
    type: GET_COLLECTION_PAGE,
  };
};

export const setSaleCount = () => {
  return {
    type: SALE_RENDER_COUNT,
  };
};

export const resetCollection = () => {
  return {
    type: RESET_COLLECTION,
  };
};

export const getSaleProducts =
  (page, productIds, profileId) => async (dispatch) => {
    try {
      const item = {
        page,
        productIds,
        profileId,
      };

      const { data } = await axios.post('/api/infinite/saleProducts', item);
      const info = {
        data,
        page,
      };
      dispatch({
        type: GET_SALE_PRODUCTS,
        payload: info,
      });
    } catch (error) {
      // alert('Error getting featured cards');
    }
  };

export const getSalePage = () => {
  return {
    type: GET_SALE_PAGE,
  };
};

export const setSearchCardCount = () => {
  return {
    type: SEARCH_CARD_RENDER_COUNT,
  };
};

export const getSearchCardProducts =
  (page, searchString) => async (dispatch) => {
    try {
      const item = {
        page,
        searchString,
      };

      const { data } = await axios.post(
        '/api/infinite/searchCardProducts',
        item
      );
      const info = {
        data,
        page,
      };
      dispatch({
        type: GET_SEARCH_CARD_PRODUCTS,
        payload: info,
      });
    } catch (error) {
      // alert('Error getting featured cards');
    }
  };

export const getSearchCardPage = () => {
  return {
    type: GET_SEARCH_CARD_PAGE,
  };
};

export const resetSearchCard = () => {
  return {
    type: RESET_CARD_SEARCH,
  };
};

export const setSearchUserCount = () => {
  return {
    type: SEARCH_USER_RENDER_COUNT,
  };
};

export const getSearchUserProducts =
  (page, searchString) => async (dispatch) => {
    try {
      const item = {
        page,
        searchString,
      };

      const { data } = await axios.post(
        '/api/infinite/searchUserProducts',
        item
      );
      const info = {
        data,
        page,
      };
      dispatch({
        type: GET_SEARCH_USER_PRODUCTS,
        payload: info,
      });
    } catch (error) {
      // alert('Error getting featured cards');
    }
  };

export const getSearchUserPage = () => {
  return {
    type: GET_SEARCH_USER_PAGE,
  };
};
export const resetSearchUser = () => {
  return {
    type: RESET_USER_SEARCH,
  };
};
