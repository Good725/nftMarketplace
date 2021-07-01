import React, { useEffect, useState } from 'react';

function NFTFeeBid({
  money,
  price,
  serviceFee,
  paypalFee,
  paypalFixedFeeUSD,
  update,
}) {
  return money >= Number(price) + Number(price) * serviceFee ? (
    <p
      className='confirm-popup__text'
      style={{ textAlign: 'right', marginRight: '30px' }}
    >
      Bid Amount:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(price))}
      <br />
      Service Fee:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(price) * serviceFee)}
      <br />
      Total:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(price) + Number(price) * serviceFee)}
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
      Balance After:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Math.abs(money - (Number(price) + Number(price) * serviceFee)))}
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
      }).format(Number(price))}
      <br />
      Service Fee:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(price) * serviceFee)}
      <br />
      Paypal Fee:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format((Number(price) - money) * paypalFee + paypalFixedFeeUSD)}
      <br />
      Total:{' '}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(
        Number(price) +
          Number(price) * serviceFee +
          (Number(price) - money) * paypalFee +
          paypalFixedFeeUSD
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
      Balance After: $0.00
      <br />
      <span style={{ color: 'red' }}>
        Please pay{' '}
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(
          Number(price) +
            Number(price) * serviceFee +
            ((Number(price) - money) * paypalFee + paypalFixedFeeUSD) -
            money
        )}{' '}
        more to {update > 0 ? 'update your bid' : 'place a bid'}.
      </span>
    </p>
  );
}

export default NFTFeeBid;
