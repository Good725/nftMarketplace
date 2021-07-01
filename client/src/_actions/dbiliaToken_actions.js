import axios from "axios";
import {
  MINT_WITH_ETH_LOADING,
  MINT_WITH_ETH_LOADED,
  IS_PRODUCT_EDITION_MINTED,
  GET_TOKEN_OWNERSHIP,
  GET_OWNER_OF,
  GET_DBILIA_TRUST,
} from "./types";

export const mintWithETH = (dbiliaToken, account, params) => async (dispatch) => {
  try {
    dbiliaToken.methods.mintWithETH(
      params.royaltyReceiverId,
      params.royaltyPercentage,
      params.productId,
      params.edition,
      "https://ipfs"
    ).send({ from: account })
      .on('transactionHash', (hash) => {
        dispatch({
          type: MINT_WITH_ETH_LOADING,
          payload: hash,
        });
      })
      .on('error', (error) => {
        console.log(error)
        window.alert('There was an error!')
      })
  } catch (error) {
    //dispatch(web3Loaded(null));
  }
};

export const isProductEditionMinted = (dbiliaToken, productId, edition) => async (dispatch) => {
  try {
    dbiliaToken.methods.isProductEditionMinted(productId, edition)
    .call()
    .then((data) => {
      dispatch({
        type: IS_PRODUCT_EDITION_MINTED,
        payload: data,
      });
    })
    .catch((error) => {
      console.log(error)
      window.alert('There was an error!')
    });
  } catch (error) {
  }
};

export const getTokenOwnership = (dbiliaToken, tokenId) => async (dispatch) => {
  try {
    dbiliaToken.methods.getTokenOwnership(tokenId)
    .call()
    .then((data) => {
      dispatch({
        type: GET_TOKEN_OWNERSHIP,
        payload: data,
      });
    })
    .catch((error) => {
      console.log(error)
      window.alert('There was an error!')
    });
  } catch (error) {
  }
};

export const getOwnerOf = (dbiliaToken, tokenId) => async (dispatch) => {
  try {
    dbiliaToken.methods.ownerOf(tokenId)
    .call()
    .then((data) => {
      dispatch({
        type: GET_OWNER_OF,
        payload: data,
      });
    })
    .catch((error) => {
      console.log(error)
      window.alert('There was an error!')
    });
  } catch (error) {
  }
};

export const getDbiliaTrust = (dbiliaToken) => async (dispatch) => {
  try {
    dbiliaToken.methods.dbiliaTrust()
    .call()
    .then((data) => {
      dispatch({
        type: GET_DBILIA_TRUST,
        payload: data,
      });
    })
    .catch((error) => {
      console.log(error)
      window.alert('There was an error!')
    });
  } catch (error) {
  }
};

export const subscribeToEvents = (dbiliaToken, account) => async (dispatch) => {
  if (!dbiliaToken) return;

  try {
    dbiliaToken.events.MintWithETH({ filter: { _minterAddress: account } }, (error, event) => {
      if (error) {
        alert("Sorry minting could not be completed.");
        return;
      }
      dispatch({
        type: MINT_WITH_ETH_LOADED,
        payload: event.returnValues,
      });
    })
  } catch (error) {
  } 
}