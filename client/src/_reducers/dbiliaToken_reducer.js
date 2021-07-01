import {
  MINT_WITH_ETH_LOADING,
  MINT_WITH_ETH_LOADED,
  IS_PRODUCT_EDITION_MINTED,
  GET_TOKEN_OWNERSHIP,
  GET_OWNER_OF,
  GET_DBILIA_TRUST,
} from "../_actions/types";

const initialState = {
  mintWithEth: {
    loading: null,
    transactionHash: null,
    data: null,
  },
  productEditionMinted: null,
  tokenOwnership: {
    isW3user: null,
    w3owner: null,
    w2owner: null,
  },
  ownerOf: null,
  dbiliaTrust: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case MINT_WITH_ETH_LOADING:
      return {
        ...state,
        mintWithEth: { loading: true, transactionHash: action.payload },
      };
    case MINT_WITH_ETH_LOADED:
      return {
        ...state,
        mintWithEth: { loading: false, data: action.payload },
      };
    case IS_PRODUCT_EDITION_MINTED:
      return {
        ...state,
        productEditionMinted: action.payload,
      };
    case GET_TOKEN_OWNERSHIP:
      return {
        ...state,
        tokenOwnership: {
          isW3user: action.payload[0],
          w3owner: action.payload[1],
          w2owner: action.payload[2],
        },
      };
    case GET_OWNER_OF:
      return {
        ...state,
        ownerOf: action.payload,
      };
    case GET_DBILIA_TRUST:
      return {
        ...state,
        dbiliaTrust: action.payload,
      };
    default:
      return state;
  }
}
