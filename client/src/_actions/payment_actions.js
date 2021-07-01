import { ADD_PAYMENT, GET_USER_PAYMENTS } from "./types";
import axios from "axios";

export const addPayment = (payment) => async (dispatch) => {
  const { data } = await axios.post(`/api/payments/payment`, payment); 
  dispatch({
    type: ADD_PAYMENT,
    payload: data,
  });
};

export const getUserPayments = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/payments/payments");
    dispatch({
      type: GET_USER_PAYMENTS,
      payload: data,
    });
  } catch (error) {
    console.log("payment action", error);
  }
};
