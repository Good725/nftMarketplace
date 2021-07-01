import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';

import Countdown from 'react-countdown';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';
import BidPopup from './BidPopup';
import { setBidOpen } from '../../../../_actions/in_view_actions';

function ProductMarketInfo(props) {
  const { width } = useWindowDimensions();

  const [Product, setProduct] = useState({});
  const [ownedEditionsPopup, setOwnedEditionsPopup] = useState(false);
  const [sortedMarketItems, setSortedMarketItems] = useState([]);
  const [highestAsk, setHighestAsk] = useState(0);
  const [lowestAsk, setMinBid] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    // GETS PRODUCT INFORMATION UPON PAGE LOAD
    setProduct(props.detail);
  }, [props.detail]);

  // CHECKS HOW MUCH MONEY THE USER HAS

  useEffect(() => {
    const item =
      Product.editions &&
      Product.editions.length > 0 &&
      Product.editions
        .map((item, index) => item.inMarket && item)
        .filter((i) => i)
        .sort(function (a, b) {
          return b.marketPrice - a.marketPrice;
        });
    setSortedMarketItems(item);
  }, [Product]);
  // CHECKING IF CARD IS SOLD OUT
  // IF NOT INCREASES SOLD BY 1
  useEffect(() => {
    if (sortedMarketItems && sortedMarketItems.length > 0) {
      setHighestAsk(sortedMarketItems[0]);
      setMinBid(sortedMarketItems[sortedMarketItems.length - 1]);
    }
  }, sortedMarketItems);
  return (
    <>
      <div className='product__details'>
        <h2 className='product__title'>{Product.title}</h2>

        <h3 className='product__pack-name'>
          {Product.packId !== 'no-pack' && props.packName}
        </h3>
        <div className='product__creator-owner'>
          <a className='product__username' href={`/shop/${props.userId}`}>
            Creator: {props.writer}
          </a>
        </div>
        <div
          className='product__countdown-and-editions product__countdown-and-editions--auction'
          onClick={() => setOwnedEditionsPopup(true)}
        >
          <p className='product__editions'>
            Editions In Marketplace: {Product.marketCount}
          </p>
        </div>

        <>
          <h3
            className='product__price'
            style={{ cursor: 'pointer' }}
            onClick={() =>
              props.history.push(
                `/product/${Product._id}/${highestAsk.edition}`
              )
            }
          >
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(Product.price)}{' '}
            <sup>USD</sup>
          </h3>
          <h3 className='product__bid-text'>Price</h3>
          <h3
            className='product__price'
            style={{ cursor: 'pointer' }}
            onClick={() =>
              props.history.push(
                `/product/${Product._id}/${highestAsk.edition}`
              )
            }
          >
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(highestAsk.marketPrice)}{' '}
            <sup>USD</sup>
          </h3>
          <h3 className='product__bid-text'>Highest Ask</h3>
          <h3
            className='product__price'
            style={{ cursor: 'pointer' }}
            onClick={() =>
              props.history.push(`/product/${Product._id}/${lowestAsk.edition}`)
            }
          >
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(lowestAsk.marketPrice)}{' '}
            <sup>USD</sup>
          </h3>
          <h3 className='product__bid-text'>Lowest Ask</h3>
        </>

        <div>
          <button
            className={'product__add-button'}
            onClick={() => setOwnedEditionsPopup(true)}
          >
            Find Edition On Market
          </button>
        </div>
      </div>
      <div
        className={
          ownedEditionsPopup
            ? 'editions-popup editions-popup--visible'
            : 'editions-popup'
        }
      >
        <div className='editions-popup__window'>
          <>
            <button
              className='editions-popup__close'
              onClick={() => setOwnedEditionsPopup(false)}
            >
              &times;
            </button>
            <h3 className='editions-popup__history-title'>
              Editions On Market
            </h3>
            <div className='editions-popup__table-section'>
              <table className='editions-popup__table'>
                <thead>
                  <th>Edition </th>
                  <th>Price </th>
                  <th>Owner</th>
                </thead>
                <tbody>
                  {Product.editions &&
                    Product.editions.length > 0 &&
                    Product.editions.map(
                      (item, index) =>
                        item.inMarket && (
                          <tr
                            className='editions-popup__row'
                            onClick={() => {
                              setOwnedEditionsPopup(false);
                              props.history.push(
                                `/product/${Product._id}/${item.edition}`
                              );
                            }}
                          >
                            <td>{item.edition}</td>
                            <td>
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              }).format(item.marketPrice)}
                            </td>
                            <td>
                              <p>
                                {item.history[item.history.length - 1].username}
                              </p>
                            </td>
                          </tr>
                        )
                    )}
                </tbody>
              </table>
              {Product.numberEditions !== Product.sold && (
                <p style={{ padding: '3rem 0', margin: '0 auto' }}>
                  Select an edition above to purchase, add or remove from
                  marketplace
                </p>
              )}
            </div>
          </>
        </div>
      </div>
      {width > 900 && (
        <div className='product__description-section'>
          <h3 className='product__description-title'>Description</h3>
          <h3 className='product__description'>{Product.description}</h3>
        </div>
      )}
    </>
  );
}

export default ProductMarketInfo;
