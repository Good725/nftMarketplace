import React from 'react';

function LogoutItem({
  hover,
  onMouseEnter,
  onMouseLeave,
  logoutHandler,
  user,
}) {
  return (
    <>
      {user.userData.isAuth && (
        <li
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={logoutHandler}
          className={
            hover ? 'nav-bar__item--active nav-bar__item' : 'nav-bar__item'
          }
        >
          <a
            smooth='true'
            className={
              hover ? 'nav-bar__link--active nav-bar__link' : 'nav-bar__link'
            }
          >
            Logout
          </a>
        </li>
      )}
    </>
  );
}

export default LogoutItem;
