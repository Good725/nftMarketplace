import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';
import Auth from '../hoc/auth';
// pages for this product
import './App.scss';
import FollowersPage from './views/FollowersPage/FollowersPage';
import FollowingPage from './views/FollowingPage/FollowingPage';
import ForgotPasswordPage from './views/ForgotPasswordPage/ForgotPasswordPage.js';
import GuidelinesPage from './views/GuidelinesPage/GuidelinesPage';
import LandingPage from './views/LandingPage/LandingPage.js';
import LoginAfterRegisterPage from './views/LoginAfterRegisterPage/LoginAfterRegisterPage.js';
import AdminPage from './views/AdminPage/AdminPage';
import LoginPage from './views/LoginPage/LoginPage.js';
import MarketplacePage from './views/MarketPlacePage/MarketplacePage';
import NavBar from './views/NavBar/NavBar';
import OtherFollowersPage from './views/OtherFollowersPage/OtherFollowersPage';
import OtherFollowingPage from './views/OtherFollowingPage/OtherFollowingPage';
import PrivacyPolicyPage from './views/PrivacyPolicyPage/PrivacyPolicyPage';
import ProductPage from './views/ProductPage/ProductPage';
import ProfileCollectionPage from './views/ProfileCollectionPage/ProfileCollectionPage';
import ProfileShopPage from './views/ProfileShopPage/ProfileShopPage';
import RegisterPage from './views/RegisterPage/RegisterPage.js';
import SearchPage from './views/SearchPage/SearchPage';
import Terms from './views/TermsPage/TermsPage';
import UploadProductPage from './views/UploadProductPage/UploadProductPage';
import BuyCardPage from './views/BuyCard/BuyCardPage';
import BuyPackPage from './views/BuyPack/BuyPackPage';
import SettingsPage from './views/SettingsPage/SettingsPage';
import CreateWeb from './views/UploadProductPage/Sections/CreateWeb';
import useInterval from '../hoc/useInterval';
import {
  getAllAuctions,
  auctionOver,
  getAllMarketAuctions,
  marketAuctionOver,
} from '../_actions/product_actions';
import { getGasPrices } from '../_actions/web3_actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import io from 'socket.io-client';
import CreatePack from './views/UploadProductPage/Sections/CreatePack';
import ProductPageOwn from './views/ProductPage/ProductPageOwn';
import ProfileMarketPage from './views/ProfileMarketPage/ProfileMarketPage';
import FreeNFT from './views/FreeNFT/FreeNFT';
import { useWeb3Modal } from '../hooks';
import ScrollToTop from '../hoc/ScrollToTop';
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  const dispatch = useDispatch();
  const allAuctions = useSelector((state) => state.product.allAuctions);
  const allMarketAuctions = useSelector(
    (state) => state.product.allMarketAuctions
  );
  const auctionFinished = useSelector((state) => state.product.auctionFinished);
  const marketAuctionFinished = useSelector(
    (state) => state.product.marketAuctionFinished
  );
  const [socket, setSocket] = useState();
  const [run, setRun] = useState(0);
  const [run2, setRun2] = useState(0);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal(); // needed for network or account changes

  useEffect(() => {
    // axios.get('/api/users/unique');
    dispatch(getAllAuctions());
    dispatch(getAllMarketAuctions());
    dispatch(getGasPrices());
    // CONNECTING CLIENT TO SOCKET
    if (process.env.NODE_ENV === 'development') {
      const s = io('http://localhost:3001');
      setSocket(s);
    } else if (process.env.NODE_ENV === 'production') {
      const s = io('https://beta-dbilia.app');
      setSocket(s);
    }
    if (socket) {
      console.log('hello');
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useInterval(() => {
    allAuctions &&
      allAuctions.length > 0 &&
      allAuctions.forEach((product) => {
        if (
          (moment(Date.now()) > moment(product.auctionDeadline) &&
            !product.auctionFinished) ||
          (moment(Date.now()) > moment(product.auctionDeadline) &&
            product.auctionHistory.length > 0)
        ) {
          if (run === 0 && socket) {
            const object = {
              _id: socket.id,
              product,
            };
            socket.emit('set', object);
            const number = auctionFinished + 1;
            dispatch(auctionOver(number));
            setRun((run) => run + 1);
          }
        }
      });
  }, 5000);

  useInterval(() => {
    allMarketAuctions &&
      allMarketAuctions.length > 0 &&
      allMarketAuctions.forEach((editionObject) => {
        if (
          moment(Date.now()) > moment(editionObject.auctionDeadline) &&
          editionObject.auctionHistory.length > 0
        ) {
          console.log('true');
          if (run2 === 0 && socket) {
            const object = {
              _id: socket.id,
              editionObject,
            };
            socket.emit('set2', object);
            const number = marketAuctionFinished + 1;
            dispatch(marketAuctionOver(number));
            setRun2((run2) => run2 + 1);
          }
        }
      });
  }, 5000);
  useInterval(() => {
    dispatch(getGasPrices());
  }, 1800000); // run every 30 min in testing environment

  window.ethereum &&
    window.ethereum.on('chainChanged', async () => {
      window.location.reload();
    });

  window.ethereum &&
    window.ethereum.on('accountsChanged', async () => {
      window.location.reload();
    });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <div
        style={{
          // backgroundImage: `url('/marble.png')`,
          paddingTop: '69px',
          // minHeight: 'calc(100vh - 80px)',
        }}
      >
        <ScrollToTop>
          <Switch>
            {/* ALWAYS AVAILABLE ROUTES */}
            <Route exact path='/' component={Auth(LandingPage, null)} />
            <Route
              exact
              path='/product/upload'
              component={Auth(UploadProductPage, null)}
            />
            <Route
              exact
              path='/createPack'
              component={Auth(CreatePack, null)}
            />
            <Route
              exact
              path='/product/:productId'
              component={Auth(ProductPage, null)}
            />
            <Route
              exact
              path='/product/:productId/:edition'
              component={Auth(ProductPageOwn, null)}
            />

            <Route exact path='/createCard' component={Auth(CreateWeb, true)} />

            <Route
              exact
              path='/buyPack/:packId'
              component={Auth(BuyPackPage, null)}
            />
            <Route exact path='/search' component={Auth(SearchPage, null)} />
            <Route
              exact
              path='/marketplace'
              component={Auth(MarketplacePage, null)}
            />
            <Route
              exact
              path='/buy/:productId'
              component={Auth(BuyCardPage, null)}
            />
            <Route
              exact
              path='/user/collection/followerspage'
              component={Auth(FollowersPage, null)}
            />
            <Route
              exact
              path='/user/collection/followingpage'
              component={Auth(FollowingPage, null)}
            />
            <Route
              exact
              path='/user/followerspage/:userId'
              component={Auth(OtherFollowersPage, null)}
            />
            <Route exact path='/freeNFT' component={Auth(FreeNFT, true)} />
            <Route
              exact
              path='/user/followingpage/:userId'
              component={Auth(OtherFollowingPage, null)}
            />
            <Route
              exact
              path='/yourMarket/:userId'
              component={Auth(ProfileMarketPage, 'optional')}
            />
            <Route
              exact
              path='/collection/:userId'
              component={Auth(ProfileCollectionPage, 'optional')}
            />
            <Route
              exact
              path='/shop/:userId'
              component={Auth(ProfileShopPage, 'optional')}
            />

            {/* ONLY UNAUTHORIZED ROUTES */}

            <Route exact path='/login' component={Auth(LoginPage, false)} />
            <Route
              exact
              path='/newlogin'
              component={Auth(LoginAfterRegisterPage, false)}
            />
            <Route
              exact
              path='/reset_user'
              component={Auth(ForgotPasswordPage, false)}
            />
            <Route
              exact
              path='/privacypolicy'
              component={Auth(PrivacyPolicyPage, false)}
            />
            <Route
              exact
              path='/guidelines'
              component={Auth(GuidelinesPage, false)}
            />
            <Route
              exact
              path='/settings'
              component={Auth(SettingsPage, true)}
            />
            <Route
              exact
              path='/register'
              component={Auth(RegisterPage, false)}
            />
            <Route exact path='/terms' component={Auth(Terms, false)} />

            {/* AUTHENTICATED ONLY ROUTES */}
            <Route exact path='/adminpage' component={Auth(AdminPage, true)} />
          </Switch>
        </ScrollToTop>
      </div>
      {/* <Footer /> */}
    </Suspense>
  );
}

export default App;
