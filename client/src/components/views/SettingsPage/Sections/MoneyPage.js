import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import {
  setTransactionsOpen,
  setDepositOpen,
  setWithdrawalOpen,
} from '../../../../_actions/in_view_actions';
import TransactionHistory from './TransactionHistory';
import { getUserTransactions } from '../../../../_actions/transaction_actions';
import WithdrawalPopup from './WithdrawalPopup';
import DepositPopup from './DepositPopup';

function MoneyPage() {
  const dispatch = useDispatch();
  const [currency, setCurrency] = useState('USD');
  const { _id, money } = useSelector((state) => state.user.userData);
  return (
    <div>
      <div className='wallet__currency-selection'>
        <button
          onClick={() => setCurrency('USD')}
          className={
            currency === 'USD'
              ? 'wallet__currency-button wallet__currency-button--active'
              : 'wallet__currency-button'
          }
        >
          USD
        </button>
        <button
          onClick={() => setCurrency('Eth')}
          className={
            currency === 'Eth'
              ? 'wallet__currency-button wallet__currency-button--active'
              : 'wallet__currency-button'
          }
        >
          Eth
        </button>
      </div>
      {currency === 'USD' ? (
        <div className='wallet__currency-section'>
          <h3 className='wallet__balance-text'>
            US{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(money)}
          </h3>
          <h5 className='wallet__balance-subtext'>Money in wallet</h5>
          <div className='wallet__button-section'>
            <button
              className='wallet__option-button'
              onClick={() => dispatch(setDepositOpen(true))}
            >
              Add Money
            </button>
            <button
              className='wallet__option-button'
              onClick={() => {
                dispatch(setWithdrawalOpen(true));
              }}
            >
              Request Withdrawal
            </button>
            <button
              className='wallet__option-button'
              onClick={() => {
                dispatch(setTransactionsOpen(true));
                dispatch(getUserTransactions(_id));
              }}
            >
              Transaction History
            </button>
          </div>
        </div>
      ) : (
        <div className='wallet__currency-section'>
          {' '}
          <h3 className='wallet__balance-text'>Eth {}</h3>
          <h5 className='wallet__balance-subtext'>Money in wallet</h5>
          <div className='wallet__button-section'>
            {/* <button
              className='wallet__option-button'
              onClick={() => dispatch(setDepositOpen(true))}
            >
              Add Money
            </button> */}
            <button
              className='wallet__option-button'
              onClick={() => {
                console.log('withdrawal');
                dispatch(setWithdrawalOpen(true));
              }}
            >
              Request Withdrawal
            </button>
            <button className='wallet__option-button'>
              Transaction History
            </button>
          </div>
        </div>
      )}
      <TransactionHistory />
      <WithdrawalPopup />
      <DepositPopup />
    </div>
  );
}

export default MoneyPage;
