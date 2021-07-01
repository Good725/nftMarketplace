import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import {
  addCoins,
  successfulPurchase,
} from '../../../../_actions/user_actions';
import { useDispatch } from 'react-redux';
import Paypal from '../../../utils/Paypal';

function Coins50Mobile(props) {
  const dispatch = useDispatch();
  const [CoinValue] = useState(5000);
  const [CoinCost] = useState(50);
  const [Visible, setVisible] = useState(false);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const handleOpenBuyModal = () => {
    setVisible(true);
  };

  const handleCloseBuyModal = () => {
    setVisible(false);
  };

  const transactionSuccess = (data) => {
    setVisible(false);
    dispatch(addCoins(props.Money + CoinCost * 100));
    let email = data.email;
    let address = data.address;
    let cancelled = data.cancelled;
    let paid = data.paid;
    let payerID = data.payerID;
    let paymentID = data.paymentID;
    let paymentToken = data.paymentToken;
    let returnUrl = data.returnUrl;
    alert('Transaction successful');

    dispatch(
      successfulPurchase(
        CoinCost,
        email,
        address,
        cancelled,
        paid,
        payerID,
        paymentID,
        paymentToken,
        returnUrl
      )
    );
    window.location.reload();
  };

  const transactionError = () => {
    setVisible(false);
    console.log('PayPal Error');
    alert('Transaction error');
  };

  const transactionCanceled = () => {
    setVisible(false);
    console.log('Transaction canceled');
    alert('Transaction canceled');
  };

  return (
    <div style={{ float: 'left', margin: '2.5vw' }}>
      <div
        style={{
          width: '45vw',
          backgroundColor: 'white',
          textAlign: 'center',
          justifyItems: 'center',
          justifyContent: 'center',
          borderRadius: 15,
        }}
      >
        <h1 style={{ fontSize: '10vw', color: 'black' }}>
          <img
            style={{
              width: '7vw',
              marginBottom: '7px',
            }}
            src='/coinSVF.svg'
            alt='image1'
          />
          {`     ${numberWithCommas(CoinValue)}`}
          <h5 style={{ fontSize: '5vw', color: 'grey' }}>
            {' '}
            {`${numberWithCommas(CoinValue)} Dbilia Coins`}
          </h5>
        </h1>
      </div>

      <Button
        type='primary'
        size={'large'}
        style={{
          fontSize: 20,
          width: '45vw',
          borderRadius: 25,
        }}
        onClick={handleOpenBuyModal}
      >
        {`$${CoinCost}`}
      </Button>

      <Modal
        title=''
        visible={Visible}
        onOk={handleCloseBuyModal}
        onCancel={handleCloseBuyModal}
        footer={[
          <Paypal
            toPay={CoinCost}
            onSuccess={transactionSuccess}
            transactionError={transactionError}
            transactionCanceled={transactionCanceled}
          />,
        ]}
      >
        <h1
          style={{
            color: 'black',
            textAlign: 'center',
            justifyItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            style={{
              width: '35px',
              marginBottom: '7px',
            }}
            src='/coinSVF.svg'
            alt='image1'
          />
          {`     ${numberWithCommas(CoinValue)}`}
          <h5 style={{ fontSize: 20, color: 'grey' }}>
            {' '}
            {` Buy  ${numberWithCommas(CoinValue)} Dbilia Coins`}
          </h5>
        </h1>
        <div>
          <h4
            style={{
              fontWeight: 'bold',
            }}
          >
            {' '}
            Order Summary{' '}
          </h4>
          <h4
            style={{
              display: 'inline-block',
              position: 'absolute',
              left: '50px',
            }}
          >
            {' '}
            {`     ${numberWithCommas(CoinValue)}`} Dbilia Coins{' '}
          </h4>
          <h4
            style={{
              position: 'absolute',
              right: '50px',
              display: 'inline-block',
            }}
          >
            {' '}
            USD$ {`     ${numberWithCommas(CoinCost)}`}
          </h4>
        </div>
      </Modal>
    </div>
  );
}

export default Coins50Mobile;
