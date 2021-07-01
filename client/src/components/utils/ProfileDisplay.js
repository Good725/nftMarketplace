import React, { useState, useEffect } from 'react';
import { Progress, Button } from 'antd';
import EditProfile from '../views/SettingsPage/Sections/EditProfile';
import { useSelector, useDispatch } from 'react-redux';
import {
  auth,
  endTour,
  incrementTour,
  setProfileSection,
  trackTour,
} from '../../_actions/user_actions';
import sprite from '../../img/sprite.svg';
import { Link } from 'react-router-dom';
import NavBar from '../views/NavBar/NavBar';
import useWindowDimensions from '../views/NavBar/Sections/ScreenWidth';

function ProfileDisplay({
  userId,
  progressBar,
  level,
  usersPage,
  handleFollow,
  handleUnFollow,
  currentlyFollowing,
  history,
}) {
  // SETTING REDUX STATE
  const profile = useSelector((state) => state.user.profileUser);
  const user = useSelector((state) => state.user.userData);
  const firstLoginTracker = useSelector(
    (state) => state.user.firstLoginTracker
  );
  const dispatch = useDispatch();
  // LOCAL STATE FOR ADDING COMMAS TO FOLLOWERS //
  const [formattedFollowers, setFormattedFollowers] = useState('');
  const [formattedFollowing, setFormattedFollowing] = useState('');
  const [guideStep, setGuideStep] = useState('');
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const [initial, setInitial] = useState(true);
  // SETTING FOLLOWERS AND FOLLOWING FORMAT NUMBERS

  useEffect(() => {
    if (
      user._id === profile._id &&
      user.firstLogin &&
      user.firstLoginTracker &&
      firstLoginTracker
    ) {
      console.log('tour');
      setGuideStep(user.firstLoginTracker);
      guideStep === 1 && history.push(`/collection/${user._id}`);
      guideStep === 2 && history.push(`/shop/${user._id}`);
      guideStep === 3 && history.push(`/yourMarket/${user._id}`);
      guideStep === 4 && history.push(`/settings`);
      guideStep === 5 && history.push(`/freeNft`);
      if (guideStep !== '') {
        dispatch(trackTour(false));
      }
    }
  }, [firstLoginTracker, user.firstLoginTracker, guideStep, profile]);

  useEffect(() => {
    if (
      user._id === profile._id &&
      !firstLoginTracker &&
      guideStep === '' &&
      user.firstLogin
    ) {
      window.location.pathname.split('/')[1] === 'collection'
        ? setGuideStep(1)
        : window.location.pathname.split('/')[1] === 'shop'
        ? setGuideStep(2)
        : setGuideStep(3);
    }
  }, []);
  useEffect(() => {
    if (profile) {
      setFormattedFollowers(profile.followers.length.toLocaleString());
      setFormattedFollowing(profile.following.length.toLocaleString());
    }
  }, [profile]);

  const handleSectionChange = (e) => {
    dispatch(setProfileSection(e.target.textContent));
  };
  useEffect(() => {}, [user.firstLoginTracker]);

  return (
    <>
      {' '}
      {user.firstLogin && user._id === profile._id && (
        <>
          <NavBar tour={user.firstLogin} guideStep={guideStep} />

          <div className='tour__bar'>
            <button
              className='tour__button tour__button--next'
              onClick={() => {
                setGuideStep((guideStep) => guideStep + 1);
                guideStep === 1 && history.push(`/shop/${user._id}`);
                guideStep === 2 && history.push(`/yourMarket/${user._id}`);
                guideStep === 3 && history.push(`/settings`);
                if (guideStep >= user.firstLoginTracker) {
                  dispatch(incrementTour());
                }
              }}
            >
              Next
            </button>

            {guideStep > 1 && (
              <button
                onClick={() => {
                  setGuideStep((guideStep) => guideStep - 1);
                  guideStep === 2 && history.push(`/collection/${user._id}`);
                  guideStep === 3 && history.push(`/shop/${user._id}`);
                }}
                className='tour__button tour__button--previous'
              >
                Previous
              </button>
            )}

            <button
              className='tour__button tour__button--skip'
              onClick={() => history.push('/freeNFT')}
            >
              Skip
            </button>
            <div className='tour__text'>
              <h3 className='tour__text--step'>
                Profile Guide - {guideStep}/4
              </h3>
              <h3 className='tour__text--description'>
                {guideStep === 1
                  ? 'This is your Collection Page'
                  : guideStep === 2
                  ? 'This is your Created Page'
                  : 'This is your For Sale Page'}
              </h3>
              <h3 className='tour__text--description'>
                {guideStep === 1
                  ? 'The NFTs you own will be showcased here'
                  : guideStep === 2
                  ? 'The NFTs you create will be showcased here'
                  : 'The NFTs you put up for sale on the marketplace will appear here'}
              </h3>
            </div>
          </div>
        </>
      )}
      <div
        style={{
          marginTop: user._id === profile._id && user.firstLogin && '15rem',
        }}
      >
        {profile !== false && (
          <div className='profile'>
            <div className='profile__section-1'>
              <div className='profile__image-section'>
                <img
                  alt='image1'
                  src={profile.image}
                  className='profile__image'
                />
                {/* User Name */}
              </div>

              {/* User Bio */}

              <div className='profile__information'>
                {/* User Cards */}
                <div className='profile__row-1'>
                  <h1 className='profile__name'> {profile.username}</h1>
                  {profile.role === 2 ? (
                    <img
                      src='/verifiedIcon.svg'
                      className='profile__verified-icon '
                      alt='image1'
                    />
                  ) : null}
                  <div className='profile__follow-button-section'>
                    <div>
                      {usersPage ? (
                        <>
                          <div className='profile__follow-button'>
                            <Link
                              to='/settings'
                              page='edit'
                              disabled={user.firstLogin && guideStep !== 3}
                              style={{
                                cursor:
                                  user.firstLogin && guideStep !== 3 && 'auto',
                              }}
                              className='profile__follow-button'
                            >
                              Settings
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className='profile__follow-button'>
                          {currentlyFollowing ? (
                            <button
                              className='profile__follow-button'
                              onClick={handleUnFollow}
                            >
                              Unfollow
                            </button>
                          ) : (
                            <button
                              className='profile__follow-button'
                              onClick={handleFollow}
                            >
                              Follow
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <>
                    {user.firstLogin && guideStep === 3 && (
                      <svg className='tour__arrow tour__arrow--profile'>
                        <use href={sprite + '#arrow'}></use>
                      </svg>
                    )}
                  </>
                </div>
                <div className='profile__row-2'>
                  <h3 className='profile__row-2-text'>
                    <strong>{profile.cart.length}</strong> NFTs
                  </h3>
                  <a href={`/user/followerspage/${userId}`}>
                    <h3 className='profile__row-2-text'>
                      <strong>{formattedFollowers}</strong> Followers
                    </h3>
                  </a>
                  <a href={`/user/followingpage/${userId}`}>
                    <h3 className='profile__row-2-text'>
                      <strong>{formattedFollowing}</strong> Following
                    </h3>
                  </a>
                </div>
                <div className='profile__row-3'>
                  <h1 className='profile__name profile__name--2'>
                    {' '}
                    {profile.fullname.split('').length > 30
                      ? `${profile.fullname.split('').slice(0, 30).join('')}...`
                      : profile.fullname}
                  </h1>
                  {profile.role === 2 ? (
                    <img
                      src='/verifiedIcon.svg'
                      alt='image1'
                      className='profile__verified-icon profile__verified-icon--1'
                    />
                  ) : null}
                </div>
                {/* Edit profile/ Follow/Unfollow Button */}
                {/* <div className='profile__row-4'>
                <p className='profile__text'>Athlete</p>
              </div> */}
                <div className='profile__row-5'>
                  <p className='profile__text'>{profile.accountCategory}</p>
                  <p className='profile__text'>{profile.bio}</p>
                </div>
                {/* PUT METAMASK BUTTON HERE */}
              </div>
            </div>

            <div className='profile__links-section'>
              <a
                className={
                  window.location.pathname.split('/')[1] === 'collection'
                    ? 'profile__link profile__link--active'
                    : user.firstLogin && guideStep === 3
                    ? 'profile__link profile__link--no-hover'
                    : 'profile__link'
                }
                onClick={() => {
                  guideStep === 2 && history.push(`/collection/${userId}`);
                  guideStep === 2 && setGuideStep((guideStep) => guideStep - 1);
                }}
                href={
                  (user._id !== profile._id || !user.firstLogin) &&
                  `/collection/${userId}`
                }
              >
                Collection
              </a>
              <a
                className={
                  window.location.pathname.split('/')[1] === 'shop'
                    ? 'profile__link profile__link--active'
                    : 'profile__link'
                }
                onClick={() => {
                  (guideStep === 1 || guideStep === 3) &&
                    history.push(`/shop/${user._id}`);
                  guideStep === 1 && setGuideStep((guideStep) => guideStep + 1);
                  guideStep === 3 && setGuideStep((guideStep) => guideStep - 1);
                }}
                href={
                  (user._id !== profile._id || !user.firstLogin) &&
                  `/shop/${userId}`
                }
              >
                Created
              </a>

              <a
                className={
                  window.location.pathname.split('/')[1] === 'yourMarket'
                    ? 'profile__link profile__link--active'
                    : user._id === profile._id &&
                      user.firstLogin &&
                      guideStep !== 2
                    ? 'profile__link profile__link--no-hover'
                    : 'profile__link'
                }
                onClick={() => {
                  guideStep === 2 && history.push(`/yourMarket/${userId}`);
                  guideStep === 2 && setGuideStep((guideStep) => guideStep + 1);
                }}
                href={
                  (user._id !== profile._id || !user.firstLogin) &&
                  `/yourMarket/${userId}`
                }
              >
                For Resale
              </a>
            </div>
            <div className='tour__link-arrows'>
              {profile._id === user._id && user.firstLogin && guideStep !== 3 && (
                <svg
                  className={
                    guideStep === 1
                      ? 'tour__arrow '
                      : 'tour__arrow tour__arrow--sale'
                  }
                >
                  <use href={sprite + '#arrow-up'}></use>
                </svg>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileDisplay;
// get app to a place where we can bring people on
// getting people set up with their profiles
// take away everything that isnt ready
// buying of cards wont be ready
// mute everything except peoples profiles, and ability to make cards
//edit profile to settings
// in that section, click the wallet tab, usd wallet and eth wallet, kept separte
// add coins to wallet
//approve people to be verified
