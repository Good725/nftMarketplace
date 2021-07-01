import React, { useEffect, useState } from 'react';
import { notification, Modal, Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProfileUser,
  updateMoney,
  endCardTour,
  auth,
} from '../../../../_actions/user_actions';
import {
  setEditionsOpen,
  setConfirm,
  setOwnedEditionsOpen,
} from '../../../../_actions/in_view_actions';
import { addPayment, getUserPayments } from '../../../../_actions/payment_actions';
import {
  addToMarketplace,
  purchaseCardFromMarket,
  removeFromMarketplace,
  isApprovedStatus,
  setApprovedToken,
  getTokenPriceUSD,
  setForSaleWithETH,
  removeSetForSaleWithETH,
  purchaseWithETH,
} from '../../../../_actions/market_actions';
import Mint from '../../../../components/utils/Mint';
import Paypal from '../../../utils/Paypal';
import GasFee from '../../../utils/GasFee';
import NFTFee from '../../../utils/NFTFee';
import axios from 'axios';
import sprite from '../../../../img/sprite.svg';
import NavBar from '../../NavBar/NavBar';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';
import { getSingleProduct } from '../../../../_actions/product_actions';
import {
  getTokenOwnership,
  getOwnerOf,
  getDbiliaTrust,
} from '../../../../_actions/dbiliaToken_actions';
import { LoadingOutlined } from '@ant-design/icons';
import { Formik, Field } from 'formik';
import moment from 'moment';
import { DatePickerField } from '../../UploadProductPage/Sections/DatePickerField';
import * as Yup from 'yup';
import { resetCollection } from '../../../../_actions/_infinite_actions';

function ProductInfoOwn(props) {
  const dispatch = useDispatch();
  const Axios = require('axios');

  // STATE
  const trueFalse = [
    { label: 'True', value: 'true' },
    { label: 'False', value: 'false' },
  ];

  const [Allowed, setAllowed] = useState(false);
  const [Approving, setApproving] = useState(false);
  const [Disabled, setDisabled] = useState(false);
  const [ConfirmDisabled, setConfirmDisabled] = useState(false);
  const [ConfirmLoading, setConfirmLoading] = useState(false);
  const [Money, setMoney] = useState(0);
  const [ownedEditions, setOwnedEditions] = useState(0);
  const [Fee, setFee] = useState({});
  const [enoughBalance, setEnoughBalance] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isW3userModalVisible, setIsW3userModalVisible] = useState(false);
  const [edition, setEdition] = useState(0);
  const [ownerId, setOwnerId] = useState(0);
  const [tokenId, setTokenId] = useState(0);
  const [marketAmount, setMarketAmount] = useState();
  const [ownerUsername, setOwnerUsername] = useState(0);
  const [addToMarket, setAddToMarket] = useState('');
  const [minted, setMinted] = useState(false);
  const [Total, setTotal] = useState(0);
  const [Continue, setContinue] = useState(false);
  const [Variables, setVariables] = useState();
  const { width } = useWindowDimensions();
  const [removeSuccess, setRemoveSuccess] = useState(false);
  // SELECTOR
  const [addSuccess, setAddSuccess] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [PaymentSuccess, setPaymentSuccess] = useState(false);
  // SELECTOR
  const { gasPrice, account, dbiliaToken, marketplace, marketplaceAddress } =
    useSelector((state) => state.web3);
  const {
    isApproved,
    setApproved,
    setSaleWithETH,
    removeSetSaleWithETH,
    tokenPrice,
    purchasedWithETH
  } = useSelector((state) => state.market);
  const { token, _id, money, introCardGuide } = useSelector(
    (state) => state.user.userData
  );
  const profile = useSelector((state) => state.user.profileUser);
  const Product = useSelector((state) => state.product.singleItem);
  const confirm = useSelector((state) => state.view.confirm);
  const ownedEditionsPopup = useSelector((state) => state.view.ownedEditions);
  const editionsOpen = useSelector((state) => state.view.editions);
  const { tokenOwnership, ownerOf, dbiliaTrust } = useSelector(
    (state) => state.dbiliaToken
  );
  const paymentList = useSelector((state) => state.payments.paymentList);

  const serviceFee = 0.025;
  const paypalFee = 0.029;
  const paypalFixedFeeUSD = 0.3;
  const local = true;

  useEffect(() => {
    // GETS PRODUCT INFORMATION UPON PAGE LOAD
    dispatch(getSingleProduct(props.detail._id));
    setEdition(window.location.pathname.split('/')[3] - 1);
  }, [dispatch, props.detail._id, confirm]);

  useEffect(() => {
    if (Product.editions && props.collection) {
      setOwnerId(
        Product.editions[edition].history[
          Product.editions[edition].history.length - 1
        ].owner
      );
      setOwnerUsername(
        Product.editions[edition].history[
          Product.editions[edition].history.length - 1
        ].username
      );
      setMinted(Product.editions[edition].minted);
    }
  }, [Product, edition]);

  useEffect(() => {
    if (minted && account) {
      dispatch(
        getTokenOwnership(dbiliaToken, Product.editions[edition].tokenId)
      );
      dispatch(getOwnerOf(dbiliaToken, Product.editions[edition].tokenId));
      dispatch(getDbiliaTrust(dbiliaToken));
    }
    if (minted) {
      setTokenId(Product.editions[edition].tokenId);
    }
  }, [minted]);

  useEffect(() => {
    if (tokenId > 0) {
      dispatch(getTokenPriceUSD(marketplace, tokenId));
    }
  }, [
    dispatch,
    marketplace,
    minted,
    tokenId,
    tokenPrice
  ]);

  useEffect(() => {
    if (dbiliaToken && account && marketplaceAddress) {
      dispatch(isApprovedStatus(dbiliaToken, account, marketplaceAddress));
    }
  }, [dispatch, account, dbiliaToken, marketplaceAddress, setApproved]);

  useEffect(() => {
    if (isApproved) {
      setApproving(false);
      setDisabled(false);
    }
  }, [isApproved, setApproved]);

  useEffect(() => {
    if (setSaleWithETH || removeSetSaleWithETH) {
      window.location.reload();
    }
  }, [setSaleWithETH, removeSetSaleWithETH]);

  useEffect(() => {
    setAllowed(
      (minted && account && isApproved) || !account || (!minted && account)
    );
  }, [minted, account, isApproved, setApproved]);

  useEffect(() => {
    if (Product.editions && ownerId !== 0) {
      dispatch(getProfileUser(ownerId));
      const item = Product.editions.filter((item) => {
        if (item.history.length !== 0) {
          return item.history[item.history.length - 1].owner === ownerId;
        }
        return false;
      });
      setOwnedEditions(item.length);
    }
  }, [dispatch, Product, ownerId]);

  useEffect(() => {
    if (props.guideStep === 8 && introCardGuide) {
      setAddToMarket('adding');
    }
  });

  // CHECKS HOW MUCH MONEY THE USER HAS
  useEffect(() => {
    dispatch(getUserPayments());
    Axios.get('../api/users/getCoins').then((response) => {
      if (response.data.success) {
        setMoney(response.data.money);
      } else {
        // alert('Failed to get Coins');
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (setSaleWithETH) {
      dispatch(
        addToMarketplace(Product._id, Product.editions[edition].id, Variables)
      );
    }
    if (removeSetSaleWithETH) {
      dispatch(
        removeFromMarketplace(Product._id, Product.editions[edition].id)
      );
    }
    if (purchasedWithETH) {
      dispatch(
        purchaseCardFromMarket(Product._id, edition + 1)
      );
      props.history.push(`/collection/${_id}`);
    }
  }, [
    dispatch,
    setSaleWithETH,
    removeSetSaleWithETH,
    purchasedWithETH,
    Product._id,
    Product.editions,
    edition,
    marketAmount,
  ]);

  useEffect(() => {
    if (!confirm) {
      setLoading(false);
      setDisabled(false);
      setConfirmLoading(false);
      setConfirmDisabled(false);
    }
  }, [confirm]);

  const onCancel = () => {
    setIsModalVisible(false);
  };

  const getType = () => {
    let type;
    if (addToMarket === 'buying') type = 'MARKETPLACE_NONAUCTION';
    else if (addToMarket === 'adding') type = 'SETFORSALE';
    else if (addToMarket === 'removing') type = 'REMOVE';
    return type;
  };

  const showNotif = () => {
    notification['warning']({
      message: 'Please wait...',
      description: 'Please stay on the page until transaction is completed.',
      duration: 0,
    });
  };

  const transactionSuccess = async (data) => {
    const payload = {
      user: _id,
      isPaypal: true,
      paypalEmail: data.email,
      payerID: data.payerID,
      paymentID: data.paymentID,
      paymentToken: data.paymentToken,
      paid: data.paid,
      type: getType(),
      dbiliaBalanceUSD: money,
      amountPaidDbiliaUSD: money,
      amountPaidPaypalUSD: Total,
      total: money + parseFloat(Total),
      productId: Product._id,
      edition: edition + 1,
    };

    if (addToMarket === 'buying') {
      const correctPrice = Product.editions && Product.editions[edition].marketPrice !== 0 ? Product.editions[edition].marketPrice : Product.price;
      const price = Number(correctPrice);
      const royalty = ((Product.royalties / 100) * price).toFixed(2);
      if (!minted) {
        dispatch(purchaseCardFromMarket(Product._id, edition + 1));
      }
      // OWNER RECEIVES MONEY MINUS SERVICE FEE AND ROYALTY
      const ownerReceives = (price - price * serviceFee - royalty).toFixed(2);
      dispatch(updateMoney(ownerId, ownerReceives, true));
      // BUYER HAD SHORT OF MONEY
      // DEDUCT money FROM EXISTING BALANCE
      dispatch(updateMoney(_id, money, false));
      showNotif();
      setContinue(false);
      dispatch(addPayment(payload));
      if (minted) {
        await purchaseNFT();
      }
    } else if (addToMarket === 'adding') {
      setLoading(true);
      dispatch(addPayment(payload));
      dispatch(updateMoney(_id, money, false));
      setPaymentSuccess(true);
      setIsModalVisible(false);
      showNotif();
      await setForSaleWithUSD();
      setLoading(false);
    } else if (addToMarket === 'removing') {
      setLoading(true);
      dispatch(addPayment(payload));
      dispatch(updateMoney(_id, money, false));
      setPaymentSuccess(true);
      setIsModalVisible(false);
      showNotif();
      await removeSetForSaleUSD();
      setLoading(false);
    }
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
    onClickPayUSD();
  };

  const payInETHw3user = () => {
    setIsW3userModalVisible(false);
    if (!account) {
      showErrorMsg(
        'Your account is not connected. Please connect and try again.'
      );
      return;
    }
    showNotif();
    if (addToMarket === 'adding') {
      dispatch(
        setForSaleWithETH(marketplace, gasPrice, account, tokenId, marketAmount)
      );
    } else if (addToMarket === 'removing') {
      dispatch(
        removeSetForSaleWithETH(marketplace, gasPrice, account, tokenId)
      );
    } else if (addToMarket === 'buying') {
      // purchaseWithETH test
      var buyerFee = tokenPrice * serviceFee;
      dispatch(
        purchaseWithETH(marketplace, buyerFee, gasPrice, account, tokenId)
      );
    }
  };

  const checkUserPaid = () => {
    let hasPaid = false;
    const type = getType();
    paymentList.forEach((p) => {
      if (
        p.productId === Product._id &&
        p.edition === edition + 1 &&
        p.type === type
      ) {
        hasPaid = true;
      }
    });
    return hasPaid;
  };

  const calculateGasFee = async () => {
    if (gasPrice > 0) {
      const fee = await getEstimatedGasFee();
      if (fee > 0) {
        let total;
        let paypalFees;

        if (addToMarket !== 'buying') {
          total = fee + fee * serviceFee;
          paypalFees = fee * paypalFee + paypalFixedFeeUSD;
        } else {
          const correctPrice = Product.editions && Product.editions[edition].marketPrice !== 0 ? Product.editions[edition].marketPrice : Product.price;
          total = correctPrice + fee + (correctPrice + fee) * serviceFee;
          paypalFees = (correctPrice + fee) * paypalFee + paypalFixedFeeUSD;
        }
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
      afterError();
    }
  };

  const afterError = async () => {
    setConfirmLoading(false);
    setConfirmDisabled(false);
    dispatch(setConfirm(false))
  }

  const onClickPayUSD = async () => {
    if (!minted) {
      showErrorMsg('Sorry, this NFT is not minted.');
      afterError();
      return;
    }
    // if user has already paid for gas fee, but was not added/removed/purchased to/from marketplace due to failure
    // then we let user skip payment and proceed
    const hasPaid = checkUserPaid();
    const tokenPrice = await getTokenPriceUSDServer();

    if (tokenPrice == null || tokenPrice === undefined) {
      showErrorMsg(
        'Sorry, we could not get the token price. Please refresh the page and try again.'
      );     
      afterError();
      return;
    }

    let addedToMarketplace;
    let removedFromMarketplace;

    if (addToMarket === 'adding') {
      if (!account) {
        addedToMarketplace = tokenPrice > 0;
      } else {
        addedToMarketplace = tokenPrice > 0;
      }
      if (addedToMarketplace) {
        showErrorMsg('Sorry, this NFT has already been added to Marketplace.');
        afterError();
        return;
      }
      if (hasPaid && !addedToMarketplace) {
        await setForSaleWithUSD();
      } else {
        await calculateGasFee();
      }
    } else if (addToMarket === 'removing' || addToMarket === 'buying') {
      if (!account) {
        removedFromMarketplace = tokenPrice === 0;
      } else {
        removedFromMarketplace = tokenPrice === 0;
      }
      if (removedFromMarketplace) {
        showErrorMsg(
          'Sorry, this NFT has already been removed from Marketplace.'
        );
        afterError();
        return;
      }
      if (hasPaid && !removedFromMarketplace) {
        if (addToMarket === 'removing') {
          await removeSetForSaleUSD();
        } else if (addToMarket === 'buying') {
          await purchaseNFT();
        }
      } else {
        await calculateGasFee();
      }
    }
  };

  const setForSaleWithUSD = async () => {
    const options = {
      headers: {
        Authorization: 'Bearer '.concat(token),
      },
    };
    const payload = {
      tokenId: tokenId,
      priceUSD: marketAmount,
    };

    try {
      const { data } = await axios.post(
        local
          ? `http://localhost:4000/api/web3/set-for-sale-usd`
          : `https://dbiliablockchainbackend.herokuapp.com/api/web3/set-for-sale-usd`,
        payload,
        options
      );
      if (data.transactionHash) {
        dispatch(
          addToMarketplace(Product._id, Product.editions[edition].id, Variables)
        );
        window.location.reload();
      }
    } catch (e) {
      if (e.response && e.response.data) {
        showErrorMsg(e.response.data.message);
      }
    }
  };

  const removeSetForSaleUSD = async () => {
    const options = {
      headers: {
        Authorization: 'Bearer '.concat(token),
      },
    };
    const payload = {
      tokenId: tokenId,
    };

    try {
      const { data } = await axios.post(
        local
          ? `http://localhost:4000/api/web3/remove-set-for-sale-usd`
          : `https://dbiliablockchainbackend.herokuapp.com/api/web3/remove-set-for-sale-usd`,
        payload,
        options
      );
      if (data.transactionHash) {
        dispatch(
          removeFromMarketplace(Product._id, Product.editions[edition].id)
        );
        window.location.reload();
      }
    } catch (e) {
      if (e.response && e.response.data) {
        showErrorMsg(e.response.data.message);
      }
    }
  };

  const purchaseNFT = async () => {
    const options = {
      headers: {
        Authorization: 'Bearer '.concat(token),
      },
    };
    let payload = {};
    if (account) {
      payload = {
        tokenId: tokenId,
        buyer: account,
      };
    } else {
      payload = {
        tokenId: tokenId,
        buyerId: _id,
      };
    }

    try {
      const { data } = await axios.post(
        local
          ? `http://localhost:4000/api/web3/purchase-${
              !account ? 'w2user' : 'w3user'
            }`
          : `https://dbiliablockchainbackend.herokuapp.com/api/web3/purchase-${
              !account ? 'w2user' : 'w3user'
            }`,
        payload,
        options
      );
      if (data.transactionHash) {
        dispatch(purchaseCardFromMarket(Product._id, edition + 1));
        notification['success']({
          message: 'Successfully paid!',
          description: `Congrats, you now own Edition ${edition + 1} of ${
            Product.title
          }.`,
          duration: 5,
        });
        props.history.push(`/collection/${_id}`);
      }
    } catch (e) {
      if (e.response && e.response.data) {
        showErrorMsg(e.response.data.message);
      }
    }
  };

  function showDialog() {
    setIsModalVisible(true);
  }

  const onPay = async () => {
    setLoading(true);
    setDisabled(true);

    const payload = {
      user: _id,
      isPaypal: false,
      paypalEmail: '',
      payerID: '',
      paymentID: '',
      paymentToken: '',
      paid: true,
      type: getType(),
      dbiliaBalanceUSD: money,
      amountPaidDbiliaUSD: Total,
      amountPaidPaypalUSD: 0,
      total: Total,
      productId: Product._id,
      edition: edition + 1,
    };

    if (addToMarket === 'buying') {
      const correctPrice = Product.editions && Product.editions[edition].marketPrice !== 0 ? Product.editions[edition].marketPrice : Product.price;
      const price = Number(correctPrice);
      const royalty = ((Product.royalties / 100) * price).toFixed(2);
      if (!minted) {
        dispatch(purchaseCardFromMarket(Product._id, edition + 1));
      }
      // OWNER RECEIVES MONEY MINUS SERVICE FEE AND ROYALTY
      const ownerReceives = (price - price * serviceFee - royalty).toFixed(2);
      dispatch(updateMoney(ownerId, ownerReceives, true));
      // BUYER HAD SHORT OF MONEY
      // DEDUCT money FROM EXISTING BALANCE
      dispatch(updateMoney(_id, Total, false));
      showNotif();
      setContinue(false);
      dispatch(addPayment(payload));
      if (minted) {
        await purchaseNFT();
      }
    } else if (addToMarket === 'adding') {
      setLoading(true);
      dispatch(addPayment(payload));
      dispatch(updateMoney(_id, Total, false));
      setPaymentSuccess(true);
      setIsModalVisible(false);
      showNotif();
      await setForSaleWithUSD();
      setLoading(false);
    } else if (addToMarket === 'removing') {
      setLoading(true);
      dispatch(addPayment(payload));
      dispatch(updateMoney(_id, Total, false));
      setPaymentSuccess(true);
      setIsModalVisible(false);
      showNotif();
      await removeSetForSaleUSD();
      setLoading(false);
    }
  };

  const getEstimatedGasFee = async () => {
    const options = {
      headers: {
        Authorization: 'Bearer '.concat(token),
      },
    };
    let payload = {};
    let endpoint;

    if (addToMarket === 'adding') {
      payload = {
        tokenId: tokenId,
        priceUSD: marketAmount,
      };
      endpoint = local
        ? `http://localhost:4000/api/web3/tx-fee/set-for-sale/${gasPrice}`
        : `https://dbiliablockchainbackend.herokuapp.com/api/web3/tx-fee/set-for-sale/${gasPrice}`;
    } else if (addToMarket === 'removing') {
      payload = {
        tokenId: tokenId,
      };
      endpoint = local
        ? `http://localhost:4000/api/web3/tx-fee/remove/${gasPrice}`
        : `https://dbiliablockchainbackend.herokuapp.com/api/web3/tx-fee/remove/${gasPrice}`;
    } else if (addToMarket === 'buying') {
      if (account) {
        payload = {
          tokenId: tokenId,
          buyer: account,
        };
        endpoint = local
          ? `http://localhost:4000/api/web3/tx-fee/purchase-w3user/${gasPrice}`
          : `https://dbiliablockchainbackend.herokuapp.com/api/web3/tx-fee/purchase-w3user/${gasPrice}`;
      } else {
        payload = {
          tokenId: tokenId,
          buyerId: _id,
        };
        endpoint = local
          ? `http://localhost:4000/api/web3/tx-fee/purchase-w2user/${gasPrice}`
          : `https://dbiliablockchainbackend.herokuapp.com/api/web3/tx-fee/purchase-w2user/${gasPrice}`;
      }
    }

    try {
      const { data } = await axios.post(endpoint, payload, options);
      return +data.fee;
    } catch (error) {
      console.log(error);
      showErrorMsg(
        `Sorry, couldn't get the gas fee. Please refresh the page and try again.`
      );
      afterError();
      return;
    }
  };

  const transactionError = () => {
    alert('Transaction error');
    setContinue(false);
    dispatch(setConfirm(false));
  };

  const transactionCanceled = () => {
    alert('Transaction canceled');
    setContinue(false);
    dispatch(setConfirm(false));
  };

  const showErrorMsg = async (msg, time = 3) => {
    notification['error']({
      message: msg,
      duration: time,
    });
  };

  const onClickApprove = () => {
    console.log(
      'file: ProductInfoOwn.js ~ line 531 ~ onClickApprove ~ onClickApprove'
    );
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
    if (dbiliaToken && gasPrice && account && marketplaceAddress) {
      setApproving(true);
      setDisabled(true);
      dispatch(
        setApprovedToken(
          dbiliaToken,
          gasPrice,
          account,
          marketplaceAddress,
          setApproving,
          setDisabled
        )
      );
    }
  };

  const canAddToMarketplace = async () => {
    if (minted) {
      // wallet not connected
      if (!account) {
        const data = await getTokenOwnershipServer();
        const owner = await getOwnerOfServer();
        const dbilia = await getDbiliaTrustServer();

        if (data == null || owner == null || dbilia == null) {
          showErrorMsg(
            'Sorry, we could not retrieve NFT information. Please refresh the page and try again.'
          );
          afterError();
          return false;
        }
        if (!data.isW3user && data.w2owner !== _id) {
          showErrorMsg(
            'Sorry, you cannot add to Marketplace because you do not own this NFT.'
          );
          afterError();
          return false;
        }
        if (!data.isW3user && owner !== dbilia) {
          showErrorMsg(
            'Sorry, you cannot add to Marketplace because dbilia does not own this NFT.'
          );
          afterError();
          return false;
        }
        if (data.isW3user) {
          showErrorMsg(
            'Sorry, you cannot add to Marketplace because you are not connected to wallet. Please connect and try again.'
          );
          afterError();
          return false;
        }
      } else {
        if (
          tokenOwnership.isW3user == null ||
          account == null ||
          ownerOf == null
        ) {
          showErrorMsg(
            'Sorry, we could not retrieve NFT information. Please refresh the page and try again.'
          );
          afterError();
          return false;
        }
        if (tokenOwnership.isW3user) {
          if (tokenOwnership.w3owner !== account && ownerOf !== account) {
            showErrorMsg(
              'Sorry, you cannot add to Marketplace because your wallet does not own this NFT. Please change it to other wallet.'
            );
            afterError();
            return false;
          }
        } else {
          if (tokenOwnership.w2owner === _id) {
            goToClaimOwnership('add to');
            return false;
          }
        }
      }
    }
    return true;
  };

  const canBuyFromMarketplace = async () => {
    if (minted) {
      // wallet not connected
      if (!account) {
        const data = await getTokenOwnershipServer();
        const owner = await getOwnerOfServer();
        const dbilia = await getDbiliaTrustServer();

        if (data == null || owner == null || dbilia == null) {
          showErrorMsg(
            'Sorry, we could not retrieve NFT information. Please refresh the page and try again.'
          );
          afterError();
          return false;
        }
        if (!data.isW3user && owner !== dbilia) {
          showErrorMsg(
            'Sorry, you cannot buy this NFT because seller does not own this anymore.'
          );
          afterError();
          return false;
        }
        if (data.isW3user && data.w3owner !== owner) {
          showErrorMsg(
            'Sorry, you cannot buy this NFT because seller does not own this anymore.'
          );
          afterError();
          return false;
        }
      } else {
        if (
          tokenOwnership.isW3user == null ||
          ownerOf == null ||
          dbiliaTrust == null
        ) {
          showErrorMsg(
            'Sorry, we could not retrieve NFT information. Please refresh the page and try again.'
          );
          afterError();
          return false;
        }
        if (!tokenOwnership.isW3user && ownerOf !== dbiliaTrust) {
          showErrorMsg(
            'Sorry, you cannot buy this NFT because seller does not own this anymore.'
          );
          afterError();
          return false;
        }
        if (tokenOwnership.isW3user && tokenOwnership.w3owner !== ownerOf) {
          showErrorMsg(
            'Sorry, you cannot buy this NFT because seller does not own this anymore.'
          );
          afterError();
          return false;
        }
      }
    }
    return true;
  };

  const canRemoveFromMarketplace = async () => {
    if (minted) {
      // wallet not connected
      if (!account) {
        const data = await getTokenOwnershipServer();
        const owner = await getOwnerOfServer();
        const dbilia = await getDbiliaTrustServer();

        if (data == null || owner == null || dbilia == null) {
          showErrorMsg(
            'Sorry, we could not retrieve NFT information. Please refresh the page and try again.'
          );
          afterError();
          return false;
        }
        if (!data.isW3user && data.w2owner !== _id) {
          showErrorMsg(
            'Sorry, you cannot remove from Marketplace because you do not own this NFT.'
          );
          afterError();
          return false;
        }
        if (!data.isW3user && owner !== dbilia) {
          showErrorMsg(
            'Sorry, you cannot remove from Marketplace because dbilia does not own this NFT.'
          );
          afterError();
          return false;
        }
        if (data.isW3user) {
          showErrorMsg(
            'Sorry, you cannot add to Marketplace because you are not connected to wallet. Please connect and try again.'
          );
          afterError();
          return false;
        }
      } else {
        if (
          tokenOwnership.isW3user == null ||
          account == null ||
          ownerOf == null
        ) {
          showErrorMsg(
            'Sorry, we could not retrieve NFT information. Please refresh the page and try again.'
          );
          afterError();
          return false;
        }
        if (tokenOwnership.isW3user) {
          if (tokenOwnership.w3owner !== account && ownerOf !== account) {
            showErrorMsg(
              'Sorry, you cannot add to Marketplace because your wallet does not own this NFT. Please change it to other wallet.'
            );
            afterError();
            return false;
          }
        } else {
          if (tokenOwnership.w2owner === _id) {
            goToClaimOwnership('remove from');
            return false;
          }
        }
      }
    }
    return true;
  };

  const goToClaimOwnership = (type) => {
    const claimOwnershipPage = `...`;
    notification['info']({
      message: 'Please claim ownership',
      description: (
        <div>
          This NFT was created before you connected to the wallet and Dbilia has
          been keeping it on your behalf. Please claim ownership to your wallet
          if you want to {type} Marketplace.
          <br />
          <a href={claimOwnershipPage}>Go to claim ownership</a>
        </div>
      ),
      duration: 15,
    });
  };

  const getTokenOwnershipServer = async () => {
    try {
      const { data } = await axios.get(
        local
          ? `http://localhost:4000/api/web3/token-ownership/${tokenId}`
          : `https://dbiliablockchainbackend.herokuapp.com/api/web3/token-ownership/${tokenId}`
      );
      return data;
    } catch (error) {
      //console.log(error);
      showErrorMsg(
        `Sorry, something went wrong. Please refresh the page and try again.`
      );
    }
  };

  const getTokenPriceUSDServer = async () => {
    try {
      const { data } = await axios.get(
        local
          ? `http://localhost:4000/api/web3/token-price-usd/${tokenId}`
          : `https://dbiliablockchainbackend.herokuapp.com/api/web3/token-price-usd/${tokenId}`
      );
      return data;
    } catch (error) {
      //console.log(error);
      showErrorMsg(
        `Sorry, something went wrong. Please refresh the page and try again.`
      );
    }
  };

  const getOwnerOfServer = async () => {
    try {
      const { data } = await axios.get(
        local
          ? `http://localhost:4000/api/web3/owner/${tokenId}`
          : `https://dbiliablockchainbackend.herokuapp.com/api/web3/owner/${tokenId}`
      );
      return data;
    } catch (error) {
      //console.log(error);
      showErrorMsg(
        `Sorry, something went wrong. Please refresh the page and try again.`
      );
    }
  };

  const getDbiliaTrustServer = async () => {
    try {
      const { data } = await axios.get(
        local
          ? `http://localhost:4000/api/web3/dbilia`
          : `https://dbiliablockchainbackend.herokuapp.com/api/web3/dbilia`
      );
      return data;
    } catch (error) {
      //console.log(error);
      showErrorMsg(
        `Sorry, something went wrong. Please refresh the page and try again.`
      );
    }
  };

  useEffect(() => {
    if (Variables && Variables.marketPrice) {     
      onClickConfirm();
    }
  }, [Variables]);
  
  const onClickConfirm = async () => {
    setConfirmLoading(true);
    setConfirmDisabled(true);

    switch (addToMarket) {
      case 'adding':
        const canAdd = await canAddToMarketplace();
        if (!canAdd) return;
        // formik handling this now
        // if (!marketAmount || marketAmount <= 0) return;
        if (minted && account) {
          setIsW3userModalVisible(true);
          return;
        } else {
          console.log('running');
          // w2user
          if (!minted) {
            dispatch(
              addToMarketplace(
                Product._id,
                Product.editions[edition].id,
                Variables
              )
            ).then(() => dispatch(setConfirm(false)));
            break;
          } else {
            onClickPayUSD();
            return;
          }
        }
      case 'removing':
        const canRemove = await canRemoveFromMarketplace();
        if (!canRemove) return;
        if (minted && account) {
          setIsW3userModalVisible(true);
          return;
        } else {
          // w2user
          if (!minted) {
            dispatch(
              removeFromMarketplace(Product._id, Product.editions[edition].id)
            ).then(() => dispatch(setConfirm(false)));
            break;
          } else {
            onClickPayUSD();
            return;
          }
        }
      case 'buying':
        dispatch(resetCollection());
        const canBuy = await canBuyFromMarketplace();
        if (!canBuy) return;
        if (minted && account) {
          setIsW3userModalVisible(true);
          return;
        } else {
          // w2user
          if (!minted) {
            onClickConfirmPayment();
            return;
          } else {
            dispatch(setConfirm(false));
            onClickPayUSD();
            return;
          }
        }
      default:
        //dispatch(purchaseCardFromMarket(Product._id, edition + 1));
        break;
    }

    props.guideStep === 8 && dispatch(endCardTour());
    setTimeout(() => {
      setConfirmLoading(false);
      setConfirmDisabled(false);
      setAddSuccess(false);
      setRemoveSuccess(false);
    }, 500);
  };

  const onClickConfirmPayment = async () => {
    const correctPrice = Product.editions && Product.editions[edition].marketPrice !== 0 ? Product.editions[edition].marketPrice : Product.price;
    const price = Number(correctPrice);
    const total = price + price * serviceFee;
    const paypalFees = price * paypalFee + paypalFixedFeeUSD;
    const royalty = ((Product.royalties / 100) * price).toFixed(2);

    if (money >= total) {
      dispatch(purchaseCardFromMarket(Product._id, edition + 1));
      // BUYER PAYS WITH DBILIA MONEY
      dispatch(updateMoney(_id, total.toFixed(2), false));
      // OWNER RECEIVES MONEY MINUS SERVICE FEE AND ROYALTY
      const ownerReceives = (price - price * serviceFee - royalty).toFixed(2);
      dispatch(updateMoney(ownerId, ownerReceives, true));

      const payload = {
        user: _id,
        isPaypal: false,
        paypalEmail: '',
        payerID: '',
        paymentID: '',
        paymentToken: '',
        paid: true,
        type: 'MARKETPLACE_NONAUCTION',
        dbiliaBalanceUSD: money,
        amountPaidDbiliaUSD: total,
        amountPaidPaypalUSD: 0,
        total: total,
        productId: Product._id,
        edition: edition + 1,
      };

      dispatch(addPayment(payload));

      notification['success']({
        message: 'Successfully paid!',
        description: `Congrats, you now own Edition ${edition + 1} of ${
          Product.title
        }.`,
        duration: 5,
      });

      props.history.push(`/collection/${_id}`);
    } else {
      // USER DOESN'T HAVE ENOUGH BALANCE, NEED TO PAY WITH PAYPAL
      setContinue(true);
      // IF USER DOESN'T HAVE MONEY AT ALL, THEN PAY THE FULL CARD PRICE WITH PAYPAL
      // IF USER HAS SOME MONEY, BUT SHORT OF MONEY THEN PAY THE REMAINING WIH PAYPAL
      if (money >= total) {
        //setTotal((price + price * serviceFee).toFixed(2));
      } else {
        if (money <= 0) {
          setTotal((total + paypalFees).toFixed(2));
        } else {
          setTotal((total + paypalFees - money).toFixed(2));
        }
      }
    }
  };

  const onPriceChange = (e) => {
    setMarketAmount(+e.target.value);
  };
  const onPriceBlur = () => {
    const value = (Math.round(marketAmount * 100) / 100).toFixed(2);
    setMarketAmount(+value);
  };

  return (
    <>
      <div
        className='product__details'
        style={{
          marginTop: introCardGuide && '7rem',
        }}
      >
        <h2 className='product__title'>{Product.title}</h2>

        {minted && (
          <>
            <p
              className='product__username'
              style={{ color: 'red', marginBottom: '.5rem' }}
            >
              Minted
            </p>
          </>
        )}

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
        {_id !== ownerId &&
          Product.editions &&
          Product.editions[edition].inMarket && (
            <p className='product__editions' style={{ marginTop: '.5rem' }}>
              Wallet Balance :{' '}
              {money &&
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(money)}
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
        {Product.packId !== 'no-pack' && Product.packId && (
          <h3 className='product__pack-name'>Pack: {Product.packId.title}</h3>
        )}
        <div className='product__countdown-and-editions'>
          <p
            className='product__editions'
            style={{
              zIndex:
                introCardGuide &&
                Product.introCard &&
                props.guideStep === 1 &&
                3001,
            }}
            onClick={() => dispatch(setEditionsOpen(true))}
          >
            {`Edition ${edition + 1} of ${
              Product.numberEditions === 10000000000
                ? 'Unlimited'
                : Product.numberEditions
            }`}
          </p>
          {introCardGuide &&
            Product.introCard &&
            props.guideStep === 1 &&
            (width > 1040 ? (
              <svg
                className='tour__arrow tour__arrow--editions'
                style={{
                  marginLeft: '5rem',
                }}
              >
                <use href={sprite + '#arrow'}></use>
              </svg>
            ) : (
              <svg className='tour__arrow ' style={{}}>
                <use href={sprite + '#arrow'}></use>
              </svg>
            ))}

          {ownedEditions !== 0 && (
            <p
              style={{
                zIndex:
                  introCardGuide &&
                  Product.introCard &&
                  props.guideStep === 3 &&
                  '3000',
              }}
              className='product__owned-editions'
              onClick={() => dispatch(setOwnedEditionsOpen(true))}
            >
              {ownerUsername} Editions: {ownedEditions}
            </p>
          )}
          {introCardGuide && Product.introCard && props.guideStep === 3 && (
            <svg className='tour__arrow tour__arrow--your-editions'>
              <use href={sprite + '#arrow'}></use>
            </svg>
          )}
        </div>
        <div
          className={
            editionsOpen
              ? 'editions-popup editions-popup--visible'
              : 'editions-popup'
          }
          style={{
            marginTop: introCardGuide && Product.introCard && '10rem',
          }}
        >
          <div
            className='editions-popup__window'
            style={{
              marginTop: introCardGuide && Product.introCard && '-10rem',
              zIndex:
                introCardGuide &&
                Product.introCard &&
                props.guideStep === 2 &&
                '3000',
            }}
          >
            <>
              <button
                className='editions-popup__close'
                onClick={() => dispatch(setEditionsOpen(false))}
                style={{}}
              >
                &times;
              </button>
              {introCardGuide && Product.introCard && props.guideStep === 2 && (
                <svg className='tour__arrow tour__arrow--editions-close'>
                  <use href={sprite + '#arrow'}></use>
                </svg>
              )}
              <h3 className='editions-popup__history-title'> Editions</h3>
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
                          item.history.length !== 0 && (
                            <tr
                              className='editions-popup__row'
                              style={{
                                cursor:
                                  introCardGuide && Product.introCard && 'auto',
                              }}
                              onClick={() => {
                                if (!introCardGuide) {
                                  dispatch(setEditionsOpen(false));
                                  props.history.push(
                                    `/product/${Product._id}/${item.edition}`
                                  );
                                }
                              }}
                            >
                              <td>{item.edition}</td>
                              <td>
                                {item.history[item.history.length - 1].username}
                              </td>

                              <td>
                                <p>
                                  {item.inMarket ? 'Resale' : 'Not for resale'}
                                </p>
                              </td>
                            </tr>
                          )
                      )}
                  </tbody>
                </table>
                {Product.numberEditions !== Product.sold && (
                  <button
                    className='editions-popup__add-button'
                    style={{
                      cursor: introCardGuide && Product.introCard && 'auto',
                    }}
                    onClick={() => {
                      if (!introCardGuide || !Product.introCard) {
                        dispatch(setEditionsOpen(false));
                        props.history.push(`/product/${Product._id}`);
                      }
                    }}
                  >
                    Editions Still Available
                  </button>
                )}
              </div>
            </>
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
                onClick={() => dispatch(setOwnedEditionsOpen(false))}
              >
                &times;
              </button>
              {introCardGuide && Product.introCard && props.guideStep === 4 && (
                <svg className='tour__arrow tour__arrow--editions-close'>
                  <use href={sprite + '#arrow'}></use>
                </svg>
              )}
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
                          profile._id ===
                            item.history[item.history.length - 1].owner && (
                            <tr
                              className='editions-popup__row'
                              style={{
                                cursor:
                                  introCardGuide && Product.introCard && 'auto',
                              }}
                              onClick={() => {
                                if (!introCardGuide) {
                                  dispatch(setOwnedEditionsOpen(false));
                                  props.history.push(
                                    `/product/${Product._id}/${item.edition}`
                                  );
                                }
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
        {/* DOES THE LOGGED IN USER OWN THE CARD */}
        {Product.editions && Product.editions[edition].marketPrice !== 0 ? (
          <h3 className='product__price'>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(Product.editions[edition].marketPrice)}{' '}
            USD
          </h3>
        ) : Product.editions &&
          Product.editions[edition].marketPrice === 0 &&
          Product.editions[edition].history.length > 1 ? (
          <h3 className='product__price'>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(
              Product.editions[edition].history[
                Product.editions[edition].history.length - 1
              ].price
            )}
            USD{' '}
          </h3>
        ) : (
          <h3 className='product__price'>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(Product.price)}{' '}
            USD
          </h3>
        )}
        <div className='product__button-section'>
          {_id === ownerId ? (
            Product.editions && !Product.editions[edition].inMarket ? (
              <>
                <button
                  className='product__add-button'
                  onClick={async () => {
                    setAddToMarket('adding');
                    const canAdd = await canAddToMarketplace();
                    if (!canAdd) return;
                    _id
                      ? dispatch(setConfirm(true))
                      : props.history.push('/login');
                  }}
                  style={{
                    zIndex: props.guideStep === 7 && '3001',
                    marginBottom: introCardGuide && Product.introCard && '1rem',
                  }}
                >
                  Add to Marketplace
                </button>
                {introCardGuide &&
                  Product.introCard &&
                  props.guideStep === 7 && (
                    <svg
                      className={
                        width > 1200
                          ? 'tour__arrow tour__arrow--marketplace'
                          : 'tour__arrow tour__arrow--marketplace--mobile'
                      }
                    >
                      {width > 1200 ? (
                        <use href={sprite + '#arrow-up'}></use>
                      ) : (
                        <use href={sprite + '#arrow'}></use>
                      )}
                    </svg>
                  )}

                {!minted && (
                  <Mint
                    productId={Product._id}
                    Product={Product}
                    editionId={Product.editions[edition].id}
                    currentEdition={Product.editions[edition].edition}
                    guideStep={props.guideStep}
                  />
                )}
              </>
            ) : (
              <button
                className='product__add-button'
                onClick={() => {
                  setAddToMarket('removing');
                  _id
                    ? dispatch(setConfirm(true))
                    : props.history.push('/login');
                }}
              >
                Remove From Marketplace
              </button>
            )
          ) : Product.editions && Product.editions[edition].inMarket ? (
            <button
              className='product__add-button'
              onClick={() => {
                setAddToMarket('buying');
                _id ? dispatch(setConfirm(true)) : props.history.push('/login');
              }}
            >
              Buy From Marketplace
            </button>
          ) : Product.sold < Product.numberEditions ? (
            <button
              className='product__add-button'
              onClick={() => {
                _id
                  ? props.history.push(`/product/${Product._id}`)
                  : props.history.push('/login');
              }}
            >
              Buy Next Available Edition
            </button>
          ) : Product.sold === Product.numberEditions &&
            Product.marketCount > 0 &&
            !Product.editions[edition].inMarket ? (
            <button
              onClick={() => dispatch(setEditionsOpen(true))}
              className='product__add-button'
            >
              Find on Marketplace
            </button>
          ) : (
            <button className='product__add-button product__add-button--sold'>
              Sold Out
            </button>
          )}
        </div>
        <div
          className={
            confirm ? 'confirm-popup confirm-popup--visible' : 'confirm-popup'
          }
          style={{ zIndex: introCardGuide && Product.introCard && 100 }}
        >
          <div className='confirm-popup__window'>
            <>
              <button
                className='confirm-popup__close'
                onClick={() => {
                  if (introCardGuide && Product.introCard) {
                    dispatch(endCardTour());
                    window.location.reload();
                  }
                  dispatch(setConfirm(false));
                }}
              >
                &times;
              </button>
              {introCardGuide && Product.introCard && props.guideStep === 8 && (
                <svg className='tour__arrow tour__arrow--confirm-close'>
                  <use href={sprite + '#arrow'}></use>
                </svg>
              )}
              <p className='confirm-popup__text'>
                Are you sure you'd like to{' '}
                {addToMarket === 'adding'
                  ? 'add '
                  : addToMarket === 'removing'
                  ? 'remove '
                  : 'purchase '}
                edition {edition + 1} of <strong>{Product.title}</strong> by{' '}
                {props.writer} {addToMarket === 'buying' ? 'from ' : 'to '}
                the marketplace?
                <br />
                <br />
                {/* LET W2, W3USER BUY IT RIGHT AWAY IF IT'S NOT MINTED  */}
                {addToMarket === 'buying' && !minted && (
                  <NFTFee
                    money={money}
                    price={Product.editions[edition].marketPrice}
                    serviceFee={serviceFee}
                    paypalFee={paypalFee}
                    paypalFixedFeeUSD={paypalFixedFeeUSD}
                  />
                )}
              </p>

              {addToMarket === 'adding' &&
                (Allowed ? (
                  <>
                    <Formik
                      validateOnChange={true}
                      initialValues={{
                        marketPrice: '',
                        auction: '',
                        startingBid: '',
                        auctionDeadline: '',
                        auctionStartDate: moment(Date.now()),

                        // currency: 'USD',
                      }}
                      // validationSchema={validationSchema}
                      validationSchema={Yup.object().shape({
                        marketPrice: Yup.string().when('auction', {
                          is: 'false',
                          then: Yup.string()
                            .min(0, 'Price must be greater than 0')
                            .required('Please enter price'),
                        }),
                        startingBid: Yup.string().when('auction', {
                          is: 'true',
                          then: Yup.string()
                            .required('Please enter a starting bid')
                            .min(0, 'Bid must be above 0'),
                        }),
                        auctionStartDate: Yup.date().when('auction', {
                          is: 'true',
                          then: Yup.date()
                            .min(
                              moment(Date.now()).subtract(60, 'minute'),
                              'Auction cannot start in the past'
                            )
                            .required('Start date is required'),
                        }),
                        auctionDeadline: Yup.date().when('auction', {
                          is: 'true',
                          then: Yup.date()
                            .required('Deadline is required')
                            .min(
                              Yup.ref('auctionStartDate'),
                              'Deadline is before start'
                            ),
                        }),
                      })}
                      onSubmit={async (data, { setSubmitting }) => {
                        setSubmitting(true);

                        const variables = {
                          marketPrice:
                            data.auction === 'true'
                              ? (
                                  Math.round(data.startingBid * 100) / 100
                                ).toFixed(2)
                              : data.marketPrice,
                          auction: data.auction,
                          startingBid: (
                            Math.round(data.startingBid * 100) / 100
                          ).toFixed(2),
                          auctionStartDate: data.auctionStartDate,
                          auctionDeadline: data.auctionDeadline,
                        };
                        if (Allowed) {
                          setVariables(variables);
                        } else {
                          onClickApprove();
                        }
                      }}
                    >
                      {({
                        values,
                        errors,
                        isSubmitting,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldTouched,
                        setFieldValue,
                        isValid,
                      }) => (
                        <Form
                          onSubmit={handleSubmit}
                          id='my-form'
                          style={{ gridColumn: '2/3', display: 'grid' }}
                        >
                          <Form.Item
                            style={{ gridColumn: '1/2', gridRow: '1/2' }}
                            className='confirm-popup__text confirm-popup__text--2'
                            label='How much would you like to resell the NFT for?'
                          >
                            <Input
                              id='marketPrice'
                              type='number'
                              min={0}
                              step='.01'
                              pattern='^\d*(\.\d{0,2})?$'
                              disabled={values.auction === 'true'}
                              value={values.marketPrice}
                              onChange={handleChange}
                              onBlur={() => {
                                setFieldTouched('marketPrice', true);
                                setMarketAmount(values.marketPrice);
                              }}
                              placeholder='$'
                              className={
                                errors.marketPrice && touched.marketPrice
                                  ? 'text-input error'
                                  : 'text-input'
                              }
                            />
                            {errors.marketPrice && touched.marketPrice && (
                              <div className='input-feedback'>
                                {errors.marketPrice}
                              </div>
                            )}
                          </Form.Item>
                          <Form.Item
                            label='Send card to auction upon creation'
                            style={{ gridColumn: '1/2' }}
                          >
                            {trueFalse.map((item, i) => (
                              <>
                                <label>
                                  <Field
                                    id='auction'
                                    style={{ margin: '1rem .5rem 2rem' }}
                                    type='radio'
                                    checked={
                                      values.auction === item.value && true
                                    }
                                    value={item.value}
                                    name='auction'
                                    onChange={handleChange}
                                    onBlur={() => {
                                      setFieldTouched('auction', true);
                                      if (values.auction) {
                                        setMarketAmount();
                                        setFieldValue('marketPrice', '');
                                      }
                                    }}
                                    className='text-input'
                                  />
                                  {item.label}
                                </label>
                              </>
                            ))}
                          </Form.Item>

                          {values.auction === 'true' && (
                            <>
                              <Form.Item
                                label='Starting Bid'
                                style={{ gridColumn: '1/2' }}
                              >
                                <Input
                                  id='startingBid'
                                  type='number'
                                  min={0}
                                  step='.01'
                                  pattern='^\d*(\.\d{0,2})?$'
                                  value={values.startingBid}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className={
                                    values.auction === 'true' &&
                                    errors.startingBid &&
                                    touched.startingBid
                                      ? 'text-input error'
                                      : 'text-input'
                                  }
                                />
                                {values.auction === 'true' &&
                                  errors.startingBid &&
                                  touched.startingBid && (
                                    <div className='input-feedback'>
                                      {errors.startingBid}
                                    </div>
                                  )}
                              </Form.Item>

                              <Form.Item
                                label='Starting Date'
                                style={{ gridColumn: '1/2' }}
                              >
                                <DatePickerField
                                  name='auctionStartDate'
                                  min={
                                    new Date(moment(Date.now()).subtract(60))
                                  }
                                  max={
                                    new Date(
                                      moment()
                                        .add(13, 'days')
                                        .format('YYYY-MM-DD')
                                    )
                                  }
                                  value={values.auctionStartDate}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className={
                                    values.auction === 'true' &&
                                    errors.auctionStartDate &&
                                    touched.auctionStartDate
                                      ? 'text-input error'
                                      : 'text-input'
                                  }
                                />
                                {values.auction === 'true' &&
                                  errors.auctionStartDate &&
                                  touched.auctionStartDate && (
                                    <div
                                      className='input-feedback'
                                      style={{
                                        gridRow: '1/2',
                                        gridColumn: '1/3',
                                      }}
                                    >
                                      {errors.auctionStartDate}
                                    </div>
                                  )}
                              </Form.Item>
                              <Form.Item
                                style={{ gridColumn: '1/2' }}
                                label='Expiration Date'
                              >
                                <DatePickerField
                                  name='auctionDeadline'
                                  type='Date'
                                  errors={errors}
                                  touched={touched}
                                  value={values.auctionDeadline}
                                  min={new Date(Date.now())}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  max={
                                    new Date(
                                      moment()
                                        .add(14, 'days')
                                        .format('YYYY-MM-DD')
                                    )
                                  }
                                  className={
                                    values.auction === 'true' &&
                                    errors.auctionDeadline &&
                                    touched.auctionDeadline
                                      ? 'text-input error'
                                      : 'text-input'
                                  }
                                />
                                {values.auction === 'true' &&
                                  errors.auctionDeadline &&
                                  touched.auctionDeadline && (
                                    <div className='input-feedback'>
                                      {errors.auctionDeadline}
                                    </div>
                                  )}
                              </Form.Item>
                            </>
                          )}
                          {/* confirm here */}
                          <div style={{ justifySelf: 'center' }}>
                            {Allowed ? (
                              <button
                                className='confirm-popup__add-button'
                                type='submit'
                                disabled={ConfirmDisabled}
                              >
                                {ConfirmLoading ? (
                                  <div>
                                    <LoadingOutlined
                                      style={{
                                        fontSize: 15,
                                        marginRight: '10px',
                                      }}
                                      spin
                                    />
                                  </div>
                                ) : (
                                  <span>Confirm</span>
                                )}
                              </button>
                            ) : (
                              <button
                                className='confirm-popup__add-button'
                                type='submit'
                                disabled={Disabled}
                              >
                                {Approving ? (
                                  <div>
                                    <LoadingOutlined
                                      style={{
                                        fontSize: 15,
                                        marginRight: '10px',
                                      }}
                                      spin
                                    />
                                  </div>
                                ) : (
                                  <span>Approve</span>
                                )}
                              </button>
                            )}
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </>
                ) : (
                  <>
                    <p className='confirm-popup__text confirm-popup__text--2'>
                      Please approve Marketplace smart contract. <br />
                      This is needed for making your first sell order. <br />
                      Only needs to be done once for your account.
                    </p>
                  </>
                ))}

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

              {addToMarket !== 'adding' && Allowed && (
                <>
                  <button
                    className='confirm-popup__add-button'
                    onClick={() => {
                      onClickConfirm();
                    }}
                    disabled={ConfirmDisabled}
                  >
                    {ConfirmLoading ? (
                      <div>
                        <LoadingOutlined
                          style={{ fontSize: 15, marginRight: '10px' }}
                          spin
                        />
                      </div>
                    ) : (
                      <span>Confirm</span>
                    )}
                  </button>
                </>
              )}
            </>
          </div>
        </div>
      </div>

      <Modal
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
        <GasFee
          addToMarket={addToMarket}
          enoughBalance={enoughBalance}
          price={Product.editions && Product.editions[edition].marketPrice !== 0 ? Product.editions[edition].marketPrice : Product.price}
          Fee={Fee}
          serviceFee={serviceFee}
          money={money}
          paypalFee={paypalFee}
          paypalFixedFeeUSD={paypalFixedFeeUSD}
        />
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
          <p>You have an option to pay {addToMarket === 'buying' ? '' : 'the gas fee '} in USD or ETH.</p>
        </div>
      </Modal>
    </>
  );
}
export default ProductInfoOwn;
