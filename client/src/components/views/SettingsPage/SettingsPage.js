import React, { useState, useEffect } from 'react';
import EditProfile from './Sections/EditProfile';
import MoneyPage from './Sections/MoneyPage';
import ChangePassword from './Sections/ChangePassword';
import ConnectWallet from './Sections/ConnectWallet';
import { useSelector } from 'react-redux';
import NavBar from '../NavBar/NavBar';
import useWindowDimensions from '../NavBar/Sections/ScreenWidth';

function SettingsPage({ history }) {
  const [page, setPage] = useState('edit');
  const [userId, setuserId] = useState('');
  const TheUserData = useSelector((state) => state.user.userData);
  const { width } = useWindowDimensions();
  useEffect(() => {
    if (TheUserData) {
      setuserId(TheUserData._id);
    }
  }, [TheUserData]);

  return (
    <div className='landing__container'>
      <div
        className='settings'
        style={{
          marginTop: TheUserData.firstLogin && '15rem',
        }}
      >
        <div className='settings__nav-bar'>
          <ul className='settings__list'>
            <li
              style={{ cursor: TheUserData.firstLogin && 'auto' }}
              className={
                page === 'edit'
                  ? 'settings__item settings__item--active'
                  : 'settings__item'
              }
              onClick={() => !TheUserData.firstLogin && setPage('edit')}
            >
              Edit Profile
            </li>
            <li
              style={{ cursor: TheUserData.firstLogin && 'auto' }}
              className={
                page === 'password'
                  ? 'settings__item settings__item--active'
                  : 'settings__item'
              }
              onClick={() => !TheUserData.firstLogin && setPage('password')}
            >
              Change Password
            </li>
            <li
              style={{ cursor: TheUserData.firstLogin && 'auto' }}
              className={
                page === 'coins'
                  ? 'settings__item settings__item--active'
                  : 'settings__item'
              }
              onClick={() => !TheUserData.firstLogin && setPage('coins')}
            >
              Wallets
            </li>
            <li
              className={
                page === 'web3Wallet'
                  ? 'settings__item settings__item--active'
                  : 'settings__item'
              }
              onClick={() => setPage('web3Wallet')}
            >
              Connect Wallet
            </li>
          </ul>
        </div>
        <div className='settings__display-section'>
          {page === 'edit' ? (
            <EditProfile history={history} />
          ) : page === 'password' ? (
            <ChangePassword />
          ) : page === 'web3Wallet' ? (
            <ConnectWallet />
          ) : (
            <MoneyPage />
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
