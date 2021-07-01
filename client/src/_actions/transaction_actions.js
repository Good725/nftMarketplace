import { GET_USER_TRANSACTIONS } from './types';
import axios from 'axios';
export const getUserTransactions = (userId) => async (dispatch) => {
  try {
    const { data } = await axios.get('/api/transactions/transactions');
    dispatch({
      type: GET_USER_TRANSACTIONS,
      payload: data,
    });
  } catch (error) {
    console.log('transaction action', error);
  }
};
