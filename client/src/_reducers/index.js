import { combineReducers } from 'redux';
import user from './user_reducer';
import product from './product_reducer';
import search from './search_reducer';
import market from './market_reducer';
import pack from './pack_reducer';
import view from './in_view_reducer';
import web3 from './web3_reducer';
import transactions from './transaction_reducer';
import payments from './payment_reducer';
import infinite from './_infinite_reducer';
import dbiliaToken from './dbiliaToken_reducer';

const rootReducer = combineReducers({
  user,
  product,
  search,
  market,
  pack,
  view,
  web3,
  transactions,
  payments,
  infinite,
  dbiliaToken
});

export default rootReducer;
