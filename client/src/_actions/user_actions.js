import axios from 'axios';
import {
  // USER TASKS
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  GET_USERS,
  GET_PROFILE_USER,
  GET_SUGGESTED_USERS,
  SET_PROFILE_SECTION,
  // SHOP/CART
  ADD_TO_SHOP_USER,
  RESET_PROFILE,
  GET_SHOP_ITEMS_USER,
  ADD_TO_CART_USER,
  GET_CART_ITEMS_USER,
  REMOVE_CART_ITEM_USER,
  ADD_TO_LINKS_USER,
  GET_LINKS_ITEMS_USER,
  REMOVE_LINKS_ITEM_USER,
  GET_CARD_OWNER,
  // COINS
  ADD_COINS,
  ADD_COINS_OTHER,
  ADD_TO_MUSEUM,
  CHECK_USERNAME,
  UPDATE_USERNAME,
  UPDATE_FULLNAME,
  UPDATE_LOWERCASEFULLNAME,
  UPDATE_BIO,
  UPDATE_IMAGE,
  UPDATE_DAILY_REWARD,
  UPDATE_SOLD,
  UPDATE_CATEGORY,
  INCREMENT_SOLD,
  ADD_FOLLOWING,
  ADD_FOLLOWER,
  REMOVE_FOLLOWING,
  REMOVE_FOLLOWER,
  UPDATE_LEVEL,
  ADD_SUCCESSFUL_PURCHASE,
  UPDATE_MONEY,
  CHANGE_PASSWORD,
  CHECK_PASSWORD,
  RESET_PASSWORD_CHANGE,
  SET_WITHDRAWAL_AMOUNT,
  SET_DEPOSIT_AMOUNT,
  END_TOUR,
  ADD_FREE_NFT,
  ADD_FIRST_NFT,
  END_CREATE_TOUR,
  END_CARD_TOUR,
  INCREMENT_TOUR,
  INCREMENT_CARD_TOUR,
  INCREMENT_CREATE_TOUR,
  TRACK_TOUR,
  TRACK_CARD_TOUR,
  TRACK_CREATE_TOUR,
} from './types';
import { USER_SERVER } from '../components/Config.js';
import { PRODUCT_SERVER } from '../components/Config.js';

export const registerUser = (dataToSubmit) => {
  const request = axios
    .post(`${USER_SERVER}/register`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
};
export const resetProfile = () => {
  return {
    type: RESET_PROFILE,
  };
};
export const addFirstNFT = () => async (dispatch) => {
  try {
    const { data } = await axios.post(`${USER_SERVER}/buyFirstNFT`);
    dispatch({ type: ADD_FIRST_NFT, payload: data });
  } catch (error) {}
};
export const changePassword = (password) => async (dispatch) => {
  const { data } = await axios.post('/api/users/changePassword', password);

  dispatch({
    type: CHANGE_PASSWORD,
    payload: data,
  });
};
export const resetPasswordChange = () => {
  return {
    type: RESET_PASSWORD_CHANGE,
  };
};

export const checkPassword = (password) => async (dispatch) => {
  const item = { password };
  const { data } = await axios.post('/api/users/checkPassword', item);

  dispatch({
    type: CHECK_PASSWORD,
    payload: data,
  });
};
export const loginUser = (dataToSubmit) => {
  const request = axios
    .post(`${USER_SERVER}/login`, dataToSubmit, {
      withCredentials: true,
      credentials: 'include',
    })
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
};

export const getCardOwner = (id) => async (dispatch) => {
  const { data } = await axios.get(`${USER_SERVER}/cardOwner?ownerId=${id}`);
  dispatch({ type: GET_CARD_OWNER, payload: data });
};

export const endTour = () => async (dispatch) => {
  try {
    const { data } = await axios.post(`${USER_SERVER}/endTour`);
    dispatch({ type: END_TOUR, payload: data });
  } catch (error) {
    console.log('file: user_actions.js ~ line 174 ~ endTour ~ error', error);
  }
};

export const endCardTour = () => async (dispatch) => {
  try {
    const { data } = await axios.post(`/api/users/endCardTour`);
    dispatch({ type: END_CARD_TOUR, payload: data });
  } catch (error) {
    console.log('file: user_actions.js ~ line 174 ~ endTour ~ error', error);
  }
};
export const endCreateTour = () => async (dispatch) => {
  try {
    const { data } = await axios.post(`${USER_SERVER}/endCreateTour`);
    dispatch({ type: END_CREATE_TOUR, payload: data });
  } catch (error) {
    console.log('file: user_actions.js ~ line 174 ~ endTour ~ error', error);
  }
};

export const incrementTour = () => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${USER_SERVER}/updateProfileTourProgress`
    );
    dispatch({ type: INCREMENT_TOUR, payload: data });
  } catch (error) {
    console.log(
      'file: user_actions.js ~ line 174 ~ incrementTour ~ error',
      error
    );
  }
};

export const incrementCardTour = () => async (dispatch) => {
  try {
    const { data } = await axios.post(`/api/users/updateCardTourProgress`);
    dispatch({ type: INCREMENT_CARD_TOUR, payload: data });
  } catch (error) {
    console.log(
      'file: user_actions.js ~ line 174 ~ incrementTour ~ error',
      error
    );
  }
};
export const incrementCreateTour = () => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${USER_SERVER}/updateCreateTourProgress`
    );
    dispatch({ type: INCREMENT_CREATE_TOUR, payload: data });
  } catch (error) {
    console.log('file: user_actions.js ~ line 174 ~ endTour ~ error', error);
  }
};

export const trackTour = (bool) => {
  try {
    return { type: TRACK_TOUR, payload: bool };
  } catch (error) {
    console.log('file: user_actions.js ~ line 174 ~ trackTour ~ error', error);
  }
};

export const trackCardTour = (bool) => {
  try {
    return { type: TRACK_CARD_TOUR, payload: bool };
  } catch (error) {
    console.log('file: user_actions.js ~ line 174 ~ trackTour ~ error', error);
  }
};
export const trackCreateTour = (bool) => {
  try {
    return { type: TRACK_CREATE_TOUR, payload: bool };
  } catch (error) {
    console.log('file: user_actions.js ~ line 174 ~ endTour ~ error', error);
  }
};
export const getSuggestedUsers = (variables) => async (dispatch) => {
  const { data } = await axios.post(`${USER_SERVER}/searchUser`, variables);
  dispatch({ type: GET_SUGGESTED_USERS, payload: data });
};
export const auth = () => {
  const request = axios
    .get(`${USER_SERVER}/auth`)
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
};

export const getProfileUser = (userId) => async (dispatch) => {
  const { data } = await axios.get(`/api/users/getotheruser?_id=${userId}`);
  dispatch({
    type: GET_PROFILE_USER,
    payload: data,
  });
};
export const logoutUser = () => {
  const request = axios
    .get(`${USER_SERVER}/logout`)
    .then((response) => response.data);

  return {
    type: LOGOUT_USER,
    payload: request,
  };
};

export const addToShop = (_id) => {
  const request = axios
    .get(`${USER_SERVER}/addToShop?productId=${_id}`)
    .then((response) => response.data);

  return {
    type: ADD_TO_SHOP_USER,
    payload: request,
  };
};

export const getShopItems = (shopItems, userShop) => async (dispatch) => {
  try {
    const { data } = await axios
      .get(`/api/product/products_by_id?id=${shopItems}&type=array`)
      .then((response) => {
        //Make CartDetail inside Redux Store
        // We need to add quantity data to Product Information that come from Product Collection.

        userShop.forEach((shopItem) => {
          response.data.forEach((productDetail, i) => {
            if (shopItem.id === productDetail._id) {
              response.data[i].quantity = shopItem.quantity;
            }
          });
        });

        if (response.data && response.data.length > 0) {
          return response.data.reverse();
        }
      });

    dispatch({
      type: GET_SHOP_ITEMS_USER,
      payload: data,
    });
  } catch (error) {}
};

export const getUsers = (variables) => async (dispatch) => {
  try {
    const { data } = await axios.post('/api/users/getUsers', variables);
    dispatch({
      type: GET_USERS,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addToCart = (_id) => {
  console.log(_id);
  const request = axios
    .get(`${USER_SERVER}/addToCart?productId=${_id}`)
    .then((response) => response.data);

  return {
    type: ADD_TO_CART_USER,
    payload: request,
  };
};

export const getCartItems = (cartItems, userCart, collection) => {
  const request = axios
    .get(
      `/api/product/products_by_id?id=${cartItems}&type=array&collection=${collection}`
    )
    .then((response) => {
      //Make CartDetail inside Redux Store
      // We need to add quantity data to Product Information that come from Product Collection.

      userCart.forEach((cartItem) => {
        response.data.forEach((productDetail, i) => {
          if (cartItem.id === productDetail._id) {
            response.data[i].quantity = cartItem.quantity;
          }
        });
      });

      return response.data;
    });

  return {
    type: GET_CART_ITEMS_USER,
    payload: request,
  };
};

export const removeCartItem = (id) => {
  const request = axios
    .get(`/api/users/removeFromCart?_id=${id}`)
    .then((response) => {
      response.data.cart.forEach((item) => {
        response.data.cartDetail.forEach((k, i) => {
          if (item.id === k._id) {
            response.data.cartDetail[i].quantity = item.quantity;
          }
        });
      });
      return response.data;
    });

  return {
    type: REMOVE_CART_ITEM_USER,
    payload: request,
  };
};

export const addToLinks = (LinksTitle, LinksURL, ranNum) => {
  const request = axios
    .get(
      `${USER_SERVER}/addToLinks?title=${LinksTitle}&url=${LinksURL}&idnum=${ranNum}`
    )
    .then((response) => response.data);

  return {
    type: ADD_TO_LINKS_USER,
    payload: request,
  };
};

export const getLinksItems = (linksItems, userLinks) => {
  const request = axios
    .get(`/api/product/products_by_id?id=${linksItems}&type=array`)
    .then((response) => {
      //Make CartDetail inside Redux Store
      // We need to add quantity data to Product Information that come from Product Collection.

      userLinks.forEach((linksItem) => {
        response.data.forEach((productDetail, i) => {
          if (linksItem.id === productDetail._id) {
            response.data[i].quantity = linksItem.quantity;
          }
        });
      });

      return response.data;
    });

  return {
    type: GET_LINKS_ITEMS_USER,
    payload: request,
  };
};

export const removeLinksItem = (idnum) => {
  const request = axios
    .get(`${USER_SERVER}/removeLink?idnum=${idnum}`)
    .then((response) => response.data);

  return {
    type: REMOVE_LINKS_ITEM_USER,
    payload: request,
  };
};

export const addCoins = (coinBalance) => {
  const request = axios
    .post(`${USER_SERVER}/addCoins?money=${coinBalance}`)
    .then((response) => response.data);
  //I didnt get an error a few time when both were get
  return {
    type: ADD_COINS,
    payload: request,
  };
};

export const addCoinOther = (_id, coinBalance) => {
  const request = axios
    .post(`${USER_SERVER}/addCoinsOther?_id=${_id}&money=${coinBalance}`)
    .then((response) => response.data);
  return {
    type: ADD_COINS_OTHER,
    payload: request,
  };
};

export const addToMuseum = (channelID) => {
  const request = axios
    .post(`${USER_SERVER}/addToMuseum?channelId=${channelID}`)
    .then((response) => response.data);

  return {
    type: ADD_TO_MUSEUM,
    payload: request,
  };
};

export const getMuseumItems = (museumItems, userMuseum) => {
  const request = axios
    .get(`/api/users/museum_by_channelId?channelId=${museumItems}&type=array`)
    .then((response) => {
      //Make CartDetail inside Redux Store
      // We need to add quantity data to Product Information that come from Product Collection.

      userMuseum.forEach((museumItems) => {
        response.data.forEach((productDetail, i) => {
          if (museumItems.id === productDetail._id) {
            response.data[i].quantity = museumItems.quantity;
          }
        });
      });

      return response.data;
    });

  return {
    type: GET_CART_ITEMS_USER,
    payload: request,
  };
};

export const checkUsername = (usernameValue) => {
  const request = axios
    .post(`${USER_SERVER}/user/checkusername?username=${usernameValue}`)
    .then((response) => response.data);
  //I didnt get an error a few time when both were get
  return {
    type: CHECK_USERNAME,
    payload: request,
  };
};

export const updateUsername = (usernameValue) => {
  const request = axios
    .post(`${USER_SERVER}/user/updateUsername?username=${usernameValue}`)
    .then((response) => response.data);
  //I didnt get an error a few time when both were get
  return {
    type: UPDATE_USERNAME,
    payload: request,
  };
};

export const updateCategory = (category) => async (dispatch) => {
  const { data } = await axios.post(
    `${USER_SERVER}/user/updateCategory?accountCategory=${category}`
  );
  dispatch({
    type: UPDATE_USERNAME,
    payload: data,
  });
};

export const updateFullname = (fullnameValue) => {
  const request = axios
    .post(`${USER_SERVER}/user/updateFullname?fullname=${fullnameValue}`)
    .then((response) => response.data);
  //I didnt get an error a few time when both were get
  return {
    type: UPDATE_FULLNAME,
    payload: request,
  };
};

export const updateLowercaseFullname = (lowercasefullnameValue) => {
  const request = axios
    .post(
      `${USER_SERVER}/user/updateLowercaseFullname?lowercasefullname=${lowercasefullnameValue}`
    )
    .then((response) => response.data);
  //I didnt get an error a few time when both were get
  return {
    type: UPDATE_LOWERCASEFULLNAME,
    payload: request,
  };
};

export const updateProfileImage = (Images) => {
  const request = axios
    .post(`${USER_SERVER}/user/updateImage?image=${Images}`)
    .then((response) => response.data);
  //I didnt get an error a few time when both were get
  return {
    type: UPDATE_IMAGE,
    payload: request,
  };
};

export const updateBio = (bioValue) => {
  const request = axios
    .post(`${USER_SERVER}/user/updateBio?bio=${bioValue}`)
    .then((response) => response.data);
  //I didnt get an error a few time when both were get
  return {
    type: UPDATE_BIO,
    payload: request,
  };
};

export const updateDailyReward = (dailyReward) => {
  const request = axios
    .post(`${USER_SERVER}/updateDailyReward?dailyrewardpickup=${dailyReward}`)
    .then((response) => response.data);
  //I didnt get an error a few time when both were get
  return {
    type: UPDATE_DAILY_REWARD,
    payload: request,
  };
};

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

export const addFollowing = (_id) => {
  const request = axios
    .get(`${USER_SERVER}/addFollowing?_id=${_id}`)
    .then((response) => response.data);

  return {
    type: ADD_FOLLOWING,
    payload: request,
  };
};

export const addFollower = (_id) => {
  const request = axios
    .get(`${USER_SERVER}/addFollower?_id=${_id}`)
    .then((response) => response.data);

  return {
    type: ADD_FOLLOWER,
    payload: request,
  };
};
export const removeFollowing = (_id) => {
  const request = axios
    .get(`${USER_SERVER}/removeFollowing?_id=${_id}`)
    .then((response) => response.data);

  return {
    type: REMOVE_FOLLOWING,
    payload: request,
  };
};

export const removeFollower = (_id) => {
  const request = axios
    .get(`${USER_SERVER}/removeFollower?_id=${_id}`)
    .then((response) => response.data);

  return {
    type: REMOVE_FOLLOWER,
    payload: request,
  };
};

export const setProfileSection = (section) => {
  console.log(section);
  return {
    type: SET_PROFILE_SECTION,
    payload: section,
  };
};
export const updateLevel = (level) => {
  const request = axios
    .post(`${USER_SERVER}/updateLevel?level=${level}`)
    .then((response) => response.data);
  //I didnt get an error a few time when both were get
  return {
    type: UPDATE_LEVEL,
    payload: request,
  };
};

export const successfulPurchase = (
  PriceValue,
  email,
  address,
  cancelled,
  paid,
  payerID,
  paymentID,
  paymentToken,
  returnUrl
) => {
  const request = axios
    .get(
      `${USER_SERVER}/successfulPurchase?PriceValue=${PriceValue}&email=${email}&address=${address}&cancelled=${cancelled}&paid=${paid}&payerID=${payerID}&paymentID=${paymentID}&paymentToken=${paymentToken}&returnUrl=${returnUrl}`
    )
    .then((response) => response.data);

  return {
    type: ADD_SUCCESSFUL_PURCHASE,
    payload: request,
  };
};

export const updateMoney = (userId, amount, increment) => async (dispatch) => {
  try {
    const { data } = await axios.patch(
      `${USER_SERVER}/updateMoney?id=${userId}&money=${amount}&increment=${increment}`
    );
    return dispatch({
      type: UPDATE_MONEY,
      payload: data,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

export const setWithdrawalTransaction = (amount) => async (dispatch) => {
  try {
    const item = {
      amount,
    };
    const { data } = await axios.post('/api/users/setWithdrawal', item);
    dispatch({
      type: SET_WITHDRAWAL_AMOUNT,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const setDepositTransaction = (amount) => async (dispatch) => {
  try {
    const item = {
      amount,
    };
    const { data } = await axios.post('/api/users/setDeposit', item);
    dispatch({
      type: SET_DEPOSIT_AMOUNT,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
};
