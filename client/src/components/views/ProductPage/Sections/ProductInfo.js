import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateSold, updateMoney } from '../../../../_actions/user_actions';
import { addPayment } from '../../../../_actions/payment_actions';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';
import {
  changeDeadlineDate,
  setAddToCollection,
} from '../../../../_actions/product_actions';
import { setEditionsOpen } from '../../../../_actions/in_view_actions';
import Paypal from '../../../utils/Paypal';
import axios from 'axios';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Countdown from 'react-countdown';
import sprite from '../../../../img/sprite.svg';
import { resetCollection } from '../../../../_actions/_infinite_actions';

function ProductInfo(props) {
  const [originalPurchasesTotal, setOriginalPurchasesTotal] = useState('hello');
  const [Product, setProduct] = useState({});
  const [Money, setMoney] = useState(0);

  const [productId, setProductId] = useState(Product._id);
  const [ownedEditions, setOwnedEditions] = useState(0);
  const dispatch = useDispatch();
  const [edition, setEdition] = useState();
  const { cart, _id, money } = useSelector((state) => state.user.userData);
  const [editionToPurchase, setEditionToPurchase] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [Total, setTotal] = useState(0);
  const [Continue, setContinue] = useState(false);
  const serviceFee = 0.025;
  const paypalFee = 0.029;
  const paypalFixedFeeUSD = 0.3;
  const [date, setDate] = useState(false);
  const singleItem = useSelector((state) => state.product.singleItem);

  const renderer = ({ days, hours, minutes, seconds }) => {
    return days !== '0' ? (
      <span>
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    ) : days === '0' && hours !== 0 ? (
      <span>
        {hours}h {minutes}m {seconds}s
      </span>
    ) : days === '0' && hours === '0' && minutes !== 0 ? (
      <span>
        {minutes}m {seconds}s
      </span>
    ) : days === '0' && hours === '0' && minutes === '0' ? (
      <span style={{ color: 'red' }}>{seconds}s</span>
    ) : (
      <span></span>
    );
  };
  useEffect(() => {
    // GETS PRODUCT INFORMATION UPON PAGE LOAD
    setProduct(props.detail);
    setProductId(props.detail._id);
    setEdition(window.location.pathname.split('/')[3] - 1);

    if (cart && props.detail) {
      const cartObject = cart.filter((item) => props.detail._id === item.id);
      if (cartObject && cartObject.length > 0) {
        const item = cartObject[0].ownedEditions;
        // SETTING ALL CARD EDITIONS USERS OWNS
        setOwnedEditions(item.length);
      }
    }
  }, [cart, props.detail]);

  const addToCartHandler = () => {
    props.addToCart(props.detail._id);
  };
  // getting updated product after date change
  useEffect(() => {
    if (date !== false) {
      setProduct(singleItem);
    }
  }, [date, singleItem]);
  // CHECKS HOW MUCH MONEY THE USER HAS
  useEffect(() => {
    axios.get('/api/users/getCoins').then((response) => {
      if (response.data.success) {
        setMoney(response.data.money);
      } else {
        // alert('Failed to get Coins');
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (Product.editions) {
      setOriginalPurchasesTotal(
        Product.editions.filter((edition) => {
          if (edition.history.length > 0 && edition.history[0].owner === _id) {
            return edition;
          }
          return false;
        }).length
      );
    }
  }, [Product]);

  const editionsOpen = useSelector((state) => state.view.editions);

  const transactionSuccess = async (data) => {
    const price = Number(Product.price);
    // WHEN OWNER BUYING HIS OWN, CREATORWALLET IS SKIPPED
    if (props.detail.writer._id !== _id) {
      // CREATOR GETS MONEY MINUS SELLING FEE
      const creatorReceives = price - price * serviceFee;
      dispatch(updateMoney(props.userId, creatorReceives, true));
    }
    // BUYER HAD SHORT OF MONEY
    if (Total !== price) {
      // DEDUCT money FROM EXISTING BALANCE
      dispatch(updateMoney(_id, money, false));
    }

    notification['success']({
      message: 'Successfully paid!',
      description: `Congrats, you now own Edition ${Product.sold + 1} of ${
        Product.title
      }.`,
      duration: 5,
    });

    // DIDNT UPDATE TEH SOLD
    dispatch(updateSold(Product._id, Product.sold));
    // DOESNT ACTUALLY WORK
    addToCartHandler();
    // updateSoldAmount();
    dispatch(setAddToCollection());

    const payload = {
      user: _id,
      isPaypal: true,
      paypalEmail: data.email,
      payerID: data.payerID,
      paymentID: data.paymentID,
      paymentToken: data.paymentToken,
      paid: data.paid,
      type: 'NEW_NONAUCTION',
      dbiliaBalanceUSD: money,
      amountPaidDbiliaUSD: money,
      amountPaidPaypalUSD: Total,
      total: money + parseFloat(Total),
      productId: productId,
      edition: Product.sold + 1,
    };

    dispatch(addPayment(payload));
    setContinue(false);
    props.history.push(`/collection/${_id}`);
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

  const updateDate = async () => {
    dispatch(changeDeadlineDate(Product._id, date));
    // GETS INDIVIDUAL PRODUCT

    notification['success']({
      message: 'Successfully updated Date!',
      description: `Sale of ${Product.title} will now end on ${moment(
        date
      ).format('LLLL')}`,
      duration: 5,
    });
    setDate(false);
  };
  // CHECKING IF CARD IS SOLD OUT
  // IF NOT INCREASES SOLD BY 1
  const checkFunds = async () => {
    const price = Number(Product.price);
    const total = price + price * serviceFee;
    const paypalFees = (price - money) * paypalFee + paypalFixedFeeUSD;
    // GETS INDIVIDUAL PRODUCT
    const { data } = await axios.get(
      `/api/product/products_by_id?id=${productId}&type=single`
    );
    if (data[0]) {
      setProduct(data[0]);
      // NOTIFIES USER IF CARD IS ALL SOLD OUT
      if (data[0].sold >= data[0].numberEditions) {
        notification['error']({
          message: 'Sorry, card just sold out.',
        });
        return;
      }
    }
    if (money >= total) {
      // WHEN OWNER BUYING HIS OWN, CREATORWALLET IS SKIPPED
      if (props.detail.writer._id !== _id) {
        // CREATOR GETS MONEY MINUS SELLING FEE
        const creatorReceives = price - price * serviceFee;
        dispatch(updateMoney(props.userId, creatorReceives, true));
      }
      // BUYER PAYS WITH DBILIA MONEY
      dispatch(updateMoney(_id, total, false));

      const payload = {
        user: _id,
        isPaypal: false,
        paypalEmail: '',
        payerID: '',
        paymentID: '',
        paymentToken: '',
        paid: true,
        type: 'NEW_NONAUCTION',
        dbiliaBalanceUSD: money,
        amountPaidDbiliaUSD: total,
        amountPaidPaypalUSD: 0,
        total: total,
        productId: productId,
        edition: Product.sold + 1,
      };

      dispatch(addPayment(payload));

      // DIDNT UPDATE TEH SOLD
      dispatch(updateSold(Product._id, Product.sold));
      // DOESNT ACTUALLY WORK
      addToCartHandler();
      // updateSoldAmount();
      dispatch(setAddToCollection());
      notification['success']({
        message: 'Successfully paid!',
        description: `Congrats, you now own Edition ${Product.sold + 1} of ${
          Product.title
        }.`,
        duration: 5,
      });

      props.history.push(`/collection/${_id}`);

      // addToCarthandler();
    } else {
      // USER DOESN'T HAVE ENOUGH BALANCE, NEED TO PAY WITH PAYPAL
      setContinue(true);
      // IF USER DOESN'T HAVE MONEY AT ALL, THEN PAY THE FULL CARD PRICE WITH PAYPAL
      // IF USER HAS SOME MONEY, BUT SHORT OF MONEY THEN PAY THE REMAINING WIH PAYPAL
      if (money >= total) {
        //setTotal((price + price * serviceFee));
      } else {
        if (money <= 0) {
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
            }).format(total + paypalFees - money)
          );
        }
      }
    }
  };

  return (
    <>
      <div className='product__details'>
        <h2 className='product__title'>{Product.title}</h2>
        <div className='product__creator-owner'>
          <a className='product__username' href={`/shop/${props.userId}`}>
            Creator: {props.writer}
          </a>
        </div>

        {Product.packId !== 'no-pack' && Product.packId && (
          <h3 className='product__pack-name'>Pack: {Product.packId.title}</h3>
        )}
        <div className='product__countdown-and-editions'>
          <p
            className={'product__editions'}
            onClick={() => dispatch(setEditionsOpen(true))}
          >
            {Product.numberEditions === Product.sold
              ? 'Find Other Editions'
              : `Edition ${Product.sold + 1} of ${
                  Product.numberEditions === 10000000000
                    ? 'Unlimited'
                    : Product.numberEditions
                }`}
          </p>

          {Product.saleDeadline &&
            moment(Product.saleDeadline) > moment(Date.now()) && (
              <Countdown
                renderer={renderer}
                date={moment(Product.saleDeadline)}
              />
            )}
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
                  onClick={() => {
                    dispatch(setEditionsOpen(false));
                  }}
                >
                  &times;
                </button>

                <h3 className='editions-popup__history-title'>Sold Editions</h3>

                <div className='editions-popup__table-section'>
                  {Product.sold === 0 ? (
                    <p style={{ margin: '1rem auto' }}>No Editions sold yet!</p>
                  ) : (
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
                              item.history.length !== 0 && (
                                <tr
                                  className='editions-popup__row'
                                  onClick={() => {
                                    dispatch(setEditionsOpen(false));
                                    props.history.push(
                                      `/product/${Product._id}/${item.edition}`
                                    );
                                  }}
                                >
                                  <td>{item.edition}</td>
                                  <td>
                                    {
                                      item.history[item.history.length - 1]
                                        .username
                                    }
                                  </td>

                                  <td>
                                    <p
                                      onClick={() =>
                                        setEditionToPurchase(item.edition)
                                      }
                                    >
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
                  )}
                  {Product.sold === Product.numberEditions ||
                  Product.purchaseLimitAmount ? (
                    Product.purchaseLimitAmount === originalPurchasesTotal && (
                      <button></button>
                    )
                  ) : (
                    <button
                      className={'editions-popup__add-button'}
                      onClick={() => dispatch(setEditionsOpen(false))}
                    >
                      Buy Next Edition
                    </button>
                  )}
                </div>
              </>
            </div>
          </div>
        </div>
        <h3 className='product__price'>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(Number(Product.price))}{' '}
          USD
        </h3>
        {Product.sold >= Product.numberEditions ? (
          <button
            className='product__add-button '
            onClick={() => dispatch(setEditionsOpen(true))}
          >
            View Editions
          </button>
        ) : Product.purchaseLimitAmount &&
          Product.purchaseLimitAmount === originalPurchasesTotal ? (
          <>
            <p style={{ marginTop: '5rem' }}>
              You have you reached your limit for original purchases. Please
              check the marketplace for other editions
            </p>
            <button
              className='product__add-button'
              onClick={() => dispatch(setEditionsOpen(true))}
            >
              View Editions
            </button>
          </>
        ) : (
          <button
            className='product__add-button'
            onClick={() => {
              setContinue(false);
              _id ? setConfirm(true) : props.history.push('/login');
            }}
          >
            Buy
          </button>
        )}
        <div className='product__date-picker'>
          {Product.writer &&
            Product.writer._id === _id &&
            moment(Product.saleDeadline) > moment(Date.now()) && (
              <>
                <DateTimePicker
                  value={date}
                  min={new Date(Date.now())}
                  onChange={setDate}
                  max={new Date(moment().add(100, 'days').format('YYYY-MM-DD'))}
                />
                <button
                  onClick={updateDate}
                  disabled={date === false && true}
                  className={
                    !date
                      ? 'product__date-button product__date-button--disabled '
                      : 'product__date-button'
                  }
                >
                  Set new end date
                </button>
              </>
            )}
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
                Confirm the purchase of edition #
                <strong>{Product.sold + 1}</strong> of NFT {Product.title}{' '}
                created by {props.writer}
                {money >=
                Number(Product.price) + Number(Product.price) * serviceFee ? (
                  <p
                    className='confirm-popup__text'
                    style={{ textAlign: 'right', marginRight: '30px' }}
                  >
                    NFT Price:{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(Number(Product.price))}
                    <br />
                    Service Fee:{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(Number(Product.price) * serviceFee)}
                    <br />
                    Total:{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(
                      Number(Product.price) + Number(Product.price) * serviceFee
                    )}
                    <br />
                    <br />
                    <hr />
                    <br />
                    Your Dbilia USD Balance:{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(money)}
                    <br />
                    Balance After Purchase:{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(
                      Math.abs(
                        money -
                          (Number(Product.price) +
                            Number(Product.price) * serviceFee)
                      )
                    )}
                  </p>
                ) : (
                  <p
                    className='confirm-popup__text'
                    style={{ textAlign: 'right', marginRight: '30px' }}
                  >
                    NFT Price:{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(Number(Product.price))}
                    <br />
                    Service Fee:{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(Number(Product.price) * serviceFee)}
                    <br />
                    Paypal Fee:{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(
                      (Number(Product.price) - money) * paypalFee +
                        paypalFixedFeeUSD
                    )}
                    <br />
                    Total:{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(
                      Number(Product.price) +
                        Number(Product.price) * serviceFee +
                        (Number(Product.price) - money) * paypalFee +
                        paypalFixedFeeUSD
                    )}
                    <br />
                    <br />
                    <hr />
                    <br />
                    Your Dbilia USD Balance:{' '}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(money)}
                    <br />
                    Balance After Purchase: $0.00
                    <br />
                    <span style={{ color: 'red' }}>
                      Please pay{' '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(
                        Number(Product.price) +
                          Number(Product.price) * serviceFee +
                          ((Number(Product.price) - money) * paypalFee +
                            paypalFixedFeeUSD) -
                          money
                      )}{' '}
                      more to purchase.
                    </span>
                  </p>
                )}
              </p>

              {money >=
              Number(Product.price) + Number(Product.price) * serviceFee ? (
                <button
                  className='confirm-popup__add-button'
                  onClick={() => {
                    checkFunds();
                    setConfirm(false);
                  }}
                >
                  Confirm Payment
                </button>
              ) : (
                <button
                  className='confirm-popup__add-button'
                  onClick={() => {
                    checkFunds();
                    //setConfirm(false);
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
    </>
  );
}

export default ProductInfo;
