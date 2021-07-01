import React, { useState, useEffect } from 'react';
import NavItem from './NavItem';
import { withRouter, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import SearchBar from '../Sections/SearchBar';
import LogoutItem from './LogoutItem';
import { logoutInfinite } from '../../../../_actions/_infinite_actions';
import { useDispatch } from 'react-redux';
import { resetProfile } from '../../../../_actions/user_actions';
import useWindowDimensions from './ScreenWidth';
function NavBarList({ location, history, tour, guideStep }) {
  const [active, setActive] = useState('');
  const [hover, setHoverItem] = useState(false);
  const user = useSelector((state) => state.user);
  const TheUserData = useSelector((state) => state.user.userData);
  const [role] = useState(0);
  const [UserId, setUserId] = useState(0);
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        dispatch(logoutInfinite());
        dispatch(resetProfile());
        history.push('/login');
      } else {
        alert('Log Out Failed');
      }
    });
  };

  const nonAuthNavArray = [
    { route: '', mainItem: 'Home' },
    { route: 'marketplace', mainItem: 'Marketplace' },
    { route: 'createCard', mainItem: 'Create' },
    { route: `collection/${UserId}`, mainItem: 'Profile' },
    { route: 'login', mainItem: 'Login' },
  ];

  const authNavArray = [
    { route: '', mainItem: 'Home' },
    { route: 'marketplace', mainItem: 'Marketplace' },
    { route: 'createCard', mainItem: 'Create' },
    { route: `collection/${UserId}`, mainItem: 'Profile', mainItem2: 'shop/' },
  ];
  useEffect(() => {
    if (TheUserData) {
      setUserId(TheUserData._id);
    }
  }, [TheUserData]);

  useEffect(() => {
    console.log(active);
    if (TheUserData) {
      setHoverItem('');
      if (
        !TheUserData.isAuth &&
        (active === '/createCard' || active === 'collection/undefined')
      ) {
        console.log('LOGINNNN');
        history.push('/login');
        setActive('Login');
      } else if (TheUserData._id) {
        if (
          location.pathname.substring(1) === `shop/${TheUserData._id}` ||
          location.pathname.substring(1) === `yourMarket/${TheUserData._id}`
        ) {
          setActive(`collection/${TheUserData._id}`);
        } else {
          setActive(location.pathname.substring(1));
        }
      } else {
        setActive(location.pathname.substring(1));
      }
    }
  }, [TheUserData._id, location.pathname, active]);

  return (
    <nav
      className='nav-bar '
      style={{
        top: tour && '15rem',
        zIndex: tour && '2000',
      }}
    >
      <a className='nav-bar__logo' href='/'>
        <img
          className='nav-bar__logo--item'
          src='/DbiliaLogoNameLong.png'
          alt='navbar'
        />
      </a>
      <SearchBar tour={tour} />
      <ul className='nav-bar__list'>
        {user.userData && !user.userData.isAuth
          ? nonAuthNavArray.map((nav, index) => (
              <NavItem
                nav={nav}
                key={nav.route}
                index={index}
                active={active === nav.route}
                onMouseEnter={() => setHoverItem(nav.mainItem)}
                hover={hover === nav.mainItem}
                onMouseLeave={() => setHoverItem('')}
              />
            ))
          : authNavArray.map((nav, index) => (
              <>
                <NavItem
                  nav={nav}
                  index={index}
                  key={nav.route}
                  tour={tour}
                  guideStep={guideStep}
                  active={active === nav.route}
                  onMouseEnter={() => setHoverItem(nav.mainItem)}
                  hover={hover === nav.mainItem}
                  onMouseLeave={() => setHoverItem('')}
                />
              </>
            ))}
        <LogoutItem
          user={user}
          onMouseEnter={() => setHoverItem('Logout')}
          hover={hover === 'Logout'}
          onMouseLeave={() => setHoverItem('')}
          logoutHandler={logoutHandler}
        />
      </ul>
    </nav>
  );
}

export default withRouter(NavBarList);
