import axios from "axios";
import {
  WEB3_LOADED,
  WEB3_NETWORK_LOADED,
  WEB3_ACCOUNT_LOADED,
  WEB3_BALANCE_LOADED,
  GAS_PRICES_LOADED,
  DBILIA_TOKEN_LOADED,
  MARKETPLACE_LOADED,
  MARKETPLACE_ADDRESS
} from "./types";

export function web3Loaded(connection) {
  return {
    type: WEB3_LOADED,
    payload: connection,
  };
}

export function web3NetworkLoaded(network) {
  return {
    type: WEB3_NETWORK_LOADED,
    payload: network,
  };
}

export function web3AccountLoaded(account) {
  return {
    type: WEB3_ACCOUNT_LOADED,
    payload: account,
  };
}

export function web3BalanceLoaded(balance) {
  return {
    type: WEB3_BALANCE_LOADED,
    payload: balance,
  };
}

export function dbiliaTokenLoaded(contract) {
  return {
    type: DBILIA_TOKEN_LOADED,
    payload: contract,
  };
}

export function marketplaceLoaded(contract) {
  return {
    type: MARKETPLACE_LOADED,
    payload: contract,
  };
}

export function marketplaceAddress(address) {
  return {
    type: MARKETPLACE_ADDRESS,
    payload: address,
  };
}

export const getGasPrices = () => async (dispatch) => {
  try {
    const local = true;
    const { data } = await axios.get(
      local
        ? "http://localhost:4000/api/web3/gas-price"
        : "https://dbiliablockchainbackend.herokuapp.com/api/web3/gas-price"
    );
    dispatch({
      type: GAS_PRICES_LOADED,
      payload: data.price,
    });
  } catch {
    // alert('Failed to get auctions');
  }
};
