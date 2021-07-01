import React, { useState, useEffect } from 'react';
import { notification, Modal, Button } from 'antd';
import './DbiliaCards.css';
import { useSelector, useDispatch } from 'react-redux';
import { setProfileSection, updateMoney } from '../../_actions/user_actions';
import { updateMinted } from '../../_actions/product_actions';
import { addPayment, getUserPayments } from '../../_actions/payment_actions';
import axios from 'axios';
import { EMPTY_ETHER_ADDRESS } from '../../helpers';
import { LoadingOutlined } from '@ant-design/icons';
import Paypal from '../utils/Paypal';
import sprite from '../../img/sprite.svg';
import { setMintInfo } from '../../_actions/in_view_actions';
import useWindowDimensions from '../views/NavBar/Sections/ScreenWidth';
import {
  mintWithETH,
  subscribeToEvents,
  isProductEditionMinted,
} from '../../_actions/dbiliaToken_actions';

function Mint({ productId, editionId, currentEdition, guideStep, Product }) {
  const dispatch = useDispatch();
  const [Total, setTotal] = useState(50);
  const [Minting, setMinting] = useState(false);
  const [Disabled, setDisabled] = useState(false);
  const [Loading, setLoading] = useState(false);

  const [PaymentSuccess, setPaymentSuccess] = useState(false);
  const [Payload, setPayload] = useState({});
  const [Fee, setFee] = useState({});
  const [enoughBalance, setEnoughBalance] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isW3userModalVisible, setIsW3userModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  const { token, username, _id, money, introCardGuide } = useSelector(
    (state) => state.user.userData
  );
  const mintInfo = useSelector((state) => state.view.mintInfo);
  const paymentList = useSelector((state) => state.payments.paymentList);
  const singleItem = useSelector((state) => state.product.singleItem);

  const { gasPrice, account, dbiliaToken } = useSelector((state) => state.web3);
  const { mintWithEth, productEditionMinted } = useSelector((state) => state.dbiliaToken);

  const serviceFee = 0.025;
  const paypalFee = 0.029;
  const paypalFixedFeeUSD = 0.3;
  const local = true;

  useEffect(() => {
    dispatch(getUserPayments());
    dispatch(isProductEditionMinted(productId, currentEdition));
    if (account) {
      dispatch(subscribeToEvents(dbiliaToken, account));
    }
  }, []);

  // AFTER W3USER TRIGGERED MINTING
  useEffect(() => {
    if (mintWithEth.loading) {
      setMinting(true);
      setDisabled(true);
    } else {
      if (mintWithEth.data) {
        if (
          mintWithEth.data._productId === productId &&
          +mintWithEth.data._edition === currentEdition
        ) {
          // const verify = `https://kovan.etherscan.io/tx/${mintWithEth.transactionHash}`;
          // notification['success']({
          //   message: 'NFT Minted Successfully!',
          //   description: (
          //     <div>
          //       Edition #{currentEdition} of {singleItem.title} has been minted
          //       in blockchain!{' '}
          //       <a href={verify} target='_blank'>
          //         Verify on Etherscan
          //       </a>
          //     </div>
          //   ),
          //   duration: 0,
          // });
          setMinting(false);
          // update edition minted to true
          dispatch(updateMinted(editionId, productId, mintWithEth.data._tokenId));
          window.location.reload();
        }
      }
    }
  }, [mintWithEth.loading]);

  useEffect(() => {
    // w2user
    if (!account) {
      setPayload({
        royaltyReceiverId: singleItem.writer._id,
        royaltyPercentage: singleItem.royalties,
        minterId: _id,
        productId: productId,
        edition: currentEdition,
        media: singleItem.images[0],
        title: singleItem.title,
        description: singleItem.description,
        category: !singleItem.category ? 'All' : singleItem.category,
        layout: singleItem.layout,
        numberEditions: singleItem.numberEditions,
        minter: username,
        creator: singleItem.writer.username,
      });
    } else {
      setPayload({
        royaltyReceiverId: singleItem.writer._id,
        royaltyPercentage: singleItem.royalties,
        minterAddress: account,
        productId: productId,
        edition: currentEdition,
        media: singleItem.images[0],
        title: singleItem.title,
        description: singleItem.description,
        category: !singleItem.category ? 'All' : singleItem.category,
        layout: singleItem.layout,
        numberEditions: singleItem.numberEditions,
        minter: username,
        creator: singleItem.writer.username,
      });
    }
  }, [singleItem]);

  const checkPayloadFieldEmpty = () => {
    let isEmpty = false;
    Object.keys(Payload).forEach((key) => {
      //console.log("Key: " + key + " " + "Value: " + Payload[key]);
      if (!Payload[key]) {
        isEmpty = true;
      }
    });
    return isEmpty;
  };

  const transactionSuccess = async (data) => {
    //console.log(data);
    setLoading(true);

    const payload = {
      user: _id,
      isPaypal: true,
      paypalEmail: data.email,
      payerID: data.payerID,
      paymentID: data.paymentID,
      paymentToken: data.paymentToken,
      paid: data.paid,
      type: 'MINT',
      dbiliaBalanceUSD: money,
      amountPaidDbiliaUSD: money,
      amountPaidPaypalUSD: Total,
      total: money + parseFloat(Total),
      productId: productId,
      edition: currentEdition,
    };

    dispatch(addPayment(payload));
    dispatch(updateMoney(_id, money, false));
    setPaymentSuccess(true);

    notification['warning']({
      message: 'Please wait...',
      description: 'Please stay on the page until transaction is completed.',
      duration: 10,
    });

    mintWithUSD();

    setLoading(false);
    setIsModalVisible(false);
  };

  const transactionError = () => {
    alert('Transaction error');
  };

  const transactionCanceled = () => {
    alert('Transaction canceled');
  };

  const onPay = async () => {
    if (enoughBalance) {
      setLoading(true);

      const payload = {
        user: _id,
        isPaypal: false,
        paypalEmail: '',
        payerID: '',
        paymentID: '',
        paymentToken: '',
        paid: true,
        type: 'MINT',
        dbiliaBalanceUSD: money,
        amountPaidDbiliaUSD: Total,
        amountPaidPaypalUSD: 0,
        total: Total,
        productId: productId,
        edition: currentEdition,
      };

      dispatch(addPayment(payload));
      dispatch(updateMoney(_id, Total, false));
      setPaymentSuccess(true);

      notification['warning']({
        message: 'Please wait...',
        description: 'Please stay on the page until transaction is completed.',
        duration: 10,
      });

      mintWithUSD();

      setLoading(false);
      setIsModalVisible(false);
    } else {
      showErrorMsg('Sorry, balance is not enough.');
    }
  };

  const onCancel = () => {
    setMinting(false);
    setDisabled(false);
    setIsModalVisible(false);
  };

  const onCancelW3user = () => {
    setIsW3userModalVisible(false);
  };

  const payInUSDw3user = () => {
    setIsW3userModalVisible(false);
    if (!account) {
      showErrorMsg(
        'Your account is not connected. Please connect and try again.'
      );
      return;
    }

    onClickMintUSD();
  };

  const payInETHw3user = () => {
    setIsW3userModalVisible(false);
    if (!account) {
      showErrorMsg(
        'Your account is not connected. Please connect and try again.'
      );
      return;
    }
    if (!dbiliaToken) {
      showErrorMsg(
        'Sorry, smart contract is not loaded. Please refresh the page and try again.'
      );
      return;
    }   
    // create tokenURI via IPFS
    // ...
    // trigger smart contract directly from frontend
    dispatch(mintWithETH(dbiliaToken, account, Payload));
  };

  function showDialog() {
    setIsModalVisible(true);
  }

  const showErrorMsg = async (msg) => {
    notification['error']({
      message: msg,
    });
  };

  const getEstimatedGasFee = async () => {
    const options = {
      headers: {
        Authorization: 'Bearer '.concat(token),
      },
    };

    try {
      const { data } = await axios.post(
        local
          ? `http://localhost:4000/api/web3/tx-fee/${
              !account ? 'w2user' : 'w3user'
            }/${gasPrice}`
          : `https://dbiliablockchainbackend.herokuapp.com/api/web3/tx-fee/${
              !account ? 'w2user' : 'w3user'
            }/${gasPrice}`,
        Payload,
        options
      );
      return +data.fee;
    } catch (error) {
      showErrorMsg(
        `Sorry, couldn't get the gas fee. Please refresh the page and try again.`
      );
      return;
    }
  };

  const mintWithUSD = () => {   
    const options = {
      headers: {
        Authorization: 'Bearer '.concat(token),
      },
    };

    axios
      .post(
        local
          ? `http://localhost:4000/api/web3/${
              !account ? 'mint-w2user' : 'mint-w3user'
            }`
          : `https://dbiliablockchainbackend.herokuapp.com/api/web3/${
              !account ? 'mint-w2user' : 'mint-w3user'
            }`,
        Payload,
        options
      )
      .then((response) => {
        if (response.data.transactionHash) {
          // const verify = `https://kovan.etherscan.io/tx/${response.data.transactionHash}`;
          // notification['success']({
          //   message: 'NFT Minted Successfully!',
          //   description: (
          //     <div>
          //       Edition #{currentEdition} of {singleItem.title} has been minted
          //       in blockchain!{' '}
          //       <a href={verify} target='_blank'>
          //         Verify on Etherscan
          //       </a>
          //     </div>
          //   ),
          //   duration: 0,
          // });
          setMinting(false);
          // update edition minted to true
          dispatch(updateMinted(editionId, productId, response.data.tokenId));
          window.location.reload();
        }
      })
      .catch((e) => {
        //console.log(e.response.data);
        if (e.response && e.response.data) {
          if (e.response.data.message === 'product edition duplicate') {
            showErrorMsg(
              `Sorry, edition #${currentEdition} has already been minted!`
            );
          } else {
            showErrorMsg(e.response.data.message);
          }
        }
        setMinting(false);
      });
  };

  const checkUserPaid = () => {
    let hasPaid = false;
    paymentList.forEach((p) => {
      if (
        p.productId === productId &&
        p.edition === currentEdition &&
        p.type === 'MINT'
      ) {
        hasPaid = true;
      }
    });
    return hasPaid;
  };

  const onClickMintETH = async () => {
    setIsW3userModalVisible(true);
  };

  const onClickMintUSD = async () => {
    const isFieldEmpty = checkPayloadFieldEmpty();
    if (isFieldEmpty) {
      showErrorMsg(
        'Sorry, some information is missing to mint this card. Please contact us.'
      );
      return;
    }
    // if user has already paid for gas fee, but was not minted due to minting failure
    // then we let user skip payment and proceed to minting
    const hasPaid = checkUserPaid();

    if (productEditionMinted) {
      showErrorMsg('Sorry, this is already minted.');
      return;
    }

    setMinting(true);
    setDisabled(true);

    if (hasPaid && !productEditionMinted) {
      mintWithUSD();
    } else {
      // check product edition has already been minted
      if (!productEditionMinted && !singleItem.editions[currentEdition - 1].minted) {
        if (gasPrice > 0) {
          const fee = await getEstimatedGasFee();
          if (fee > 0) {
            const total = fee + fee * serviceFee;
            const paypalFees = fee * paypalFee + paypalFixedFeeUSD;
            setFee(fee);
            if (money >= total) {
              setTotal(total);
              setEnoughBalance(true);
            } else {
              if (money >= total) {
                //setTotal((price + price * serviceFee).toFixed(2));
              } else {
                if (money <= 0) {
                  setTotal((total + paypalFees).toFixed(2));
                } else {
                  setTotal((total + paypalFees - money).toFixed(2));
                }
                setEnoughBalance(false);
              }
            }
            showDialog();
          }
        } else {
          showErrorMsg(
            `Sorry, couldn't get the gas price. Please refresh the page and try again.`
          );
        }
      } else {
        showErrorMsg(
          `Sorry, edition #${currentEdition} has already been minted!`
        );
      }
    }
  };

  return (
    <>
      <button
        className='product__add-button product__add-button--mint'
        style={{ marginBottom: introCardGuide && Product.introCard && '1rem' }}
        onClick={!account ? onClickMintUSD : onClickMintETH}
        disabled={Disabled}
      >
        {Minting ? (
          <div>
            <LoadingOutlined
              style={{ fontSize: 15, marginRight: '10px' }}
              spin
            />
          </div>
        ) : (
          <span>Mint</span>
        )}
      </button>

      <svg
        className='product__mint-info-icon'
        style={{
          zIndex: guideStep === 5 && 2001,
        }}
        onClick={() => dispatch(setMintInfo(true))}
      >
        <use href={sprite + '#question'}></use>
      </svg>
      {introCardGuide && singleItem.introCard && guideStep === 5 && (
        <svg
          style={{
            zIndex: guideStep === 5 && 2001,
            marginBottom: introCardGuide && singleItem.introCard && '1rem',
          }}
          className={
            width > 1200
              ? 'tour__arrow tour__arrow--mint'
              : 'tour__arrow tour__arrow--mint tour__arrow--mint--mobile'
          }
        >
          <use href={sprite + '#arrow-up'}></use>
        </svg>
      )}
      {/* MINT INFO POPUP */}
      <div
        className={mintInfo ? 'info-popup info-popup--visible' : 'info-popup'}
      >
        <div className='info-popup__window'>
          <h2
            className='info-popup__text'
            style={{ gridColumn: introCardGuide && '1/4' }}
          >
            Minting an NFT is how your digital art becomes a part of the
            Ethereum blockchain–a public ledger that is unchangeable and
            tamper-proof. Similar to the way that metal coins are minted and
            added into circulation, NFTs are also tokens that get “minted” once
            they are created.
          </h2>
          <button
            className='info-popup__close'
            style={{ marginRight: introCardGuide && 0 }}
            onClick={() => dispatch(setMintInfo(false))}
          >
            &times;
          </button>
          {introCardGuide && Product.introCard && guideStep === 6 && (
            <svg
              className='tour__arrow tour__arrow--editions-close'
              style={{ marginRight: 0 }}
            >
              <use href={sprite + '#arrow'}></use>
            </svg>
          )}
        </div>
      </div>
      <Modal
        title='Mint your NFT onto Ethereum blockchain!'
        centered
        visible={isModalVisible}
        okText='Pay'
        onOk={onPay}
        onCancel={onCancel}
        footer={[
          <>
            {enoughBalance ? (
              ((
                <Button key='back' onClick={onCancel}>
                  Cancel
                </Button>
              ),
              (
                <Button
                  key='submit'
                  type='primary'
                  loading={Loading}
                  onClick={onPay}
                >
                  Confirm
                </Button>
              ))
            ) : (
              <Paypal
                toPay={Total}
                onSuccess={transactionSuccess}
                transactionError={transactionError}
                transactionCanceled={transactionCanceled}
              />
            )}
          </>,
        ]}
      >
        <p className='confirm-popup__text'>
          Are you sure you'd like to mint? It costs gas fee.
          {enoughBalance ? (
            <p
              className='confirm-popup__text'
              style={{ textAlign: 'right', marginRight: '30px' }}
            >
              Gas Fee:{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(Number(Fee).toFixed(2))}
              <br />
              Service Fee:{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format((Number(Fee) * serviceFee).toFixed(2))}
              <br />
              Total:{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format((Number(Fee) + Number(Fee) * serviceFee).toFixed(2))}
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
                  money - (Number(Fee) + Number(Fee) * serviceFee)
                ).toFixed(2)
              )}
            </p>
          ) : (
            <p
              className='confirm-popup__text'
              style={{ textAlign: 'right', marginRight: '30px' }}
            >
              Gas Fee:{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(Number(Fee).toFixed(2))}
              <br />
              Service Fee:{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format((Number(Fee) * serviceFee).toFixed(2))}
              <br />
              Paypal Fee:{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(
                (Number(Fee) * paypalFee + paypalFixedFeeUSD).toFixed(2)
              )}
              <br />
              Total:{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(
                (
                  Number(Fee) +
                  Number(Fee) * serviceFee +
                  Number(Fee) * paypalFee +
                  paypalFixedFeeUSD
                ).toFixed(2)
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
                  (
                    Number(Fee) +
                    Number(Fee) * serviceFee +
                    (Number(Fee) * paypalFee + paypalFixedFeeUSD) -
                    money
                  ).toFixed(2)
                )}{' '}
                more to mint.
              </span>
            </p>
          )}
        </p>
        <p className='confirm-popup__text'>
          {account && (
            <p>
              we are minting it to your connected wallet address:{' '}
              <b>{account}</b>
            </p>
          )}
        </p>
      </Modal>

      <Modal
        title='Please select your payment option'
        centered
        visible={isW3userModalVisible}
        onCancel={onCancelW3user}
        footer={[
          <>
            <Button onClick={payInUSDw3user}>Pay in USD</Button>
            <Button onClick={payInETHw3user}>Pay in ETH</Button>
          </>,
        ]}
      >
        <div>
          <p>You are currently connected to Ethereum wallet.</p>
          <p>You have an option to pay the gas fee in USD or ETH.</p>
        </div>
      </Modal>
    </>
  );
}

export default Mint;