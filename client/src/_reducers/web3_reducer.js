import {
  WEB3_LOADED,
  WEB3_NETWORK_LOADED,
  WEB3_ACCOUNT_LOADED,
  WEB3_BALANCE_LOADED,
  GAS_PRICES_LOADED,
  DBILIA_TOKEN_LOADED,
  MARKETPLACE_LOADED,
  MARKETPLACE_ADDRESS,
} from "../_actions/types";

const initialState = {
  connection: null,
  network: null,
  account: null,
  balance: null,
  gasPrice: null,
  dbiliaToken: null,
  marketplace: null,
  marketplaceAddress: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case WEB3_LOADED:
      return { ...state, connection: action.payload };
    case WEB3_NETWORK_LOADED:
      return { ...state, network: action.payload };
    case WEB3_ACCOUNT_LOADED:
      return { ...state, account: action.payload };
    case WEB3_BALANCE_LOADED:
      return { ...state, balance: action.payload };
    case GAS_PRICES_LOADED:
      return { ...state, gasPrice: action.payload };
    case DBILIA_TOKEN_LOADED:
      return { ...state, dbiliaToken: action.payload };
    case MARKETPLACE_LOADED:
      return { ...state, marketplace: action.payload };
    case MARKETPLACE_ADDRESS:
      return {...state, marketplaceAddress: action.payload };
    default:
      return state;
  }
}
