import React from 'react';
import { Card } from 'antd';
import Countdown from 'react-countdown';
import moment from 'moment';
import useWindowDimensions from '../views/NavBar/Sections/ScreenWidth';
import { useDispatch, useSelector } from 'react-redux';
import { setUserCard } from '../../_actions/in_view_actions';
import sprite from '../../img/sprite.svg';

function DbiliaCardThreeSimple(props) {
  const { width } = useWindowDimensions();

  const dispatch = useDispatch();
  const renderer = ({ days, hours, minutes, seconds }) => {
    return days != '0' ? (
      <span>
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    ) : days == '0' && hours !== 0 ? (
      <span>
        {hours}h {minutes}m {seconds}s
      </span>
    ) : days == '0' && hours == '0' && minutes !== 0 ? (
      <span>
        {minutes}m {seconds}s
      </span>
    ) : days == '0' && hours == '0' && minutes == '0' ? (
      <span style={{ color: 'red' }}>{seconds}s</span>
    ) : (
      <span></span>
    );
  };
  const { _id } = useSelector((state) => state.user.userData);
  const profileId = useSelector((state) => state.user.profileUser._id);
  return (
    <div
      className='card__grid-item'
      style={{ marginBottom: width < 405 && '3rem', display: 'grid' }}
      onClick={() => {
        if (_id === profileId) {
          dispatch(setUserCard(props.collection));
        }
      }}
    >
      <div
        className='card__item'
        style={{
          marginBottom:
            moment(props.product.auctionDeadline) > moment(Date.now()) ||
            props.displayCardsOwned
              ? '0.5rem'
              : '2.8rem',
        }}
      >
        <Card
          hoverable={true}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 25,
            borderWidth: '5px',
            borderColor: 'white',
            verticalAlign: 'center',
            textAlign: 'center',
            justifyItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',

            // backgroundBlendMode: 'luminosity',
            outline: 'none',
            // borderRadius: props.product.numberCardsInPack && 25,
            // borderWidth: props.product.numberCardsInPack && '5px',
            // borderColor: props.product.numberCardsInPack && '#7f2edc',
          }}
        >
          <a
            href={
              props.collection === 'own'
                ? `${props.link}${props.product._id}/${props.lowestEdition}`
                : `${props.link}${props.product._id}`
            }
          >
            <div
              style={{
                minWidth: '100%',

                height: '241px',
                width: '11px',
                verticalAlign: 'center',
                textAlign: 'center',
                justifyItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                color: 'black',
                marginTop: '25px',
              }}
            >
              <img
                style={{
                  height: '241px',
                  width: '100%',
                  verticalAlign: 'center',
                  textAlign: 'center',
                  justifyItems: 'center',
                  justifyContent: 'center',

                  objectFit: 'contain',
                }}
                alt='image1'
                src={
                  props.product.videoPreview === 'false'
                    ? props.product.images
                    : props.product.videoPreview
                }
              />
            </div>
            <div
              style={{
                fontWeight: 'bold',
                // fontSize: `${adjustFont(props.product.title)}px`,
                fontSize: `14px`,
                marginBottom: '-1px',
                color: 'black',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {props.product.title}
            </div>
            <div
              style={{
                color: '#d7d7d7',
                fontWeight: 'bold',
                marginTop: '10px',
                display: 'inline-block',
              }}
            >
              {props.writer}
              {props.role === 2 ? (
                <img
                  style={{
                    width: '10px',
                    marginRight: '13px',
                    marginBottom: '3px',
                  }}
                  src='/verifiedIcon.svg'
                  alt='image1'
                />
              ) : null}
            </div>

            <div
              style={{
                color: '#d7d7d7',
                fontWeight: 'bold',
                position: 'absolute',
                bottom: '0',
                right: '15%',
                left: '15%',
              }}
            >
              {props.product.auction ? (
                <p style={{ color: '#d7d7d7' }}>
                  {props.product.numberEditions === 10000000000
                    ? 'Unlimited'
                    : props.product.numberEditions}{' '}
                  Editions
                </p>
              ) : props.marketUser ? (
                <p style={{ fontSize: '1.7rem' }}>
                  {props.totalEditionsInMarket}
                </p>
              ) : (
                <div style={{ display: 'grid', alignItems: 'center' }}>
                  <p
                    style={{
                      color: '#d7d7d7',
                      gridRow: '1/2',
                    }}
                  >
                    {props.pack
                      ? props.product.numberCardsInPack
                      : props.product.numberEditions === props.product.sold &&
                        props.collection !== 'own'
                      ? 'Sold Out'
                      : `Edition ${
                          props.displayCardsOwned
                            ? props.edition
                            : props.product.sold + 1
                        } of  ${
                          props.product.numberEditions !== 10000000000
                            ? props.product.numberEditions
                            : 'Unlimited'
                        }`}
                  </p>
                </div>
              )}

              {props.product.auction ? (
                <p>
                  Top Bid:{' '}
                  {props.product.auctionHistory.length > 0
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(
                        props.product.auctionHistory[
                          props.product.auctionHistory.length - 1
                        ].bid
                      )
                    : 0}
                </p>
              ) : (
                !props.marketUser && (
                  <p style={{ fontSize: width > 800 ? '1.4rem' : '1.7rem' }}>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(props.product.price)}
                  </p>
                )
              )}
            </div>
          </a>
        </Card>
      </div>
      {props.displayCardsOwned && (
        <p className='card__count'>{props.cardCount}</p>
      )}
      {moment(props.product.auctionStartDate) > moment(Date.now()) ? (
        <>
          <p
            style={{
              transform: 'translateY(1rem)',
              margin: '0 auto',
              justifySelf: 'center',
              backgroundColor: 'transparent',
            }}
          >
            Auction will begin in:{' '}
            <Countdown
              renderer={renderer}
              date={moment(props.product.auctionStartDate)}
            />
          </p>
        </>
      ) : (
        moment(props.product.auctionDeadline) > moment(Date.now()) && (
          <p
            style={{
              transform: 'translateY(1rem)',
              margin: '0 auto',
              justifySelf: 'center',
              backgroundColor: 'transparent',
            }}
          >
            <Countdown
              renderer={renderer}
              date={moment(props.product.auctionDeadline)}
            />
          </p>
        )
      )}
    </div>
  );
}

export default DbiliaCardThreeSimple;
