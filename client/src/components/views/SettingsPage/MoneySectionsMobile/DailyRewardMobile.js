import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import Axios from 'axios';
import { addCoins, updateDailyReward } from '../../../../_actions/user_actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

function DailyReward(props) {
  const user = useSelector((state) => state.user);
  // const userId = props.match.params.userId;
  const dispatch = useDispatch();

  const [dailyReward] = useState(10);
  const [timer, setTimer] = useState(Date.now());
  const [dayInMilli] = useState(86400000);
  const [hourInMilli] = useState(3600000);
  const [rewardReady, setRewardReady] = useState(false);
  const [CoinsVisible] = useState(false);

  if (user.userData && !user.userData.isAuth) {
    // alert('Login to use this page')
  }
  useEffect(() => {
    Axios.get('api/users/getDailyReward').then((response) => {
      if (response.data.success) {
        checkRewardReady(Date.now() - response.data.lastdailypickup);
        setTimer(timer - response.data.lastdailypickup);
      } else {
        return;
      }
    });
    // eslint-disable-next-line
  }, []);

  const addDailyReward = () => {
    dispatch(addCoins(props.Money + dailyReward));
    dispatch(updateDailyReward(Date.now()));
    window.location.reload();
  };

  const checkRewardReady = (time) => {
    if (time >= dayInMilli) {
      setRewardReady(true);
      // console.log(rewardReady);
      // console.log('is reward ready');
    } else {
      // console.log('is reward not ready');
    }
  };

  const handleRewardNotReady = () => {
    alert('Please come back later to collect your Daily Reward');
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

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
        <div style={{ width: '100%' }}>
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
              {`     ${numberWithCommas(props.Wallet)}`}
              <h5 style={{ fontSize: 20, color: 'grey' }}> Wallet Balance</h5>
            </h1>
          </div>

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
              }}
            >
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
              }}
            >
              {` Next Daily Reward in ${(24 - timer / hourInMilli).toFixed(
                0
              )}h`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyReward;
