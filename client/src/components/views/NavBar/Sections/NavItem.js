import React from 'react';
import { NavLink } from 'react-router-dom';
import sprite from '../../../../img/sprite.svg';

function NavItem({
  nav,
  active,
  hover,
  onMouseEnter,
  onMouseLeave,
  tour,
  guideStep,
}) {
  return (
    <>
      <li
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          cursor: nav.crossed && 'auto',
          marginTop:
            (tour &&
              tour !== 'createPage' &&
              tour !== 'shop' &&
              nav.mainItem === 'Create') ||
            (tour === 'shop' &&
              nav.mainItem === 'Home' &&
              guideStep === 3 &&
              '4rem'),
        }}
        className={
          active || hover
            ? 'nav-bar__item--active nav-bar__item'
            : 'nav-bar__item'
        }
      >
        <NavLink
          smooth='true'
          to={`/${nav.route}`}
          style={{
            textDecoration: nav.crossed && 'line-through',
          }}
          className={
            active || hover
              ? 'nav-bar__link--active nav-bar__link'
              : 'nav-bar__link'
          }
        >
          {nav.mainItem}
        </NavLink>
        {(tour && tour !== 'createPage' && nav.mainItem === 'Create') ||
          (tour &&
            guideStep === 3 &&
            tour === 'shop' &&
            nav.mainItem === 'Home' && (
              <svg className='tour__arrow tour__arrow--create'>
                <use href={sprite + '#arrow-up'}></use>
              </svg>
            ))}
      </li>
    </>
  );
}

export default NavItem;
