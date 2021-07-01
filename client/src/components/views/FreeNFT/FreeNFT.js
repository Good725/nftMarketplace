import React, { useState } from 'react';
import freeNFT from '../../../img/freeNFT.png';
import freeNFTOpen from '../../../img/freeNFTOpen.png';
import { useSelector, useDispatch } from 'react-redux';
import { notification } from 'antd';
import videoSource from '../../../img/NFTs Are Fueling a Boom in Digital Art. Here’s How They Work _ WSJ.mp4';
import {
  addFirstNFT,
  endTour,
  auth,
  incrementTour,
  addToCart,
} from '../../../_actions/user_actions';
function FreeNFT(props) {
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState(false);
  const { _id, cart } = useSelector((state) => state.user.userData);

  const dispatch = useDispatch();

  return (
    <div className='tour tour__open'>
      <div className='tour__free-nft'>
        {video ? (
          <>
            <p className='tour__close-video' onClick={() => setVideo(false)}>
              X
            </p>

            <div className='tour__video'>
              <video
                autoPlay
                loop
                controls
                height='auto'
                width='100%'
                style={{ borderRadius: '5rem' }}
              >
                <source src={videoSource} type='video/mp4' />
                <source src={videoSource} type='video/ogg' />
                <source src={videoSource} type='video/webm' />
              </video>
            </div>
          </>
        ) : (
          <>
            <div className='card-flip'>
              <div
                className={
                  open
                    ? 'card-flip__side card-flip__side--front--click'
                    : 'card-flip__side card-flip__side--front'
                }
              >
                <img
                  src={freeNFT}
                  alt='freeNFT'
                  className='tour__nft-image'
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOpen(true)}
                />
              </div>
              <div
                className={
                  open
                    ? 'card-flip__side card-flip__side--back--click'
                    : 'card-flip__side card-flip__side--back'
                }
              >
                <img
                  src={freeNFTOpen}
                  alt='freeNFT'
                  className='tour__nft-image'
                />
              </div>
            </div>

            {open ? (
              <button
                className='tour__button tour__button--next tour__button--next--inline'
                style={{ marginTop: '3rem' }}
                onClick={() => {
                  if (_id) {
                    dispatch(addToCart('60cd0c07e19b0d3f609c1e39'))
                      .then(() => {
                        dispatch(endTour());
                        dispatch(auth());
                        setTimeout(() => {
                          props.history.push(`/collection/${_id}`);
                        }, 200);
                      })
                      .catch(() => {
                        notification['error']({
                          message: 'Error, please refresh and try again!',

                          duration: 5,
                        });
                      });
                  } else {
                    props.history.push(`/login`);
                  }
                }}
              >
                Claim
              </button>
            ) : (
              <button
                style={{ marginTop: '3rem' }}
                className='tour__button tour__button--open'
                onClick={() => {
                  setOpen(true);
                }}
              >
                Open
              </button>
            )}

            <p className='tour__text--what-nft' onClick={() => setVideo(true)}>
              What Is An NFT?
            </p>
          </>
        )}{' '}
      </div>
    </div>
  );
}

export default FreeNFT;
