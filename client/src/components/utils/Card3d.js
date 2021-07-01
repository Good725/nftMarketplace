import React, { useState, useEffect } from 'react';
import { Button, Card, notification, Modal } from 'antd';
import './DbiliaCards.css';
import AnimatedCard from '@sl-codeblaster/react-3d-animated-card';
import { useSelector, useDispatch } from 'react-redux';
import { addToMarketplace } from '../../_actions/market_actions';
import useWindowDimensions from '../views/NavBar/Sections/ScreenWidth';

function Card3d(props) {
  const dispatch = useDispatch();
  const [edition, setOwnedEdition] = useState(0);
  const [ownedEditionsArray, setOwnedEditionsArray] = useState([]);
  const [marketEditions, setMarketEditions] = useState([]);
  const [marketEditionSelected, setMarketEditionSelected] = useState(0);
  const [marketMintEditionSelected, setMarketMintEditionSelected] = useState(0);
  const [showUnlockable, setShowUnlockable] = useState(false);
  const { token, username, _id, isW3user, ethAddress, money } = useSelector(
    (state) => state.user.userData
  );
  const { cart } = useSelector((state) => state.user.profileUser);
  const auctionFinished = useSelector((state) => state.product.auctionFinished);
  const singleItem = useSelector((state) => state.product.singleItem);
  const collection = useSelector((state) => state.view.userCard);
  const { width } = useWindowDimensions();

  useEffect(() => {
    ownedEditionsArray.length > 0 &&
      setOwnedEdition(ownedEditionsArray[0].toString());
    // eslint-disable-next-line
  }, [ownedEditionsArray]);

  // USERS ARE ABLE TO SELECT A DIFFERENT EDITION TO VIEW
  const setEditionToViewClick = (e) => {
    setOwnedEdition(e.target.textContent);
  };

  // SELECTING WHICH EDITION USERS WANT TO ADD TO MARKETPLACE
  const onClickAddMarketPlace = () => {
    dispatch(
      addToMarketplace(
        props.product._id,
        props.product.editions[marketEditionSelected - 1].id
      )
    );
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // SETTING CARD TO BE SENT TO MARKET OR RESETTING CARD SELECTION
  //  IF SAME EDITION IS SELECTED
  const onClickSetMarketEdition = (e) => {
    if (marketEditionSelected === parseInt(e.target.textContent)) {
      setMarketEditionSelected(0);
    } else {
      setMarketEditionSelected(parseInt(e.target.textContent));
    }
  };

  const onClickSetMarketMintEdition = (e) => {
    if (marketMintEditionSelected === parseInt(e.target.textContent)) {
      setMarketMintEditionSelected(0);
    } else {
      setMarketMintEditionSelected(parseInt(e.target.textContent));
    }
  };

  return (
    <>
      {width > 800 ? (
        <AnimatedCard
          config={{
            rotation: 15, // this value for the divide (window.innerWidth / 2 - e.pageX) / rotation && (window.innerWidth / 2 - e.pageY) / rotation
            transition: {
              duration: 1,
              timingMode: 'ease',
            },
            transform: {
              figureIcon: {
                rotation: 20,
                translateZ: 160,
                titleTranslateZ: 100,
                bodyTextTranslateZ: 100,
                buttonTranslateZ: 80,
              },
            },
          }}
          style={{
            width: '100%',
          }}
        >
          <div
            style={{
              width: 240,
              height: 240.66666666667,
              borderRadius: 25,
              display: 'flex',

              verticalAlign: 'center',
              textAlign: 'center',
              justifyItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className='card'
              style={{
                width: 240,
                height: 240.66666666667,
                borderRadius: 25,
                display: 'flex',

                marginTop: '-10px',
                justifyItems: 'center',
                justifyContent: 'center',
              }}
            >
              {props.product.images &&
              props.product.images[0].split('/')[4] == 'video' ? (
                <video
                  autoPlay
                  loop
                  muted
                  height='auto'
                  width='100%'
                  className='bid-popup__image'
                  style={{
                    borderRadius: 20,
                    marginRight: '10px',
                    height: width > 1160 ? '341px' : '270px',
                    width: width > 1160 ? '341px' : '270px',
                    marginTop: width < 1160 && '10rem',
                    marginBottom: width < 1160 && '5rem',
                    verticalAlign: 'center',
                    textAlign: 'center',
                    justifyItems: 'center',
                    justifyContent: 'center',
                    objectFit: 'cover',
                  }}
                >
                  <source src={props.product.images} type='video/mp4' />
                  <source src={props.product.images} type='video/ogg' />
                  <source src={props.product.images} type='video/webm' />
                </video>
              ) : (
                <img
                  className='title'
                  alt='image1'
                  style={{
                    borderRadius: 20,
                    marginRight: '10px',
                    height: width > 1160 ? '341px' : '270px',
                    width: width > 1160 ? '341px' : '270px',
                    marginTop: width > 1160 ? '0rem' : '10rem',
                    marginBottom: width < 1160 && '5rem',
                    verticalAlign: 'center',
                    textAlign: 'center',
                    justifyItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',

                    objectFit: 'cover',
                  }}
                  src={props.product.images}
                />
              )}
            </div>
          </div>
        </AnimatedCard>
      ) : (
        <div
          style={{
            width: 240,
            height: 240.66666666667,
            borderRadius: 25,
            display: 'flex',
            marginBottom: '5rem',
            marginTop: '5rem',
            justifySelf: 'center',
            verticalAlign: 'center',
            textAlign: 'center',
            justifyItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className='card'
            style={{
              width: 240,
              height: 240.66666666667,
              borderRadius: 25,
              display: 'flex',

              marginTop: '-10px',
              justifyItems: 'center',
              justifyContent: 'center',
            }}
          >
            {props.product.images &&
            props.product.images[0].split('/')[4] == 'video' ? (
              <video
                autoPlay
                loop
                muted
                height='auto'
                width='100%'
                className='bid-popup__image'
                style={{
                  borderRadius: 20,
                  marginRight: '10px',
                  height: width > 1160 ? '341px' : '270px',
                  width: width > 1160 ? '341px' : '270px',
                  marginTop: width < 1160 && '10rem',
                  marginBottom: width < 1160 && '5rem',
                  verticalAlign: 'center',
                  textAlign: 'center',
                  justifyItems: 'center',
                  justifyContent: 'center',
                  objectFit: 'cover',
                }}
              >
                <source src={props.product.images} type='video/mp4' />
                <source src={props.product.images} type='video/ogg' />
                <source src={props.product.images} type='video/webm' />
              </video>
            ) : (
              <img
                className='title'
                alt='image1'
                style={{
                  borderRadius: 20,
                  marginRight: '10px',
                  height: width > 1160 ? '341px' : '270px',
                  width: width > 1160 ? '341px' : '270px',
                  marginTop: width > 1160 ? '0rem' : '10rem',
                  marginBottom: width < 1160 && '5rem',
                  verticalAlign: 'center',
                  textAlign: 'center',
                  justifyItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto',

                  objectFit: 'cover',
                }}
                src={props.product.images}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Card3d;
