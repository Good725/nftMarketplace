/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import {coinTrans.png} from './icons';

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const TheUserData = useSelector((state) => state.user.userData);
  const [role] = useState(0);
  const [UserId, setUserId] = useState(0);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push('/login');
      } else {
        alert('Log Out Failed');
      }
    });
  };

  useEffect(() => {
    if (TheUserData) {
      setUserId(TheUserData._id);
    }
  }, [TheUserData]);

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu
        mode={props.mode}
        style={{
          textAlign: 'center',
          justifyItems: 'center',
          justifyContent: 'center',
          color: 'black',
        }}
      >
        <Menu.Item key='Home'>
          <a href='/' style={{ color: 'black' }}>
            {' '}
            Home{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='Marketplace'>
          <a href='/marketplace' style={{ color: 'black' }}>
            {' '}
            Marketplace{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='upload'>
          <a href='/product/upload' style={{ color: 'black' }}>
            {' '}
            Create{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='Profile'>
          <a href={`/collection/${UserId}`} style={{ color: 'black' }}>
            {' '}
            Profile{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='mail'>
          <a href='/login' style={{ color: 'black' }}>
            Log In
          </a>
        </Menu.Item>
      </Menu>
    );
  } else if (role === 1 || 2) {
    return (
      <Menu
        mode={props.mode}
        style={{
          textAlign: 'center',
          justifyItems: 'center',
          justifyContent: 'center',
          color: 'black',
        }}
      >
        <Menu.Item key='Home'>
          <a href='/' style={{ color: 'black' }}>
            {' '}
            Home{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='SearchMenuIcon'>
          <a href='/search' style={{ color: 'black' }}>
            {' '}
            Discover{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='Marketplace'>
          <a href='/marketplace' style={{ color: 'black' }}>
            {' '}
            Marketplace{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='Coins'>
          <a href='/coins' style={{ color: 'black' }}>
            {' '}
            Coins{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='upload'>
          <a href='/product/upload' style={{ color: 'black' }}>
            {' '}
            Create{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='Profile'>
          <a href={`/collection/${UserId}`} style={{ color: 'black' }}>
            {' '}
            Profile{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='logout'>
          <a onClick={logoutHandler} style={{ color: 'black' }}>
            Logout
          </a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu
        mode={props.mode}
        style={{
          textAlign: 'center',
          justifyItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Menu.Item key='Home'>
          <a href='/' style={{ color: 'black' }}>
            {' '}
            Home{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='SearchMenuIcon'>
          <a href='/search' style={{ color: 'black' }}>
            {' '}
            Discover{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='Marketplace'>
          <a href='/marketplace' style={{ color: 'black' }}>
            {' '}
            Marketplace{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='Coins'>
          <a href='/coins' style={{ color: 'black' }}>
            {' '}
            Coins{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='upload'>
          <a href='/product/upload' style={{ color: 'black' }}>
            {' '}
            Create{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='Profile'>
          <a href={`/collection/${UserId}`} style={{ color: 'black' }}>
            {' '}
            Profile{' '}
          </a>
        </Menu.Item>
        <Menu.Item key='logout'>
          <a onClick={logoutHandler} style={{ color: 'black' }}>
            Logout
          </a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
