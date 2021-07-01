import { GET_USER_TRANSACTIONS } from '../_actions/types';

const initialState = {
  transactionList: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_TRANSACTIONS:
      return {
        ...state,
        transactionList: action.payload.transactions,
      };

    default:
      return state;
  }
}
