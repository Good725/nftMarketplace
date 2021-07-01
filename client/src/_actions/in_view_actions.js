import {
  SET_MENU_VIEW,
  SET_BID_OPEN,
  SET_USER_CARD,
  SET_EDITIONS_OPEN,
  SET_TRANSACTIONS_OPEN,
  SET_DEPOSIT,
  SET_WITHDRAWAL,
  SET_CONFIRM,
  SET_MINT_INFO,
  SET_OWNED_EDITIONS_OPEN,
  SET_MARKET_BID_OPEN,
} from './types';

export const setNavOpen = (open) => {
  return {
    type: SET_MENU_VIEW,
    payload: open,
  };
};

export const setUserCard = (page) => {
  return {
    type: SET_USER_CARD,
    payload: page,
  };
};

export const setConfirm = (confirm) => {
  return {
    type: SET_CONFIRM,
    payload: confirm,
  };
};
export const setBidOpen = (bid) => {
  return {
    type: SET_BID_OPEN,
    payload: bid,
  };
};
export const setMarketBidOpen = (bid) => {
  return {
    type: SET_MARKET_BID_OPEN,
    payload: bid,
  };
};
export const setEditionsOpen = (bid) => {
  return {
    type: SET_EDITIONS_OPEN,
    payload: bid,
  };
};
export const setOwnedEditionsOpen = (bid) => {
  return {
    type: SET_OWNED_EDITIONS_OPEN,
    payload: bid,
  };
};

export const setMintInfo = (bid) => {
  return {
    type: SET_MINT_INFO,
    payload: bid,
  };
};

export const setTransactionsOpen = (transaction) => {
  return {
    type: SET_TRANSACTIONS_OPEN,
    payload: transaction,
  };
};

export const setWithdrawalOpen = (withdrawal) => {
  return {
    type: SET_WITHDRAWAL,
    payload: withdrawal,
  };
};

export const setDepositOpen = (deposit) => {
  return {
    type: SET_DEPOSIT,
    payload: deposit,
  };
};

export const initialTourSpot = () => {};
