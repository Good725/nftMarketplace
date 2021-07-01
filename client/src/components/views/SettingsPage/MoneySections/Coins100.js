import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import Axios from 'axios';
import {
  addCoins,
  successfulPurchase,
} from '../../../../_actions/user_actions';
import { useDispatch } from 'react-redux';
import Paypal from '../../../utils/Paypal';
import { useSelector } from 'react-redux';

function Coins100() {
  const user = useSelector((state) => state.user);
  // const userId = props.match.params.userId;
  const dispatch = useDispatch();
  const [CoinValue] = useState(10000);
  const [CoinCost] = useState(100);
  const [Money, setMoney] = useState(0);
  const [Visible, setVisible] = useState(false);
  const [CoinsVisible, setCoinsVisible] = useState(false);
  const [DateVisible, setDateVisible] = useState(false);

  const handleCloseCoinsVisable = () => {
    setCoinsVisible(false);
  };

  const handleCloseDateVisable = () => {
    setDateVisible(false);
  };

  if (user.userData && !user.userData.isAuth) {
    // alert('Login to use this page')
  }
  useEffect(() => {
    Axios.get('api/users/getCoins').then((response) => {
      if (response.data.success) {
        setMoney(response.data.money);
      } else {
        setCoinsVisible(true);
      }
    });
  }, []);

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
    dispatch(addCoins(Money + CoinCost * 100));
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
    console.log('this is from money page', data);
    console.log('this is my check jdcn lj');
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
          borderRadius: 25,
        }}
      >
        <h1
          style={{
            color: 'black',
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
            {` Buy  ${numberWithCommas(CoinValue)} Dbilia Coins`}
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
            alt='image2'
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

      <Modal
        title=''
        visible={CoinsVisible}
        onOk={handleCloseCoinsVisable}
        onCancel={handleCloseCoinsVisable}
      >
        <h4> Failed to get coins </h4>
      </Modal>

      <Modal
        title=''
        visible={DateVisible}
        onOk={handleCloseDateVisable}
        onCancel={handleCloseDateVisable}
      >
        <h4> Failed to get date </h4>
      </Modal>
    </div>
  );
}

export default Coins100;
