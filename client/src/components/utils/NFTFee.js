import React, { useEffect, useState } from 'react';

function NFTFee({ money, price, serviceFee, paypalFee, paypalFixedFeeUSD }) {
  return money >= Number(price) + Number(price) * serviceFee ? (
    <p
      className='confirm-popup__text'
      style={{ textAlign: 'right', marginRight: '30px' }}
    >
      NFT Price:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(price).toFixed(2))}
      <br />
      Service Fee:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format((Number(price) * serviceFee).toFixed(2))}
      <br />
      Total:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format((Number(price) + Number(price) * serviceFee).toFixed(2))}
      <br />
      <br />
      <hr />
      <br />
      Your Dbilia USD Balance:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(money)}
      <br />
      Balance After Purchase:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(
        Math.abs(money - (Number(price) + Number(price) * serviceFee)).toFixed(
          2
        )
      )}
    </p>
  ) : (
    <p
      className='confirm-popup__text'
      style={{ textAlign: 'right', marginRight: '30px' }}
    >
      NFT Price:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(price).toFixed(2))}
      <br />
      Service Fee:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format((Number(price) * serviceFee).toFixed(2))}
      <br />
      Paypal Fee:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format((Number(price) * paypalFee + paypalFixedFeeUSD).toFixed(2))}
      <br />
      Total:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(
        (
          Number(price) +
          Number(price) * serviceFee +
          Number(price) * paypalFee +
          paypalFixedFeeUSD
        ).toFixed(2)
      )}
      <br />
      <br />
      <hr />
      <br />
      Your Dbilia USD Balance:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(money)}
      <br />
      Balance After Purchase: $0.00
      <br />
      <span style={{ color: 'red' }}>
        Please pay{' '}
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(
          (
            Number(price) +
            Number(price) * serviceFee +
            (Number(price) * paypalFee + paypalFixedFeeUSD) -
            money
          ).toFixed(2)
        )}{' '}
        more to purchase.
      </span>
    </p>
  );
}

export default NFTFee;
