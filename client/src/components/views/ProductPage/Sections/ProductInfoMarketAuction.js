import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Countdown from 'react-countdown';
import BidMarketPopup from './BidMarketPopup';
import {
  setEditionsOpen,
  setMarketBidOpen,
  setOwnedEditionsOpen,
} from '../../../../_actions/in_view_actions';

function ProductInfoMarketAuction(props) {
  const [Product, setProduct] = useState({});
  const { singleItem, marketBidSuccess } = useSelector(
    (state) => state.product
  );
  const [productId, setProductId] = useState(Product._id);
  const [highestBid, setHighestBid] = useState(0);
  const [minBid, setMinBid] = useState(0);

  const [ownedEditionsCount, setOwnedEditions] = useState(0);
  const [ownerUsername, setOwnerUsername] = useState();
  const [ownerId, setOwnerId] = useState();
  const dispatch = useDispatch();
  const { confirm, editions, ownedEditions, marketBid } = useSelector(
    (state) => state.view
  );
  const user = useSelector((state) => state.user.userData);

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
  useEffect(() => {
    // GETS PRODUCT INFORMATION UPON PAGE LOAD
    setProduct(props.detail);
    setProductId(props.detail._id);
  }, [props.detail, marketBid]);

  // CHECKS HOW MUCH MONEY THE USER HAS
  useEffect(() => {
    if (Product.editions) {
      setHighestBid(Product.editions[props.edition].startingBid);
      setMinBid(Product.editions[props.edition].startingBid);
      setOwnerUsername(
        Product.editions[props.edition].history[
          Product.editions[props.edition].history.length - 1
        ].username
      );
      setOwnerId(
        Product.editions[props.edition].history[
          Product.editions[props.edition].history.length - 1
        ].owner
      );
    }
    if (user.cart) {
      setOwnedEditions(
        user.cart.filter((item) => item.id === productId).length
      );
    }
    // eslint-disable-next-line
  }, [Product.editions, singleItem]);

  useEffect(() => {
    if (
      Product.editions &&
      Product.editions[props.edition].auctionHistory &&
      Product.editions[props.edition].auctionHistory.length > 0
    ) {
      const sortedBids = Product.editions[props.edition].auctionHistory.sort(
        function (a, b) {
          return b.bid - a.bid;
        }
      );
      if (sortedBids && sortedBids.length > 0) {
        setHighestBid(sortedBids[0].bid);
        setMinBid(sortedBids[sortedBids.length - 1].bid);
      }
    }
  }, [Product.editions, marketBidSuccess]);
  // CHECKING IF CARD IS SOLD OUT
  // IF NOT INCREASES SOLD BY 1

  return (
    <>
      <div className='product__details'>
        <h2 className='product__title'>{Product.title}</h2>
        <div
          className='product__creator-owner'
          style={{ marginBottom: '.5rem' }}
        >
          <a className='product__username' href={`/shop/${props.userId}`}>
            Creator: {props.writer}
          </a>
        </div>
        <a
          className='product__username'
          style={{ marginBottom: '.5rem' }}
          href={`/collection/${ownerId}`}
        >
          Owner: {ownerUsername}
        </a>
        {user._id !== ownerId &&
          Product.editions &&
          Product.editions[props.edition].inMarket && (
            <p className='product__editions' style={{ marginTop: '.5rem' }}>
              Wallet Balance :{' '}
              {user.money &&
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(user.money)}
            </p>
          )}
        {Product.royalties > 0 && (
          <p
            className='product__editions'
            style={{ marginTop: '1rem', fontStyle: 'italic' }}
          >
            {Product.royalties}% of sales will go to creator
          </p>
        )}
        <h3 className='product__pack-name'>
          {Product.packId !== 'no-pack' && props.packName}
        </h3>
        <div className='product__countdown-and-editions product__countdown-and-editions--auction'>
          {Product.editions &&
          moment(Product.editions[props.edition].auctionDeadline) >
            moment(Date.now()) ? (
            <p
              className='product__editions'
              onClick={() => {
                !user.money
                  ? props.history.push('/login')
                  : dispatch(setEditionsOpen(true));
              }}
              style={{ cursor: 'pointer' }}
            >
              {`Edition ${props.edition + 1} of ${
                Product.numberEditions === 10000000000
                  ? 'Unlimited'
                  : Product.numberEditions
              }`}
            </p>
          ) : (
            <>
              <p
                className='product__editions'
                onClick={() => dispatch(setEditionsOpen(true))}
                style={{ cursor: 'pointer' }}
              >
                Find Other Editions
              </p>
            </>
          )}
          {ownedEditionsCount !== 0 && (
            <p
              className='product__owned-editions'
              onClick={() => dispatch(setOwnedEditionsOpen(true))}
            >
              {user.username} Editions: {ownedEditionsCount}
            </p>
          )}
          {Product.editions &&
            (moment(Product.editions[props.edition].auctionStartDate) >
            moment(Date.now()) ? (
              <p style={{ marginTop: '1rem' }}>
                Auction will begin in:{' '}
                <Countdown
                  renderer={renderer}
                  key={moment(Product.editions[props.edition].auctionStartDate)}
                  date={moment(
                    Product.editions[props.edition].auctionStartDate
                  )}
                />
              </p>
            ) : (
              moment(Product.editions[props.edition].auctionDeadline) >
                moment(Date.now()) && (
                <Countdown
                  className='product__countdown'
                  date={moment(Product.editions[props.edition].auctionDeadline)}
                  key={moment(Product.editions[props.edition].auctionDeadline)}
                  renderer={renderer}
                />
              )
            ))}
        </div>
        <div
          className={
            editions
              ? 'editions-popup editions-popup--visible'
              : 'editions-popup'
          }
        >
          <div className='editions-popup__window'>
            <>
              <button
                className='editions-popup__close'
                onClick={() => dispatch(setEditionsOpen(false))}
              >
                &times;
              </button>
              <h3 className='editions-popup__history-title'>Sold Editions</h3>
              <div className='editions-popup__table-section'>
                <table className='editions-popup__table'>
                  <thead>
                    <th>Edition </th>
                    <th>Owner </th>
                    <th>In Market</th>
                  </thead>
                  <tbody>
                    {Product.editions &&
                      Product.editions.length > 0 &&
                      Product.editions.map(
                        (item, index) =>
                          item.history.length > 0 && (
                            <tr
                              className={
                                item.history.length === 0
                                  ? 'editions-popup__row--not-sold'
                                  : 'editions-popup__row'
                              }
                              onClick={() => {
                                item.history.length !== 0 &&
                                  setEditionsOpen(false);
                                item.history.length !== 0 &&
                                  props.history.push(
                                    `/product/${Product._id}/${item.edition}`
                                  );
                              }}
                            >
                              <td>{item.edition}</td>
                              <td>
                                {item.history.length === 0
                                  ? 'Not sold'
                                  : item.history[item.history.length - 1]
                                      .username}
                              </td>

                              <td>
                                <p>
                                  {item.inMarket ? 'Resale' : 'Not for sale'}
                                </p>
                              </td>
                            </tr>
                          )
                      )}
                  </tbody>
                </table>
                <h4 style={{ margin: '2rem auto', marginBottom: '2rem' }}>
                  Select a sold edition above to view or purchase
                </h4>
              </div>
            </>
          </div>
        </div>
        <>
          {Product.editions &&
          Product.editions[props.edition] &&
          Product.editions[props.edition].auctionHistory &&
          Product.editions[props.edition].auctionHistory.length === 0 ? (
            <>
              <h3 className='product__bid-text'>Initial Bid</h3>
              <h3 className='product__price'>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(Product.editions[props.edition].startingBid)}{' '}
                <sup>USD</sup>
              </h3>
            </>
          ) : (
            <>
              <h3 className='product__price'>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(highestBid)}{' '}
                <sup>USD</sup>
              </h3>
              <h3 className='product__bid-text'>Highest Bid</h3>
              <h3 className='product__price'>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(minBid)}{' '}
                <sup>USD</sup>
              </h3>
              <h3 className='product__bid-text'>Lowest Bid</h3>
            </>
          )}
        </>

        <div>
          {Product.editions &&
          moment(Date.now()) >
            moment(Product.editions[props.edition].auctionDeadline) ? (
            <button className='product__add-button product__add-button--sold'>
              Auction is over
            </button>
          ) : (
            Product.writer &&
            user._id !== Product.writer._id &&
            moment(Date.now()) >=
              moment(Product.editions[props.edition].auctionStartDate) && (
              <button
                className='product__add-button'
                onClick={() => {
                  !user._id
                    ? props.history.push('/login')
                    : dispatch(setMarketBidOpen(true));
                }}
              >
                Place/Edit Bid
              </button>
            )
          )}
        </div>
      </div>
      <div
        className={
          ownedEditions
            ? 'editions-popup editions-popup--visible'
            : 'editions-popup'
        }
      >
        <div className='editions-popup__window'>
          <>
            <button
              className='editions-popup__close'
              onClick={() => dispatch(setOwnedEditionsOpen(false))}
            >
              &times;
            </button>

            <h3 className='editions-popup__history-title'>Owned Editions</h3>
            <div className='editions-popup__table-section'>
              <table className='editions-popup__table'>
                <thead>
                  <th>Edition </th>
                  <th>In Market</th>
                </thead>
                <tbody>
                  {Product.editions &&
                    Product.editions.length > 0 &&
                    Product.editions.map(
                      (item, index) =>
                        item.history.length !== 0 &&
                        user._id ===
                          item.history[item.history.length - 1].owner && (
                          <tr
                            className='editions-popup__row'
                            onClick={() => {
                              dispatch(setOwnedEditionsOpen(false));
                              props.history.push(
                                `/product/${Product._id}/${item.edition}`
                              );
                            }}
                          >
                            <td>{item.edition}</td>
                            <td>
                              <p>
                                {item.inMarket ? 'In Market' : 'Not for sale'}
                              </p>
                            </td>
                          </tr>
                        )
                    )}
                </tbody>
              </table>
              {Product.numberEditions !== Product.sold && (
                <p style={{ padding: '3rem 0' }}>
                  Select an edition above to add or remove from marketplace
                </p>
              )}
            </div>
          </>
        </div>
      </div>
      {Product.editions &&
        moment(Date.now()) <
          moment(Product.editions[props.edition].auctionDeadline) && (
          <BidMarketPopup
            Product={Product}
            market={true}
            edition={props.edition}
            highestBid={highestBid}
            ownedEditions={ownedEditions}
            minBid={minBid}
          />
        )}
    </>
  );
}

export default ProductInfoMarketAuction;
