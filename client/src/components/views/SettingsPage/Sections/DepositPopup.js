import React, { useState } from 'react';
import { setDepositOpen } from '../../../../_actions/in_view_actions';
import { useSelector, useDispatch } from 'react-redux';
import {
  setDepositTransaction,
  updateMoney,
} from '../../../../_actions/user_actions';
import Paypal from '../../../utils/Paypal';
import { notification } from 'antd';

function DepositPopup(props) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState();
  const [Continue, setContinue] = useState(false);
  const deposit = useSelector((state) => state.view.deposit);
  const user = useSelector((state) => state.user.userData);

  const transactionSuccess = async (data) => {
    dispatch(updateMoney(user._id, amount, true));
    dispatch(setDepositTransaction(amount));
    dispatch(setDepositOpen(false));
    setContinue(false);
    notification['success']({
      message: `$${amount}` + ' has been successfully deposited.',
    });
  };

  const transactionError = () => {
    notification['error']({
      message: 'Sorry, something went wrong. Please try again or contact us.',
    });
    setContinue(false);
    dispatch(setDepositOpen(false));
  };

  const transactionCanceled = () => {
    notification['error']({
      message:
        'Sorry, transaction has been canceled. Please try again or contact us.',
    });
    setContinue(false);
    dispatch(setDepositOpen(false));
  };

  const onDeposit = () => {
    if (amount <= 0) {
      return;
    } else {
      setContinue(true);
    }
  };

  const onAmountBlur = () => {
    const value = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.round(amount * 100) / 100);
    setAmount(+value);
  };
  const onAmountChange = (e) => {
    setAmount(+e.target.value);
  };
  return (
    <div
      className={
        deposit ? 'confirm-popup confirm-popup--visible' : 'confirm-popup'
      }
    >
      <div className='confirm-popup__window'>
        <h2 className='confirm-popup__title' style={{ gridColumn: '2/3' }}>
          Deposit
        </h2>
        <button
          className='confirm-popup__close'
          onClick={() => dispatch(setDepositOpen(false))}
        >
          &times;
        </button>
        <input
          className='bid-popup__bid-input--money'
          value={amount}
          type='number'
          onChange={onAmountChange}
          onBlur={onAmountBlur}
          style={{ gridColumn: '2/3' }}
          // NOT SURE WHAT MIN SHOULD BE
          min={0}
          placeholder='Amount'
        />
        {!Continue && (
          <button
            className={
              amount === 0 || amount === undefined
                ? 'bid-popup__add-button bid-popup__add-button--disabled'
                : 'bid-popup__add-button'
            }
            style={{
              cursor: amount !== 0 && 'auto',
              gridColumn: '2/3',
              margin: '2rem 5rem',
              width: '20rem',

              height: '4rem',
            }}
            disabled={amount === 0 || amount === undefined}
            onClick={onDeposit}
          >
            Deposit to paypal
          </button>
        )}

        {Continue && (
          <div className='confirm-popup__add-button'>
            <Paypal
              toPay={amount}
              onSuccess={transactionSuccess}
              transactionError={transactionError}
              transactionCanceled={transactionCanceled}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default DepositPopup;
