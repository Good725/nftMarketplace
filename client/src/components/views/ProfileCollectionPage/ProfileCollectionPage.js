import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import UserCardBlock from './Sections/UserCardBlock';
import { useDispatch, useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';
import ProfileDisplay from '../../utils/ProfileDisplay';

import useWindowDimensions from '../NavBar/Sections/ScreenWidth';
import {
  getCartItems,
  getProfileUser,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
} from '../../../_actions/user_actions';

function ProfileCollectionPage(props) {
  const dispatch = useDispatch();
  const userId = props.match.params.userId;

  const [progressBar, setProgressBar] = useState(0);
  const [level, setLevel] = useState(0);
  // ARE WE FOLLOWING THE USERS PROFILE WE ARE ON
  const [currentlyFollowing, setCurrentlyFollowing] = useState(false);
  // ARE WE ON THE LOGGED IN USERS PAGE
  const [usersPage, setUsersPage] = useState(false);
  const [itemIds, setItemIds] = useState([]);

  // REDUX STATE///
  const user = useSelector((state) => state.user.userData);
  const profileProductsArray = useSelector((state) => state.user.cartDetail);
  const profile = useSelector((state) => state.user.profileUser);
  const { collectionProducts, collectionPage } = useSelector(
    (state) => state.infinite
  );
  const handleFollow = () => {
    // eslint-disable-next-line
    dispatch(addFollowing(userId));
    dispatch(addFollower(userId));
    window.location.reload();
  };

  const handleUnFollow = () => {
    dispatch(removeFollowing(userId));
    dispatch(removeFollower(userId));
    window.location.reload();
  };
  useEffect(() => {
    // REDIRECTING USER IF NO ONE IS LOGGED IN
    if (userId && collectionPage < 2) {
      dispatch(getProfileUser(userId));
    }

    // ARE WE ON LOGGED IN USERS PROFILE
    if (user._id === userId) {
      setUsersPage(true);
      // dispatch(updateLevel(level));
    }

    // eslint-disable-next-line
  }, [userId, collectionProducts]);

  let cartItems = [];
  useEffect(() => {
    if (profile) {
      // GETTING THE PRODUCT OBJECT IDS FOR EACH ITEM IN THE USERS COLLECTION
      profile.cart.forEach((item) => {
        cartItems.push(item.id);
      });
      // GETTING ARRAY OF USERS COLLECTION ITEMS
      setItemIds(cartItems);
      // dispatch(getCartItems(cartItems, profile.cart, true));

      // SETTING USERS LEVEL REACHED BASED ON # OF CARDS

      profile.followers.forEach((item) => {
        if (item.id === user._id) {
          setCurrentlyFollowing(true);
        }
      });
    }
    // eslint-disable-next-line
  }, [profile]);

  useEffect(() => {
    if (profileProductsArray.length > 0) {
      let total = 0;
      // eslint-disable-next-line
      profileProductsArray.map((item) => {
        total += parseInt(item.price, 10) * item.numberEditions;
      });

      let progress = total % 100;

      let level = (total - progress) / 100;

      setProgressBar(progress);

      setLevel(level);
    }
  }, [profileProductsArray]);

  return (
    <>
      <div className=''>
        <ProfileDisplay
          userId={userId}
          progressBar={progressBar}
          level={level}
          usersPage={usersPage}
          usersPage={usersPage}
          handleFollow={handleFollow}
          handleUnFollow={handleUnFollow}
          history={props.history}
          currentlyFollowing={currentlyFollowing}
        />
        <div className='landing__container'>
          <div className='feed'>
            <UserCardBlock
              products={profileProductsArray}
              history={props.history}
              usersPage={usersPage}
              itemIds={itemIds}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileCollectionPage;
