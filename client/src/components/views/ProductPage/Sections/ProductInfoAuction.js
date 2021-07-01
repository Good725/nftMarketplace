import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Countdown from 'react-countdown';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';
import BidPopup from './BidPopup';
import { setBidOpen } from '../../../../_actions/in_view_actions';

function ProductInfoAuction(props) {
  const [Product, setProduct] = useState({});
  const bidSuccess = useSelector((state) => state.product.bidSuccess);
  const { width } = useWindowDimensions();
  const [productId, setProductId] = useState(Product._id);
  const [highestBid, setHighestBid] = useState(0);
  const [minBid, setMinBid] = useState(0);
  const [editionsOpen, setEditionsOpen] = useState(false);
  const [ownedEditions, setOwnedEditions] = useState(0);
  const dispatch = useDispatch();

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
  }, [props.detail]);

  // CHECKS HOW MUCH MONEY THE USER HAS
  useEffect(() => {
    setHighestBid(Product.startingBid);
    setMinBid(Product.startingBid);

    if (user.cart) {
      setOwnedEditions(
        user.cart.filter((item) => item.id === productId).length
      );
    }
    // eslint-disable-next-line
  }, [Product]);

  useEffect(() => {
    if (Product.auctionHistory && Product.auctionHistory.length > 0) {
      const sortedBids = Product.auctionHistory.sort(function (a, b) {
        return b.bid - a.bid;
      });
      if (sortedBids && sortedBids.length > 0) {
        setHighestBid(sortedBids[0].bid);
        setMinBid(sortedBids[sortedBids.length - 1].bid);
      }
    }
  }, [Product.auctionHistory, bidSuccess]);
  // CHECKING IF CARD IS SOLD OUT
  // IF NOT INCREASES SOLD BY 1

  return (
    <>
      <div className='product__details'>
        <h2 className='product__title'>{Product.title}</h2>

        <a className='product__username' href={`/shop/${props.userId}`}>
          {props.writer}
        </a>
        <h3 className='product__pack-name'>
          {Product.packId !== 'no-pack' && props.packName}
        </h3>
        <div className='product__countdown-and-editions product__countdown-and-editions--auction'>
          {moment(Product.auctionDeadline) > moment(Date.now()) ? (
            <p
              className='product__editions'
              onClick={() => {
                !user.money
                  ? props.history.push('/login')
                  : dispatch(setBidOpen(true));
              }}
              style={{ cursor: 'pointer' }}
            >
              {Product.numberEditions === 10000000000
                ? 'Unlimited'
                : Product.numberEditions}{' '}
              Editions
            </p>
          ) : (
            <>
              <div
                className={
                  editionsOpen
                    ? 'editions-popup editions-popup--visible'
                    : 'editions-popup'
                }
              >
                <div className='editions-popup__window'>
                  <>
                    <button
                      className='editions-popup__close'
                      onClick={() => setEditionsOpen(false)}
                    >
                      &times;
                    </button>
                    <h3 className='editions-popup__history-title'>
                      Sold Editions
                    </h3>
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
                                        {item.inMarket
                                          ? 'Resale'
                                          : 'Not for sale'}
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
              <p
                className='product__editions'
                onClick={() => setEditionsOpen(true)}
                style={{ cursor: 'pointer' }}
              >
                Find Other Editions
              </p>
            </>
          )}

          {moment(Product.auctionStartDate) > moment(Date.now()) ? (
            <p>
              Auction will begin in:{' '}
              <Countdown
                renderer={renderer}
                date={moment(Product.auctionStartDate)}
              />
            </p>
          ) : (
            moment(Product.auctionDeadline) > moment(Date.now()) && (
              <Countdown
                className='product__countdown'
                date={moment(Product.auctionDeadline)}
                key={moment(Product.auctionDeadline)}
                renderer={renderer}
              />
            )
          )}
        </div>

        <>
          {Product.auctionHistory && Product.auctionHistory.length === 0 ? (
            <>
              <h3 className='product__bid-text'>Initial Bid</h3>
              <h3 className='product__price'>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(Product.startingBid)}{' '}
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
          {moment(Date.now()) >= moment(Product.auctionDeadline) ? (
            <button className='product__add-button product__add-button--sold'>
              Auction is over
            </button>
          ) : (
            user._id !== Product.writer._id &&
            moment(Product.auctionStartDate) < moment(Date.now()) && (
              <button
                className='product__add-button'
                onClick={() => {
                  user.isAuth
                    ? dispatch(setBidOpen(true))
                    : props.history.push('/login');
                }}
              >
                Place/Edit Bid
              </button>
            )
          )}
        </div>
      </div>

      {moment(Date.now()) < moment(Product.auctionDeadline) && (
        <BidPopup
          Product={Product}
          highestBid={highestBid}
          ownedEditions={ownedEditions}
          minBid={minBid}
        />
      )}
    </>
  );
}

export default ProductInfoAuction;
