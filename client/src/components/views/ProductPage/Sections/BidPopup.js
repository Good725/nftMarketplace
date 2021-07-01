import React, { useEffect, useState } from 'react';
import { addCoins, updateMoney } from '../../../../_actions/user_actions';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import {
  editBid,
  placeInitialProductBid,
  resetBid,
  resetEditBid,
} from '../../../../_actions/product_actions';
import moment from 'moment';
import Countdown from 'react-countdown';
import { setBidOpen } from '../../../../_actions/in_view_actions';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';
import Paypal from '../../../utils/Paypal';
import axios from 'axios';
import NFTFeeBid from '../../../utils/NFTFeeBid';

function BidPopup({ Product, highestBid }) {
  const [Money, setMoney] = useState(0);
  const [Total, setTotal] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [Continue, setContinue] = useState(false);
  const [updateBid, setUpdateBid] = useState(false);
  const [bidAmount, setBidAmount] = useState();
  const [originalBidAmount, setOrignalBidAmount] = useState();
  const [bidId, setBidId] = useState();
  const [updateBidAmount, setUpdateBidAmount] = useState();
  const [updateDif, setUpdateDif] = useState();
  const user = useSelector((state) => state.user.userData);
  const bidSuccess = useSelector((state) => state.product.bidSuccess);
  const bidOpen = useSelector((state) => state.view.bid);
  const { width } = useWindowDimensions();
  const serviceFee = 0.025;
  const paypalFee = 0.029;
  const paypalFixedFeeUSD = 0.3;
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
    setBidAmount(Product.startingBid);

    // eslint-disable-next-line
  }, [Product]);

  useEffect(() => {
    if (Product.auctionHistory && Product.auctionHistory.length > 0) {
      const sortedBids = Product.auctionHistory.sort(function (a, b) {
        return b.bid - a.bid;
      });
      if (sortedBids && sortedBids.length > 0) {
        // always rounds up
        setBidAmount(
          Math.ceil(sortedBids[0].bid * 1.05 * Math.pow(10, 2)) /
            Math.pow(10, 2)
        );
      }
    }
  }, [Product.auctionHistory, bidSuccess]);

  const dispatch = useDispatch();
  const onBidChange = (e) => {
    setBidAmount(+e.target.value);
  };
  const onBidBlur = () => {
    const value = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.round(bidAmount * 100) / 100);
    setBidAmount(+value);
    setUpdateBid(false);
  };
  const onBidUpdate = (e) => {
    setUpdateBidAmount(+e.target.value);
  };
  const onBidUpdateBlur = () => {
    const value = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.round(updateBidAmount * 100) / 100);
    setUpdateBidAmount(+value);
  };

  const calculateUpdatedBidPayment = (originalBid, bidId) => {
    const amountToPay = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(updateBidAmount - originalBid);
    // UPDATE BID AMOUNT
    setUpdateDif(amountToPay);
    setOrignalBidAmount(originalBid);
    setBidId(bidId);
  };

  const transactionSuccess = async (data) => {
    // BUYER HAD SHORT OF MONEY
    // DEDUCT money FROM EXISTING BALANCE
    dispatch(updateMoney(user._id, user.money, false));
    // TRIGGER THIS ONLY WHEN PLACING A BID NOT UPDATING
    if (!updateBid) {
      // KICKED OUT BIDDER GETS REFUNDED (ONLY BIDDING AMOUNT)
      dispatch(placeInitialProductBid(Product._id, +bidAmount));
      notification['success']({
        message: 'Successfully bid!',
        description: `You have bid  ${new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(bidAmount)} for ${Product.title}.`,
        duration: 5,
      });
    } else {
      dispatch(editBid(bidId, updateBidAmount, originalBidAmount, user._id));
      setUpdateBid(false);
      setUpdateBidAmount();
      setBidId('');
      notification['success']({
        message: 'You have successfully updated your bid!',
        description: `You have bid ${new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(updateBidAmount)} for ${Product.title}.`,
        duration: 5,
      });
    }

    const payload = {
      user: user._id,
      isPaypal: true,
      paypalEmail: data.email,
      payerID: data.payerID,
      paymentID: data.paymentID,
      paymentToken: data.paymentToken,
      paid: data.paid,
      type: updateBid ? 'NEW_AUCTION_BIDDING_UPDATE' : 'NEW_AUCTION_BIDDING',
      dbiliaBalanceUSD: user.money,
      amountPaidDbiliaUSD: user.money,
      amountPaidPaypalUSD: Total,
      total: user.money + parseFloat(Total),
      productId: Product._id,
      edition: 0,
    };

    await axios.post(`/api/users/payment`, payload);

    setContinue(false);
  };

  const transactionError = () => {
    alert('Transaction error');
    setContinue(false);
    setConfirm(false);
  };

  const transactionCanceled = () => {
    alert('Transaction canceled');
    setContinue(false);
    setConfirm(false);
  };

  const checkFunds = async () => {
    const total = +bidAmount + +bidAmount * serviceFee;
    const paypalFees =
      (+bidAmount - user.money) * paypalFee + paypalFixedFeeUSD;
    // BUYER HAS ENOUGH DBILIA MONEY TO BUY
    if (user.money >= total) {
      // PAYS WITH DBILIA MONEY
      dispatch(updateMoney(user._id, total.toFixed(2), false));

      // TRIGGER THIS ONLY WHEN PLACING A BID NOT UPDATING
      if (!updateBid) {
        // KICKED OUT BIDDER GETS REFUNDED (ONLY BIDDING AMOUNT)

        dispatch(placeInitialProductBid(Product._id, +bidAmount)).then(() => {
          dispatch(resetBid());
        });
        notification['success']({
          message: 'Successfully bid!',
          description: `You have bid ${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(bidAmount)} for ${Product.title}.`,
          duration: 5,
        });
      } else {
        dispatch(
          editBid(bidId, updateBidAmount, originalBidAmount, user._id)
        ).then(() => {
          dispatch(resetEditBid());
        });
        console.log('updateBid');
        setUpdateBid(false);
        setUpdateBidAmount();
        setBidId('');
        notification['success']({
          message: 'You have successfully updated your bid!',
          description: `You have bid ${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(updateBidAmount)} for ${Product.title}.`,
          duration: 5,
        });
      }
      const payload = {
        user: user._id,
        isPaypal: false,
        paypalEmail: '',
        payerID: '',
        paymentID: '',
        paymentToken: '',
        paid: true,
        type: updateBid ? 'NEW_AUCTION_BIDDING_UPDATE' : 'NEW_AUCTION_BIDDING',
        dbiliaBalanceUSD: user.money,
        amountPaidDbiliaUSD: total,
        amountPaidPaypalUSD: 0,
        total: total,
        productId: Product._id,
        edition: 0,
      };

      await axios.post(`/api/users/payment`, payload);
    } else {
      console.log('updatebid');
      // USER DOESN'T HAVE ENOUGH BALANCE, NEED TO PAY WITH PAYPAL
      setContinue(true);
      // IF USER DOESN'T HAVE MONEY AT ALL, THEN PAY THE FULL bidAmount WITH PAYPAL
      // IF USER HAS SOME MONEY, BUT SHORT OF MONEY THEN PAY THE REMAINING WIH PAYPAL
      if (user.money >= +total) {
        //setTotal((bidAmount + bidAmount * serviceFee).toFixed(2));
      } else {
        if (user.money <= 0) {
          setTotal(
            new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(total + paypalFees)
          );
        } else {
          setTotal(
            new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(total + paypalFees - user.money)
          );
        }
      }
    }
  };

  return (
    <div className={bidOpen ? 'bid-popup bid-popup--visible' : 'bid-popup'}>
      <div className='bid-popup__window'>
        <h2 className='bid-popup__title'>Place or Edit Bid</h2>
        {width > 900 && (
          <div className='bid-popup__image'>
            {Product.images && Product.images[0].split('/')[4] == 'video' ? (
              <video
                autoPlay
                loop
                muted
                height='auto'
                width='100%'
                className='bid-popup__image-item'
              >
                <source src={Product.images} type='video/mp4' />
                <source src={Product.images} type='video/ogg' />
                <source src={Product.images} type='video/webm' />
              </video>
            ) : (
              <img
                className='bid-popup__image-item'
                alt='image1'
                src={Product.images}
              />
            )}
          </div>
        )}
        <>
          <button
            className='bid-popup__close'
            onClick={() => dispatch(setBidOpen(false))}
          >
            &times;
          </button>
          {/* {Product.auctionHistory && Product.auctionHistory.length > 0 && ( */}
          <>
            <h3 className='bid-popup__history-title'>Bidding History</h3>
            {Product.auctionHistory && Product.auctionHistory.length === 0 ? (
              <div className='bid-popup__first-bid'>
                <p>Be the first to place a bid!</p>
              </div>
            ) : (
              <div className='bid-popup__table-section'>
                <table className='bid-popup__table'>
                  <thead>
                    <th>Edition</th>
                    <th>User</th>
                    <th>Bid</th>
                    <th>Time</th>
                    <th>Edit</th>
                  </thead>
                  <tbody>
                    {Product.auctionHistory &&
                      Product.auctionHistory
                        .map((item, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item.username}</td>
                            <td>
                              {bidId === item.bidId ? (
                                <input
                                  className='bid-popup__bid-input bid-popup__bid-input--1'
                                  value={
                                    updateBidAmount == '0'
                                      ? ''
                                      : updateBidAmount
                                  }
                                  type='number'
                                  min={highestBid * 1.05}
                                  onChange={onBidUpdate}
                                  onBlur={onBidUpdateBlur}
                                />
                              ) : (
                                new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                }).format(item.bid)
                              )}
                            </td>
                            <td>{moment(item.bidTime).format('YYYY-MM-DD')}</td>
                            <td>
                              {item.userId == user._id && (
                                <>
                                  {bidId === item.bidId ? (
                                    <button
                                      className={
                                        updateBidAmount < highestBid * 1.05
                                          ? ' bid-popup__add-button--1 bid-popup__add-button--2'
                                          : 'bid-popup__add-button bid-popup__add-button--1 '
                                      }
                                      style={{
                                        cursor:
                                          updateBidAmount < highestBid * 1.05 &&
                                          'auto',
                                      }}
                                      disabled={
                                        updateBidAmount < highestBid * 1.05
                                      }
                                      onClick={() => {
                                        calculateUpdatedBidPayment(
                                          item.bid,
                                          item.bidId
                                        );
                                        setContinue(false);
                                        setUpdateBid(true);
                                        setConfirm(true);
                                      }}
                                    >
                                      Update Bid
                                    </button>
                                  ) : (
                                    <button
                                      className={' bid-popup__add-button--2'}
                                      style={{}}
                                      onClick={() => {
                                        // always round up
                                        setUpdateBidAmount(
                                          Math.ceil(
                                            item.bid * 1.05 * Math.pow(10, 2)
                                          ) / Math.pow(10, 2)
                                        );
                                        setBidId(item.bidId);
                                        setUpdateBid(true);
                                      }}
                                    >
                                      Edit Bid
                                    </button>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                        .sort(function (a, b) {
                          return b.bid - a.bid;
                        })}
                  </tbody>
                </table>
                <p style={{ marginTop: '1rem' }}>
                  Updated Bid must be 5% higher than highest bid
                </p>
                <p style={{ marginTop: '1rem' }}>
                  Time remaining:{' '}
                  {moment(Product.auctionDeadline) > moment(Date.now()) && (
                    <Countdown
                      className='product__countdown'
                      date={moment(Product.auctionDeadline)}
                      key={moment(Product.auctionDeadline)}
                      renderer={renderer}
                    />
                  )}
                </p>
              </div>
            )}
          </>
          {/* )} */}

          <div className='bid-popup__enter-bid'>
            <p className='bid-popup__disclaimer'>
              Bid must be 5% higher than highest bid
            </p>
            <h3>Bid Entry (USD):</h3>
            <input
              className='bid-popup__bid-input'
              value={bidAmount == '0' ? '' : bidAmount}
              type='number'
              onChange={onBidChange}
              onBlur={onBidBlur}
              min={highestBid * 1.05}
            />
            <button
              className={
                bidAmount < highestBid * 1.05
                  ? 'bid-popup__add-button bid-popup__add-button--disabled'
                  : 'bid-popup__add-button'
              }
              style={{ cursor: bidAmount < highestBid * 1.05 && 'auto' }}
              disabled={bidAmount < highestBid * 1.05}
              onClick={() => {
                setContinue(false);
                user._id && setUpdateBid(false);
                user._id ? setConfirm(true) : this.history.push('/login');
              }}
            >
              Place a New Bid
            </button>
          </div>
        </>
      </div>

      <div
        className={
          confirm ? 'confirm-popup confirm-popup--visible' : 'confirm-popup'
        }
      >
        <div className='confirm-popup__window'>
          <>
            <button
              className='confirm-popup__close'
              onClick={() => setConfirm(false)}
            >
              &times;
            </button>
            <p className='confirm-popup__text'>
              Are you sure you'd like to{' '}
              {updateBid ? 'update your bid' : 'place a bid'} for{' '}
              <strong>{Product.title}</strong>?
              <NFTFeeBid
                update={updateBid}
                price={updateBid ? updateDif : bidAmount}
                paypalFee={paypalFee}
                serviceFee={serviceFee}
                money={user.money}
                paypalFixedFeeUSD={paypalFixedFeeUSD}
              />
            </p>

            {user.money >=
            Number(bidAmount) + Number(bidAmount) * serviceFee ? (
              <button
                className='confirm-popup__add-button'
                onClick={() => {
                  checkFunds();
                  setConfirm(false);
                  dispatch(setBidOpen(false));
                }}
              >
                Confirm Payment
              </button>
            ) : (
              <button
                className='confirm-popup__add-button'
                onClick={() => {
                  checkFunds();
                }}
              >
                Continue
              </button>
            )}

            {Continue && (
              <div className='confirm-popup__add-button'>
                <Paypal
                  toPay={Total}
                  onSuccess={transactionSuccess}
                  transactionError={transactionError}
                  transactionCanceled={transactionCanceled}
                />
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}

export default BidPopup;
