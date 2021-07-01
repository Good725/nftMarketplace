import React, { useEffect, useState } from 'react';
import MarketCardList from '../../utils/MarketCardList';
import { useDispatch, useSelector } from 'react-redux';
import { categories } from '../../utils/categoryArray';
import useWindowDimensions from '../NavBar/Sections/ScreenWidth';
import sprite from '../../../img/sprite.svg';
import { endCreateTour, trackTour } from '../../../_actions/user_actions';
import NavBar from '../NavBar/NavBar';

function MarketplacePage({ history }) {
  const [category, setCategory] = useState('All');
  const [hoverCategory, setHoverCategory] = useState('');
  const { width } = useWindowDimensions();
  const [menu, setMenu] = useState(false);
  const [verified, setVerified] = useState(true);

  const { _id, createTour } = useSelector((state) => state.user.userData);
  // useEffect(() => {
  //   history.push(`/collection/${_id}`);
  // });
  useEffect(() => {
    dispatch(trackTour(true));
  }, []);

  const dispatch = useDispatch();
  const onClick = (e) => {
    category === e.target.textContent
      ? setCategory('All')
      : setCategory(e.target.textContent);
  };
  return (
    <div className='landing__container'>
      <div className='feed'>
        <h2 className='market__title'>Marketplace</h2>
        {width > 900 ? (
          <div className='feed__nav-area'>
            <div
              className='feed__verified-section'
              onClick={() => setVerified(!verified)}
            >
              <h3
                className='feed__section-title'
                className='feed__verified-text'
              >
                Verified Only
              </h3>
              <div
                className={
                  verified
                    ? 'feed__slider-section feed__slider-section--active'
                    : 'feed__slider-section'
                }
              >
                <div
                  className={
                    verified
                      ? 'feed__slider-circle feed__slider-circle--active'
                      : 'feed__slider-circle'
                  }
                ></div>
              </div>
            </div>
            <ul className='feed__nav-bar'>
              {categories.map((cate) => (
                <li
                  key={cate}
                  className='feed__nav-bar--item'
                  style={{
                    backgroundColor:
                      cate === category || hoverCategory === cate
                        ? 'rgba(160, 65, 250, 0.5)'
                        : '#fff',
                  }}
                  onMouseEnter={() => setHoverCategory(cate)}
                  onMouseLeave={() => setHoverCategory('')}
                  onClick={onClick}
                >
                  {cate}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className='feed__mobile-nav'>
            {!menu ? (
              <button
                className='feed__category-button'
                onClick={() => setMenu(!menu)}
              >
                Select Category
              </button>
            ) : (
              <button className='feed__category-button feed__category-button--invisible'></button>
            )}
            <div
              className={
                menu
                  ? 'feed__category-menu__background feed__category-menu__background__active'
                  : 'feed__category-menu__background'
              }
            ></div>
            {menu && (
              <div
                className='navigation__expand-icon-section'
                style={{
                  zIndex: 3000,
                  position: 'absolute',
                  top: ' 5rem',
                  right: '5rem',
                }}
              >
                <svg
                  className={
                    menu
                      ? 'navigation__close navigation__close--active'
                      : 'navigation__close'
                  }
                  style={{ fill: '#fff' }}
                  onClick={() => setMenu(!menu)}
                >
                  <use href={sprite + '#close'}></use>
                </svg>
              </div>
            )}
            <nav
              className='feed__category-menu'
              style={{
                opacity: menu ? '1' : '0',
                width: menu ? '50%' : '0%',
              }}
            >
              <ul className='feed__category-menu__list'>
                {categories.map((category) => (
                  <li className='feed__category-menu__item'>
                    <a
                      onClick={(e) => {
                        onClick(e);
                        setMenu(false);
                      }}
                      className='feed__category-menu__link '
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        <MarketCardList category={category} verified={verified} />
        <MarketCardList
          category={category}
          infinite={true}
          verified={verified}
        />
      </div>
    </div>
  );
}

export default MarketplacePage;
