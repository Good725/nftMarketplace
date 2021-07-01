import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setNavOpen } from '../../../../_actions/in_view_actions';
import navBarButton from '../Sections/icons/navBarButton.png';
import { USER_SERVER } from '../../../Config';
import sprite from '../../../../img/sprite.svg';
import axios from 'axios';
import logo from '../../../../img/BACK CREATORSAlpha.png';

import SearchBar from './SearchBar';
import useWindowDimensions from './ScreenWidth';
function NavCollapse({ history, tour }) {
  const dispatch = useDispatch();
  const navOpen = useSelector((state) => state.view.navOpen);
  const node = useRef();
  const UserData = useSelector((state) => state.user.userData);
  const [UserId, setUserId] = useState(0);
  const [searching, setSearching] = useState(false);
  const { width } = useWindowDimensions();
  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick); // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      return;
    } // outside click
    dispatch(setNavOpen(false));
  };
  useEffect(() => {
    if (UserData) {
      setUserId(UserData._id);
    }
  }, [UserData]);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        history.push('/login');
      } else {
        alert('Log Out Failed');
      }
    });
  };
  return (
    <div ref={node}>
      {!searching ? (
        <nav
          className='nav-bar nav-bar--collapse'
          style={{
            top: tour && '15rem',
            zIndex: tour && navOpen ? '20000' : tour && 2000,
          }}
        >
          <a className='nav-bar__logo' href='/'>
            <img
              className='nav-bar__logo--item'
              src='/DbiliaLogoNameLong.png'
              alt='navbar'
              alt='navbar'
            />
          </a>
          <div className='navigation' style={{ zIndex: tour && '20000' }}>
            <>
              <div
                className='navigation__icon-section'
                style={{ transform: tour && navOpen && 'translateY(-15rem)' }}
              >
                {!navOpen && (
                  <div className='navigation__search-icon-section'>
                    <svg
                      className='navigation__search-icon'
                      onClick={() => {
                        setSearching(true);
                      }}
                    >
                      <use href={sprite + '#search'}></use>
                    </svg>
                  </div>
                )}
                <div className='navigation__expand-icon-section'>
                  {navOpen ? (
                    <svg
                      className={
                        navOpen
                          ? 'navigation__close navigation__close--active'
                          : 'navigation__close'
                      }
                      onClick={() => dispatch(setNavOpen(!navOpen))}
                    >
                      <use href={sprite + '#close'}></use>
                    </svg>
                  ) : (
                    <svg
                      className='navigation__icon--1'
                      onClick={() => dispatch(setNavOpen(!navOpen))}
                    >
                      <use href={sprite + '#nav-expand'}></use>
                    </svg>
                  )}
                </div>
              </div>
              <div
                className={
                  navOpen
                    ? 'navigation__background navigation__background__active'
                    : 'navigation__background'
                }
                ref={node}
              ></div>
              <nav
                className='navigation__nav'
                style={{
                  opacity: navOpen ? '1' : '0',
                  width: navOpen ? '50%' : '0%',
                  transition: ' all 0.8s ;',
                }}
              >
                <ul className='navigation__list'>
                  <li className='navigation__item'>
                    <NavLink
                      smooth='true'
                      onClick={() => dispatch(setNavOpen(false))}
                      to='/'
                      className='navigation__link'
                      style={{
                        opacity: !navOpen && 0,
                        // backgroundImage:
                        //   width < 600
                        //     ? 'linear-gradient(120deg, transparent 0%,transparent 50%,transparent 50%)'
                        //     : 'linear-gradient(120deg, transparent 0%,transparent 50%,#fff 50%)',
                      }}
                    >
                      Home
                    </NavLink>
                  </li>
                  <li className='navigation__item'>
                    <NavLink
                      smooth='true'
                      onClick={() => dispatch(setNavOpen(false))}
                      to='/marketplace'
                      className='navigation__link'
                      style={{
                        opacity: !navOpen && 0,
                      }}
                    >
                      Marketplace
                    </NavLink>
                  </li>
                  <li className='navigation__item'>
                    <NavLink
                      smooth='true'
                      onClick={() => dispatch(setNavOpen(false))}
                      to={`/createCard`}
                      className='navigation__link'
                      style={{
                        opacity: !navOpen && 0,
                      }}
                    >
                      Create
                    </NavLink>
                  </li>
                  <li className='navigation__item'>
                    <NavLink
                      smooth='true'
                      onClick={() => dispatch(setNavOpen(false))}
                      to={UserData.isAuth ? `/collection/${UserId}` : '/login'}
                      className='navigation__link'
                      style={{
                        opacity: !navOpen && 0,
                      }}
                    >
                      Profile
                    </NavLink>
                  </li>
                  {UserData && !UserData.isAuth && (
                    <li className='navigation__item'>
                      <NavLink
                        smooth='true'
                        onClick={() => dispatch(setNavOpen(false))}
                        to={`/login`}
                        className='navigation__link'
                        style={{
                          opacity: !navOpen && 0,
                        }}
                      >
                        Login
                      </NavLink>
                    </li>
                  )}
                  {UserData && UserData.isAuth && (
                    <li className='navigation__item'>
                      <Link
                        smooth='true'
                        onClick={() => {
                          dispatch(setNavOpen(false));
                          logoutHandler();
                        }}
                        className='navigation__link'
                        style={{
                          opacity: !navOpen && 0,
                        }}
                      >
                        Logout
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </>
          </div>
        </nav>
      ) : (
        <nav
          className='nav-bar nav-bar--search'
          style={{
            top: tour && '15rem',
            zIndex: tour && navOpen ? '20000' : tour && 2000,
          }}
        >
          <div
            className='search-nav'
            style={{ zIndex: tour && navOpen ? '20000' : tour && 2000 }}
          >
            <div className='navigation__expand-icon-section'>
              <svg
                ref={node}
                className='search-nav__close-search'
                onClick={() => setSearching(false)}
              >
                <use href={sprite + '#close'}></use>
              </svg>
            </div>
            <div className='search-nav__search-bar'>
              <div className=''>
                <SearchBar tour={tour} />
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

export default withRouter(NavCollapse);
