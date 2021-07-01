import React, { useEffect, useState } from 'react';

import { Modal } from 'antd';
import UserCardBlockShop from './Sections/UserCardBlockShop';
import { useDispatch, useSelector } from 'react-redux';
import ProfileDisplay from '../../utils/ProfileDisplay';

import {
  getCartItems,
  getShopItems,
  getProfileUser,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  endCreateTour,
} from '../../../_actions/user_actions';
import { getProfileShopPacks } from '../../../_actions/pack_actions';
import UserPackShop from './Sections/UserPackShop';
import NavBar from '../NavBar/NavBar';
function ProfileShopPage(props) {
  const [revProducts, setRevProducts] = useState([]);
  const [itemIds, setItemIds] = useState([]);

  const [progressBar, setProgressBar] = useState(0);
  const userId = props.match.params.userId;

  const [usersPage, setUsersPage] = useState(false);
  const dispatch = useDispatch();
  const [level, setLevel] = useState(0);
  const [run, setRun] = useState(0);

  const [currentlyFollowing, setCurrentlyFollowing] = useState(false);
  const [CoinsVisible, setCoinsVisible] = useState(false);

  const user = useSelector((state) => state.user.userData);
  const profileShopPacks = useSelector((state) => state.pack.profileShopPacks);
  const profileProductsArray = useSelector((state) => state.user.cartDetail);
  const profile = useSelector((state) => state.user.profileUser);
  const shopDetail = useSelector((state) => state.user.shopDetail);
  const handleCloseCoinsVisable = () => {
    setCoinsVisible(false);
  };

  const handleFollow = () => {
    dispatch(addFollowing(userId));
    dispatch(addFollower(userId));
    window.location.reload();
  };

  const calculateLevel = (cartDetail) => {
    let total = 0;
    // eslint-disable-next-line
    cartDetail.map((item) => {
      total += parseInt(item.price, 10) * item.numberEditions;
    });

    let progress = total % 100;
    let level = (total - progress) / 100;

    setProgressBar(progress);

    setLevel(level);
  };

  const handleUnFollow = () => {
    dispatch(removeFollowing(userId));
    dispatch(removeFollower(userId));
    window.location.reload();
  };

  useEffect(() => {
    dispatch(getProfileUser(userId));
    // ARE WE ON LOGGED IN USERS PROFILE

    if (user._id === userId) {
      setUsersPage(true);
    }

    // eslint-disable-next-line
  }, [props.user.userData]);

  let shopItems = [];

  useEffect(() => {
    if (run < 2) {
      if (profile) {
        profile.followers.forEach((item) => {
          if (item.id === user._id) {
            setCurrentlyFollowing(true);
          }
        });
        profile.shop.forEach((item) => {
          shopItems.push(item.id);
        });
        setItemIds(shopItems);
      }
      setRun((run) => run + 1);
    }
    // eslint-disable-next-line
  }, [profile]);

  return (
    <div style={{ width: '100%', backgroundColor: '#f6f6f6' }}>
      <div
        style={{
          marginTop: user._id === profile._id && user.firstLogin && '10rem',
        }}
      >
        <ProfileDisplay
          userId={userId}
          progressBar={progressBar}
          level={level}
          usersPage={usersPage}
          history={props.history}
          handleFollow={handleFollow}
          handleUnFollow={handleUnFollow}
          currentlyFollowing={currentlyFollowing}
        />
        <div>
          {profileShopPacks && profileShopPacks.length > 0 && (
            <UserPackShop packs={profileShopPacks} />
          )}
        </div>

        <div className='landing__container'>
          <div className='feed'>
            <UserCardBlockShop
              itemIds={itemIds}
              products={shopDetail}
              history={props.history}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileShopPage;
