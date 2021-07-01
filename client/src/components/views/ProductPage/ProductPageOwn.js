import React, { useEffect, useState } from 'react';
import {
  addToCart,
  endCardTour,
  auth,
  trackCardTour,
  incrementCardTour,
} from '../../../_actions/user_actions';
import { useDispatch, useSelector } from 'react-redux';
import sprite from '../../../img/sprite.svg';
import Card3d from '../../utils/Card3d';
import { getSingleProduct } from '../../../_actions/product_actions';
import ProductInfoOwn from './Sections/ProductInfoOwn';
import UnlockableContent from './Sections/UnlockableContent';
import useWindowDimensions from '../NavBar/Sections/ScreenWidth';
import {
  setEditionsOpen,
  setConfirm,
  setOwnedEditionsOpen,
  setMintInfo,
} from '../../../_actions/in_view_actions';
import NavBar from '../NavBar/NavBar';
import ProductInfoMarketAuction from './Sections/ProductInfoMarketAuction';
import moment from 'moment';

function ProductPageOwn(props) {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const productId = props.match.params.productId;
  const [Product, setProduct] = useState([]);
  const [User, setUser] = useState('');
  const [Username, setUsername] = useState('');
  const [UserId, setUserId] = useState('');
  const [Role, setRole] = useState('');
  const [CreatorMoney, setCreatorMoney] = useState(0);
  const [showCard, setShowCard] = useState(true);
  const [isShown] = useState(true);
  const [edition, setEdition] = useState('');
  const [ownerId, setOwnerId] = useState(0);
  const [owner, setOwner] = useState(false);
  const [guideStep, setGuideStep] = useState('');
  const { singleItem, bidSuccess } = useSelector((state) => state.product);

  const { confirm, ownedEditions, editions, mintInfo, marketBid } = useSelector(
    (state) => state.view
  );

  const { _id, introCardGuide, introCardGuideTracker } = useSelector(
    (state) => state.user.userData
  );
  const progressTracker = useSelector(
    (state) => state.user.introCardGuideTracker
  );
  useEffect(() => {
    if (progressTracker && introCardGuideTracker && introCardGuide) {
      setGuideStep(introCardGuideTracker);
      if (guideStep !== '') {
        dispatch(trackCardTour(false));
      }
    }
  }, [progressTracker, introCardGuideTracker, introCardGuide]);

  useEffect(() => {
    if (introCardGuideTracker && introCardGuide && Product.introCard) {
      if (guideStep === 2) {
        dispatch(setEditionsOpen(true));
      }
      if (guideStep === 4) {
        dispatch(setOwnedEditionsOpen(true));
      }
      if (guideStep === 6) {
        dispatch(setMintInfo(true));
      }
      if (guideStep === 8) {
        dispatch(setConfirm(true));
      }
    }
  }, [guideStep, introCardGuide]);

  useEffect(() => {
    console.log(bidSuccess);
    dispatch(getSingleProduct(productId));

    // eslint-disable-next-line
    setEdition(window.location.pathname.split('/')[3] - 1);
  }, [window.location.pathname, bidSuccess]);

  // WILL EVENTUALLY REFACTOR ALONG WITH CARD3 + PRODUCTINFO

  useEffect(() => {
    if (singleItem) {
      setProduct(singleItem);
      setUsername(singleItem.writer.username);
      setUser(singleItem.writer);
      setUserId(singleItem.writer._id);
      setCreatorMoney(singleItem.writer.money.$numberDecimal);
      setRole(singleItem.writer.role);
    }
  }, [singleItem, marketBid]);

  const addToCartHandler = (productId) => {
    dispatch(addToCart(productId));
  };
  useEffect(() => {
    if (introCardGuide && Product.introCard) {
      if (
        (guideStep === 1 && editions === true) ||
        (guideStep === 2 && editions === false)
      ) {
        setGuideStep((guideStep) => guideStep + 1);
      }
    }
  }, [editions, introCardGuide]);

  useEffect(() => {
    if (introCardGuide && Product.introCard) {
      if (
        (guideStep === 3 && ownedEditions === true) ||
        (guideStep === 4 && ownedEditions === false)
      ) {
        setGuideStep((guideStep) => guideStep + 1);
      }
    }
  }, [ownedEditions, introCardGuide]);

  useEffect(() => {
    if (introCardGuide && Product.introCard) {
      if (
        (guideStep === 5 && mintInfo === true) ||
        (guideStep === 6 && mintInfo === false)
      ) {
        setGuideStep((guideStep) => guideStep + 1);
      }
    }
  }, [mintInfo, introCardGuide]);

  useEffect(() => {
    if (introCardGuide && Product.introCard) {
      if (guideStep === 7 && confirm === true) {
        setGuideStep((guideStep) => guideStep + 1);
      }
    }
  }, [confirm, introCardGuide]);
  useEffect(() => {
    if (Product.editions) {
      setOwnerId(
        Product.editions[edition].history[
          Product.editions[edition].history.length - 1
        ].owner
      );
    }
  }, [Product, edition]);

  useEffect(() => {
    if (ownerId === _id) {
      setOwner(true);
    }
  }, [ownerId]);

  return (
    <>
      {introCardGuide && Product.introCard && (
        <>
          <NavBar tour={introCardGuide} />
          <>
            {guideStep !== 2 && guideStep !== 4 && guideStep !== 8 && (
              <div className='tour'></div>
            )}
          </>
          <div className='tour__bar'>
            <button
              className='tour__button tour__button--next'
              onClick={() => {
                if (
                  guideStep === introCardGuideTracker &&
                  introCardGuideTracker < 8
                ) {
                  dispatch(incrementCardTour());
                }

                guideStep === 1 && dispatch(setEditionsOpen(true));
                guideStep === 2 && dispatch(setEditionsOpen(false));
                guideStep === 3 && dispatch(setOwnedEditionsOpen(true));
                guideStep === 4 && dispatch(setOwnedEditionsOpen(false));
                guideStep === 5 && dispatch(setMintInfo(true));
                guideStep === 6 && dispatch(setMintInfo(false));

                guideStep === 7 && dispatch(setConfirm(true));
                guideStep === 8 && dispatch(setConfirm(false));

                guideStep !== 8 && setGuideStep((guideStep) => guideStep + 1);

                guideStep === 8 && dispatch(endCardTour());
                setTimeout(() => {
                  guideStep === 8 && window.location.reload();
                }, 300);
              }}
            >
              {guideStep === 8 ? 'Finish' : 'Next'}
            </button>

            {guideStep > 1 && (
              <button
                onClick={() => {
                  if (introCardGuide && Product.introCard) {
                    guideStep === 2 && dispatch(setEditionsOpen(false));
                    guideStep === 3 && dispatch(setEditionsOpen(true));
                    guideStep === 4 && dispatch(setOwnedEditionsOpen(false));
                    guideStep === 5 && dispatch(setOwnedEditionsOpen(true));
                    guideStep === 6 && dispatch(setMintInfo(false));
                    guideStep === 7 && dispatch(setMintInfo(true));
                    guideStep === 8 && dispatch(setConfirm(false));
                    setGuideStep((guideStep) => guideStep - 1);
                  }
                }}
                className='tour__button tour__button--previous'
              >
                Previous
              </button>
            )}

            {guideStep !== 8 && (
              <button
                className='tour__button tour__button--skip'
                onClick={() => props.history.push(`/collection/${_id}`)}
              >
                Skip
              </button>
            )}
            <div className='tour__text'>
              <h3 className='tour__text--step'>
                Collected NFTs - {guideStep}/8
              </h3>
              <h3 className='tour__text--description'>
                {guideStep === 1
                  ? 'View Editions'
                  : guideStep === 2
                  ? 'Exit Editions'
                  : guideStep === 3
                  ? 'View Your Editions'
                  : guideStep === 4
                  ? 'Exit Editions'
                  : guideStep === 5
                  ? 'Mint NFT'
                  : guideStep === 6
                  ? 'Exit Mint NFT'
                  : guideStep === 7
                  ? 'Add to Marketplace'
                  : 'Exit add to Marketplace'}
              </h3>
              <h3
                style={{ minHeight: '1.8rem' }}
                className='tour__text--description'
              >
                {guideStep === 1
                  ? 'Select "Editions" to see the other edition in the collection'
                  : guideStep === 2 || guideStep === 4 || guideStep === 6
                  ? ''
                  : guideStep === 3
                  ? `Select "${Username} Editions" to see the other editions you own`
                  : guideStep === 5
                  ? 'Learn more about the minting process'
                  : guideStep === 7
                  ? 'Here a user can resell their owned NFT in the marketplace'
                  : ''}
              </h3>
            </div>
          </div>
        </>
      )}
      <div
        className='product'
        style={{
          marginTop: introCardGuide && '15rem',
        }}
      >
        {Product.unlockable && (
          <div className='product__card-or-unlock'>
            <div className='product__card-or-unlock-inner'>
              <p
                className={
                  showCard
                    ? 'product__tab product__tab--active'
                    : 'product__tab'
                }
                onClick={() => setShowCard(true)}
              >
                Public
              </p>
              {owner ? (
                <p
                  className={
                    !showCard
                      ? 'product__tab product__tab--1 product__tab--active'
                      : 'product__tab product__tab--1'
                  }
                  onClick={() => setShowCard(false)}
                >
                  Unlocked Content
                </p>
              ) : (
                <svg className='product__unlock-emoji'>
                  <use href={sprite + '#lock'}></use>
                </svg>
              )}
            </div>
          </div>
        )}
        {Product.unlockable && !showCard && owner && (
          <p
            className='product__unlockable-text'
            style={{ gridRow: '2/3', gridColumn: '1/2' }}
          >
            {Product.unlockableText}
          </p>
        )}
        <div className='product__card'>
          {showCard ? (
            <Card3d
              product={Product}
              writer={Username}
              role={Role}
              overflow={isShown}
            />
          ) : (
            <UnlockableContent product={Product} />
          )}
        </div>
        {Product.editions &&
        Product.editions[edition].history &&
        Product.editions[edition].auction ? (
          // Product.editions[edition].history[
          //   Product.editions[edition].history.length - 1
          // ].owner !== _id &&
          // moment(Product.editions[props.edition].auctionStartDate) >
          //   moment(Date.now())
          <ProductInfoMarketAuction
            addToCart={addToCartHandler}
            detail={Product}
            writer={Username}
            userId={UserId}
            edition={edition}
            guideStep={guideStep}
            CreatorMoney={CreatorMoney}
            history={props.history}
            collection='own'
          />
        ) : (
          <ProductInfoOwn
            addToCart={addToCartHandler}
            detail={Product}
            writer={Username}
            userId={UserId}
            guideStep={guideStep}
            CreatorMoney={CreatorMoney}
            history={props.history}
            collection='own'
          />
        )}
      </div>
    </>
  );
}

export default ProductPageOwn;
