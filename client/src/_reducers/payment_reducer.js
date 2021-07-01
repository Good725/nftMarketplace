import { ADD_PAYMENT, GET_USER_PAYMENTS } from '../_actions/types';

const initialState = {
  payment: false,
  paymentList: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_PAYMENT:
      return { ...state, payment: action.payload.success };
    case GET_USER_PAYMENTS:
      return {
        ...state,
        paymentList: action.payload.payments,
      };

    default:
      return state;
  }
}
