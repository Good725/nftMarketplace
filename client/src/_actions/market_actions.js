import Web3 from 'web3';
import axios from 'axios';
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
  PURCHASE_WITH_ETH,
  GET_TOKEN_PRICE_USD,
} from './types';

// ADDING A CARD TO THE MARKETPLACE
export const addToMarketplace =
  (productId, editionId, info) => async (dispatch) => {
    try {
      const information = {
        productId,
        editionId,
        info,
      };
      console.log('add to market', info);
      const { data } = await axios.patch(
        `/api/market/addToMarketPlace`,
        information
      );

      dispatch({
        type: ADD_TO_MARKET,
        payload: data,
      });
    } catch {
      return;
      //  alert('Failed to add to marketplace');
    }
  };

export const usersMarketCards = (productId, userId) => async (dispatch) => {
  const items = {
    productId,
    _id: userId,
  };
  try {
    const { data } = await axios.post(`/api/market/usersCardsInMarket`, items);

    dispatch({
      type: USERS_CARDS_IN_MARKET,
      payload: data,
    });
  } catch {
    return;
    //  alert('Failed to add to marketplace');
  }
};
export const removeFromMarketplace =
  (productId, editionId) => async (dispatch) => {
    try {
      const { data } = await axios.patch(
        `/api/market/removeFromMarketplace?id=${productId}&editionId=${editionId}`
      );

      dispatch({
        type: REMOVE_FROM_MARKET,
        payload: data,
      });
    } catch {
      return;
      //  alert('Failed to add to marketplace');
    }
  };
export const getMarketCardsByCategory = (category) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `/api/market/getMarketCardsByCategory?category=${category}`
    );
    dispatch({
      type: GET_MARKET_CARD_BY_CATEGORY,
      payload: data,
    });
  } catch {
    return;
    // alert('Failed to fetch product data');
  }
};
export const getMarketCardEditions = (productId) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `/api/market/getCardEditionsInMarket?id=${productId}`
    );

    dispatch({
      type: GET_MARKET_CARD_EDITIONS,
      payload: data,
    });
  } catch {
    return;
    // alert('Failed to add to marketplace');
  }
};
// GETTING CARDS FOR MARKET PAGE
export const getMarketCards = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/market/marketCards`);

    dispatch({
      type: GET_MARKET_CARDS,
      payload: data,
    });
  } catch {
    return;
    // alert('Failed to add to marketplace');
  }
};

// PURCHASING CARD FROM MARKET, ADDING CARD FROM ONE USERS COLLECTION
// REMOVING FROM ANOTHER USERS COLLECTION

export const purchaseCardFromMarket =
  (productId, edition) => async (dispatch) => {
    try {
      const { data } = await axios.get(
        `/api/market/addToCartFromMarketAndRemove?id=${productId}&edition=${edition}`
      );

      dispatch({
        type: PURCHASE_FROM_MARKET,
        payload: data,
      });
    } catch {
      return;
      //  alert('Failed to add to marketplace');
    }
  };

// SETTING EDITION IN THE MARKET TO BE PURCHASED
export const setEdition = (edition) => {
  return {
    type: SET_MARKET_EDITION,
    payload: edition,
  };
};

export const setApprovedToken = (
  dbiliaToken,
  gasPrice,
  account,
  marketplaceAddress,
  setApproving,
  setDisabled
) => async (dispatch) => {
  try {
    // Get gas limit
    const gasLimit = await dbiliaToken.methods
    .setApprovalForAll(marketplaceAddress, true)
    .estimateGas({ from: account });

    dbiliaToken.methods
    .setApprovalForAll(marketplaceAddress, true)
    .send({
      from: account,
      // now is not working Web3.utils.toWei(gasPrice, "Gwei")
      gasPrice: gasPrice*Math.pow(10, 9),
      gas: Math.round(gasLimit * 1.1),
    })
    .then((data) => {
      dispatch({
        type: SET_APPROVED,
        payload: data.status,
      });
    })
    .catch((error) => {
      setApproving(false);
      setDisabled(false);
      return error;
    });
  } catch (error) {
  }
};

export const isApprovedStatus =
  (dbiliaToken, account, marketplaceAddress) => async (dispatch) => {
    try {
      dbiliaToken.methods
        .isApprovedForAll(account, marketplaceAddress)
        .call()
        .then((data) => {
          dispatch({
            type: APPROVED_STATUS,
            payload: data,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  };

export const setForSaleWithETH = (marketplace, gasPrice, account, tokenId, marketAmount) => async (
  dispatch
) => {
  try {
    // Get gas limit
    const gasLimit = await marketplace.methods
    .setForSaleWithETH(tokenId, marketAmount)
    .estimateGas({ from: account });

    marketplace.methods.setForSaleWithETH(tokenId, marketAmount)
    .send({
      from: account,
      gasPrice: gasPrice*Math.pow(10, 9),
      gas: Math.round(gasLimit * 1.1),
    })
    .then((data) => {
      dispatch({
        type: SET_SALE_WITH_ETH,
        payload: data.status,
      });
    })
    .catch((error) => {
      console.log(error)
    });
  } catch (error) {
  }
};

export const removeSetForSaleWithETH = (marketplace, gasPrice, account, tokenId) => async (
  dispatch
) => {
  try {
    // Get gas limit
    const gasLimit = await marketplace.methods
    .removeSetForSaleETH(tokenId)
    .estimateGas({ from: account });

    marketplace.methods.removeSetForSaleETH(tokenId)
    .send({
      from: account,
      gasPrice: gasPrice*Math.pow(10, 9),
      gas: Math.round(gasLimit * 1.1),
    })
    .then((data) => {
      dispatch({
        type: REMOVE_SET_SALE_WITH_ETH,
        payload: data.status,
      });
    })
    .catch((error) => {
      console.log(error)
    });
  } catch (error) {
  }
};

export const getTokenPriceUSD = (marketplace, tokenId) => async (
  dispatch
) => {
  try {
    marketplace.methods.tokenPriceUSD(tokenId)
    .call()
    .then((data) => {
      dispatch({
        type: GET_TOKEN_PRICE_USD,
        payload: +data,
      });
    })
    .catch((error) => {
      console.log(error)
      window.alert('There was an error!')
    });
  } catch (error) {
  }
};

export const purchaseWithETH = (marketplace, buyerFee, gasPrice, account, tokenId) => async (
  dispatch
) => {
  try {
    // Get gas limit
    const gasLimit = await marketplace.methods
    .purchaseWithETHw3user(tokenId)
    .estimateGas({ value: buyerFee.toString(), from: account });

    marketplace.methods.purchaseWithETHw3user(tokenId)
    .send({
      value: buyerFee.toString(),
      from: account,
      gasPrice: gasPrice*Math.pow(10, 9),
      gas: Math.round(gasLimit * 1.1),
    })
    .then((data) => {
      dispatch({
        type: PURCHASE_WITH_ETH,
        payload: data.status,
      });
    })
    .catch((error) => {
      console.log(error)
    });
  } catch (error) {
  }
};
