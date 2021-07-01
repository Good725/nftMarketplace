import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { addToShop } from '../../../_actions/user_actions';
import { useDispatch } from 'react-redux';
import CreateWeb from './Sections/CreateWeb';
import CreateMobile from './Sections/CreateMobile';
import { useSelector } from 'react-redux';
import CreatePack from './Sections/CreatePack';
import example from '../../../img/card.png';

function UploadProductPage(props) {
  const TheUserData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (!TheUserData.isAuth) {
      props.history.push('/login');
    }
  }, []);
  const handlePageSwitch = (e) => {
    e.target.textContent === 'Create Card'
      ? props.history.push('/createCard')
      : props.history.push('/createPack');
  };
  return (
    <div className='upload-product'>
      <h1 className='upload-product__header'>Creation Zone</h1>
      <h3 className='upload-product__description'>
        Welcome To the Creation Zone Here you can create your own unique card or
        create a pack of cards each one being uniquely curated by you!
      </h3>
      <div className='upload-product__selection-section'>
        <div className='upload-product__section'>
          <img src={example} className='upload-product__image' />
          <button className='upload-product__button' onClick={handlePageSwitch}>
            Create Card
          </button>
        </div>
        <div className='upload-product__section upload-product__section--2'>
          <div className='upload-product__pack-section'>
            <img src={example} className='upload-product__pack-image' />
            <img src={example} className='upload-product__pack-image' />
            <img src={example} className='upload-product__pack-image' />
            <img src={example} className='upload-product__pack-image' />
          </div>

          <button className='upload-product__button' onClick={handlePageSwitch}>
            Create Pack
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadProductPage;
