import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Form } from 'antd';
import Axios from 'axios';
import {
  addCoins,
  addToMuseum,
  updateDailyReward,
  successfulPurchase,
} from '../../../../_actions/user_actions';
import { useDispatch } from 'react-redux';
import Paypal from '../../../utils/Paypal';
import { useSelector } from 'react-redux';

function DailyReward() {
  const user = useSelector((state) => state.user);
  // const userId = props.match.params.userId;
  const dispatch = useDispatch();

  const [dailyReward] = useState(10);
  const [timer, setTimer] = useState(Date.now());
  const [dayInMilli] = useState(86400000);
  const [hourInMilli] = useState(3600000);
  const [rewardReady, setRewardReady] = useState(false);
  const [Visible, setVisible] = useState(false);
  const [PriceValue, setPriceValue] = useState(0);
  const [CoinValue, setCoinValue] = useState(0);
  const [InputLength] = useState(13);
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
        setWallet(response.data.money);
        console.log('im working');
      } else {
        setCoinsVisible(true);

        //alert('Failed to get Coins');
      }
    });
  }, []);
  useEffect(() => {
    Axios.get('api/users/getDailyReward').then((response) => {
      if (response.data.success) {
        checkRewardReady(Date.now() - response.data.lastdailypickup);
        setTimer(timer - response.data.lastdailypickup);
        // checkRewardReady(Date.now() - 10000000000);
        // setTimer(timer - 10000000000);
      } else {
        setDateVisible(true);
        //alert('Failed to get date');
      }
    });
  }, []);

  const addDailyReward = () => {
    dispatch(addCoins(Money + dailyReward));
    dispatch(updateDailyReward(Date.now()));
    window.location.reload();
  };

  const checkRewardReady = (time) => {
    if (time >= dayInMilli) {
      setRewardReady(true);
      console.log(rewardReady);
      console.log('is reward ready');
    } else {
      console.log('is reward not ready');
    }
  };

  const handleRewardNotReady = () => {
    alert('Please come back later to collect your Daily Reward');
  };

  const [Money, setMoney] = useState(0);
  const [Wallet, setWallet] = useState(0);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const handleOpenEditProfile = () => {
    setVisible(true);
  };

  const handleCloseEditProfile = () => {
    setVisible(false);
  };
  const onCoinChange = (event) => {
    setCoinValue(event.currentTarget.value);
    setPriceValue(event.currentTarget.value / 100);
  };

  const transactionSuccess = (data) => {
    setVisible(false);
    dispatch(addCoins(Money + PriceValue * 100));
    let email = data.email;
    let address = data.address;
    let cancelled = data.cancelled;
    let paid = data.paid;
    let payerID = data.payerID;
    let paymentID = data.paymentID;
    let paymentToken = data.paymentToken;
    let returnUrl = data.returnUrl;
    alert('Transaction successful');

    console.log('this is email', email);

    // console.log('this is email', email)

    dispatch(
      successfulPurchase(
        PriceValue,
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
    alert('Transaction error');
  };

  const transactionCanceled = () => {
    setVisible(false);
    alert('Transaction canceled');
  };

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      {CoinsVisible ? (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            backgroundColor: '#f6f6f6',
            zIndex: 4,
            top: 0,
            left: 0,
            position: 'fixed',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              paddingBottom: '100px',
              position: 'fixed',
              // justifyContent: 'center',
              // alignItems: 'center',
            }}
          >
            <h2>Login to create a profile</h2>
          </div>
          <Button
            type='primary'
            htmlType='submit'
            className='login-form-button'
            style={{ width: '200px' }}
          >
            Log in
          </Button>
        </div>
      ) : null}

      <div>
        <div style={{ marginTop: '3rem', width: '100%', padding: '40px' }}>
          <div
            style={{
              marginTop: '1rem',
              marginBottom: '1rem',
              width: '100%',
              float: 'left',
              backgroundColor: 'white',
              padding: '40px',
              textAlign: 'center',
              justifyItems: 'center',
              justifyContent: 'center',
              width: '100%',
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
                  width: '30px',
                  height: '30px',
                }}
                src='/coinSVF.svg'
                alt='image'
              />
              {`     ${numberWithCommas(Wallet)}`}
              <h5 style={{ fontSize: 20, color: 'grey' }}> Dbilia Wallet</h5>
            </h1>
            {/* <br /> Level: {Level}
						<Progress percent={ProgressBar} status="active" /> */}
          </div>
          {/* <div
						style={{
							marginTop: '1rem',
							marginBottom: '1rem',
							width: '100%',
							float: 'left',
							backgroundColor: 'white',
							padding: '40px',
							textAlign: 'center',
							justifyItems: 'center',
							justifyContent: 'center',
							width: '100%',
							borderRadius: 25,
						}}
					>
						<h1>
							<img
								style={{
									width: '30px',
									height: '30px',
								}}
								src="/coinSVF.svg"
								alt="image"
							/>
							{`     ${numberWithCommas(coinBalance)}`}
							<h5 style={{ fontSize: 20, color: 'grey' }}> Coins in Cart</h5>
						</h1>
						
					</div> */}

          {/* 
					Reset daily reward button
					<Button
						type="primary"
						size={'large'}
						onClick={handleReset}
						style={{
							fontSize: 20,
							width: '100%',
							marginTop: '1rem',
							marginBottom: '1rem',
							borderRadius: 25,
							// backgroundColor: '#0066ff',
							// padding: '40px',
							// textAlign: 'center',
							// justifyItems: 'center',
							// justifyContent: 'center',
							// verticalAlign: 'center',
						}}
					>
						Reset daily reward
					</Button> */}
          {/* <Button
						type="primary"
						size={'large'}
						onClick={plusCoins}
						style={{
							fontSize: 20,
							width: '100%',
							marginTop: '1rem',
							marginBottom: '1rem',
							borderRadius: 25,
							// backgroundColor: '#0066ff',
							// padding: '40px',
							// textAlign: 'center',
							// justifyItems: 'center',
							// justifyContent: 'center',
							// verticalAlign: 'center',
						}}
					>
						Add 1 Coin
					</Button> */}
          {rewardReady ? (
            <Button
              type='primary'
              size={'large'}
              onClick={addDailyReward}
              style={{
                fontSize: 20,
                width: '100%',
                marginTop: '1rem',
                marginBottom: '1rem',
                borderRadius: 25,
                // backgroundColor: '#0066ff',
                // padding: '40px',
                // textAlign: 'center',
                // justifyItems: 'center',
                // justifyContent: 'center',
                // verticalAlign: 'center',
              }}
            >
              {/* {` Next reward in ${(23 - timer / hourInMilli).toFixed(0)}h ${(
							60 -
							(timer % hourInMilli) / minutesInMilli
						).toFixed(0)}m`} */}
              Collect Daily Reward
            </Button>
          ) : (
            <Button
              type='primary'
              size={'large'}
              onClick={handleRewardNotReady}
              style={{
                fontSize: 20,
                width: '100%',
                marginTop: '1rem',
                marginBottom: '1rem',
                borderRadius: 25,
                backgroundColor: 'grey',
                borderColor: 'grey',
                // backgroundColor: '#0066ff',
                // padding: '40px',
                // textAlign: 'center',
                // justifyItems: 'center',
                // justifyContent: 'center',
                // verticalAlign: 'center',
              }}
            >
              {/* {` Next reward in ${(23 - timer / hourInMilli).toFixed(0)}h ${(
							60 -
							(timer % hourInMilli) / minutesInMilli
						).toFixed(0)}m`} */}
              {` Next Daily Reward in ${(24 - timer / hourInMilli).toFixed(
                0
              )}h`}
            </Button>
          )}
          <Button
            style={{
              fontSize: 20,
              width: '100%',
              marginTop: '1rem',
              marginBottom: '1rem',
              borderRadius: 25,
              // backgroundColor: '#0066ff',
            }}
            onClick={handleOpenEditProfile}
          >
            Add Coins
          </Button>

          <Modal
            title=''
            // centered
            visible={Visible}
            onOk={handleCloseEditProfile}
            onCancel={handleCloseEditProfile}
            footer={[
              // <Button key="submit" type="primary">
              // 	Save
              // </Button>,
              <Paypal
                toPay={PriceValue}
                onSuccess={transactionSuccess}
                transactionError={transactionError}
                transactionCanceled={transactionCanceled}
              />,
            ]}
          >
            <h4> How many </h4>
            <Form>
              <Input
                onChange={onCoinChange}
                value={CoinValue}
                type='number'
                maxLength={InputLength}
              />
            </Form>
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

                  // flexDirection: 'row',
                  // paddingTop: '10px',
                  // paddingLeft: '10px',
                  // paddingRight: '10px',
                  // textAlign: 'center',
                  // justifyItems: 'center',
                  // justifyContent: 'center',
                  // width: '400px',
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
                  // paddingTop: '10px',
                  // paddingLeft: '10px',
                  // paddingRight: '10px',
                  // flexDirection: 'row',
                  // textAlign: 'center',
                  // justifyItems: 'center',
                  // justifyContent: 'flex-end',
                  // alignSelf: 'flex-end',
                  // textAlign: 'center',
                  // justifyItems: 'center',
                  // justifyContent: 'center',
                  // width: '400px',
                }}
              >
                {' '}
                USD$ {`     ${numberWithCommas(PriceValue)}`}
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

          {/* <Button
						type="primary"
						size={'large'}
						onClick={addCoinsHandler}
						style={{
							fontSize: 20,
							width: '100%',
							marginTop: '1rem',
							marginBottom: '1rem',
							borderRadius: 25,
							// backgroundColor: '#0066ff',
							// padding: '40px',
							// textAlign: 'center',
							// justifyItems: 'center',
							// justifyContent: 'center',
							// verticalAlign: 'center',
						}}
					>
						Save Wallet Balance
					</Button> */}
          {/* <Button
						type="primary"
						size={'large'}
						onClick={addDailyReward}
						style={{
							fontSize: 20,
							width: '100%',
							marginTop: '1rem',
							marginBottom: '1rem',
							borderRadius: 25,
							// backgroundColor: '#0066ff',
							// padding: '40px',
							// textAlign: 'center',
							// justifyItems: 'center',
							// justifyContent: 'center',
							// verticalAlign: 'center',
						}}
					>
						{` Next reward in ${(60 - (timer % hourInMilli) / minutesInMilli).toFixed(0)} minutes`}
					</Button> */}
        </div>
      </div>
    </div>
  );
}

export default DailyReward;
