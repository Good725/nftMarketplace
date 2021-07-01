import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import AnimatedCard from '@sl-codeblaster/react-3d-animated-card';
import { useSelector, useDispatch } from 'react-redux';
import { setEdition } from '../../../../_actions/market_actions';

function BuyCardItem(props) {
  const dispatch = useDispatch();
  const [marketEditions, setMarketEditions] = useState([]);
  const [marketCardEditions, setMarketEditionSelected] = useState([]);
  const { cart } = useSelector((state) => state.user.userData);
  const edition = useSelector((state) => state.market.marketEdition);
  const availableEditions = useSelector(
    (state) => state.market.marketCardEditions
  );
  useEffect(() => {
    if (cart && props.product) {
      const cartObject = cart.filter((item) => props.product._id === item.id);
      if (cartObject && cartObject.length > 0) {
        const item = cartObject[0].ownedEditions;

        // SETTING ALL CARD EDITIONS USERS OWNS

        // ONLY GETTING EDITIONS NOT IN MARKETPLACE
        setMarketEditions(
          item
            // eslint-disable-next-line
            .map((i) => {
              if (!props.product.editions[i.edition - 1].inMarket) {
                return i.edition;
              }
            })
            .filter((i) => i)
        );
      }
    }
    // eslint-disable-next-line
  }, [cart, props.product]);

  useEffect(() => {
    if (availableEditions) {
      dispatch(setEdition(availableEditions[0]));
    }
  }, [availableEditions]);
  // SETTING CARD TO BE SENT TO MARKET OR RESETTING CARD SELECTION
  //  IF SAME EDITION IS SELECTED
  const onClickSetMarketEdition = (e) => {
    dispatch(setEdition(parseInt(e.target.textContent)));
  };

  return (
    <div>
      {/* 
		this animated card cam from:
		https://www.npmjs.com/package/@sl-codeblaster/react-3d-animated-card */}
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
            },
            titleTranslateZ: 100,
            bodyTextTranslateZ: 100,
            buttonTranslateZ: 80,
          },
        }}
        style={{
          width: 500, //container style (you can use className as well)
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
                className='title'
                style={{
                  borderRadius: 20,
                  marginRight: '10px',
                  height: '341px',
                  width: '341px',
                  marginTop: '10rem',
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
                  height: '341px',
                  width: '341px',
                  marginTop: '10rem',
                  verticalAlign: 'center',
                  textAlign: 'center',
                  justifyItems: 'center',
                  justifyContent: 'center',

                  objectFit: 'cover',
                }}
                src={props.product.images}
              />
            )}
          </div>
        </div>
      </AnimatedCard>

      <div
        style={{
          marginTop: '10rem',
        }}
      >
        <p>Selected Edition to purchase: {edition}</p>
        <ul
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${
              availableEditions && availableEditions.length
            }, min-content)`,
          }}
        >
          {availableEditions &&
            availableEditions.map((item) => (
              <li key={item}>
                <button
                  style={{
                    borderRadius: '5rem',
                    width: '3rem',
                    height: '3rem',
                    border: 'none',
                    color: 'white',
                    backgroundColor: edition === item ? '#999' : '#333',
                    gridRow: '2/3',
                    cursor: 'pointer',
                  }}
                  onClick={onClickSetMarketEdition}
                >
                  {item}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default BuyCardItem;
