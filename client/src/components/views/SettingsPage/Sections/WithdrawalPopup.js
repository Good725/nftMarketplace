import React, { useState } from 'react';
import { setWithdrawalOpen } from '../../../../_actions/in_view_actions';
import { useSelector, useDispatch } from 'react-redux';
import {
  setWithdrawalTransaction,
  updateMoney,
} from '../../../../_actions/user_actions';
import { notification } from 'antd';
import axios from 'axios';

function WithdrawalPopup(props) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState();
  const [paypalEmail, setPaypalEmail] = useState();
  const user = useSelector((state) => state.user.userData);
  const withdrawal = useSelector((state) => state.view.withdrawal);
  const onWithdrawal = async () => {
    if (!paypalEmail || amount <= 0) {
      return;
    }
    const payload = {
      sender_batch_header: {
        recipient_type: 'EMAIL',
        email_message: 'Dbilia USD Payouts',
        note: 'USD withdrawal request',
        sender_batch_id: new Date().toISOString(), // must be unique per batch
        email_subject: "[Dbilia] You've requested for withdrawal.",
      },
      items: [
        {
          note: 'USD withdrawal request',
          amount: {
            currency: 'USD',
            value: `${amount}`,
          },
          receiver: `${paypalEmail}`,
          sender_item_id: user._id,
        },
      ],
    };
    try {
      const result = await axios.post(`/api/payouts/create`, payload);
      if (result.data.success) {
        dispatch(updateMoney(user._id, amount, false));
        dispatch(setWithdrawalTransaction(amount));
        notification['success']({
          message:
            'Withdrawal has been successfully requested. Please check your email.',
        });
      } else {
        notification['error']({
          message:
            'Sorry, something went wrong. Please try again or contact us.',
        });
      }
    } catch (error) {
      notification['error']({
        message: 'Sorry, something went wrong. Please try again or contact us.',
      });
    }
    dispatch(setWithdrawalOpen(false));
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
  const onPaypalEmailChange = (e) => {
    setPaypalEmail(e.target.value);
  };
  return (
    <div
      className={
        withdrawal ? 'confirm-popup confirm-popup--visible' : 'confirm-popup'
      }
    >
      <div className='confirm-popup__window'>
        <h2 className='confirm-popup__title' style={{ gridColumn: '2/3' }}>
          Withdrawal
        </h2>
        <button
          className='confirm-popup__close'
          onClick={() => dispatch(setWithdrawalOpen(false))}
        >
          &times;
        </button>
        <input
          className='bid-popup__bid-input--money'
          value={amount}
          type='number'
          onChange={onAmountChange}
          style={{
            gridColumn: '2/3',
            margin: '1rem 0',
            border: '1px solid #999',
            padding: '.5rem',
          }}
          // NOT SURE WHAT MIN SHOULD BE
          min={0}
          placeholder='Amount'
        />
        <input
          //className="bid-popup__bid-input"
          value={paypalEmail}
          type='text'
          onChange={onPaypalEmailChange}
          onBlur={onAmountBlur}
          className='bid-popup__bid-input--money'
          style={{ gridColumn: '2/3' }}
          placeholder='Paypal Email'
        />
        <button
          className={
            amount === 0
              ? 'bid-popup__add-button bid-popup__add-button--disabled'
              : 'bid-popup__add-button'
          }
          style={{
            cursor: 'pointer',
            gridColumn: '2/3',
            margin: '2rem 5rem',
            width: '20rem',
            height: '4rem',
          }}
          disabled={amount === 0}
          onClick={onWithdrawal}
        >
          Withdrawal from Paypal
        </button>
      </div>
    </div>
  );
}

export default WithdrawalPopup;
