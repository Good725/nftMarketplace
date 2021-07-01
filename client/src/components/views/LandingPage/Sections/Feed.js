import React, { useState, useRef, useEffect } from 'react';
import { Row } from 'antd';
import CardsList from '../../../utils/CardsList';
import PackList from '../../../utils/PackList';
import { categories } from '../../../utils/categoryArray';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';
import sprite from '../../../../img/sprite.svg';

function Feed(props) {
  const [category, setCategory] = useState('All');
  const [hoverCategory, setHoverCategory] = useState('');
  const [menu, setMenu] = useState(false);
  const [verified, setVerified] = useState(true);
  const { width } = useWindowDimensions();
  const node = useRef();

  const onClick = (e) => {
    console.log(e.target);
    category === e.target.textContent
      ? setCategory('All')
      : setCategory(e.target.textContent);
  };
  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick); // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
  const handleClick = (e) => {
    if (node.current) {
      if (node.current.contains(e.target)) {
        return;
      } // outside click
      setMenu(false);
    }
  };
  return (
    <div className='feed'>
      <h2 className='feed__title'>New</h2>
      {width > 900 ? (
        <div className='feed__nav-area'>
          <div
            className='feed__verified-section'
            onClick={() => setVerified(!verified)}
          >
            <h3 className='feed__section-title' className='feed__verified-text'>
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
        <div className='feed__mobile-nav' ref={node}>
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
                position: 'fixed',
                top: ' 5rem',
                right: '5rem',
              }}
            >
              <svg
                className={
                  menu
                    ? 'feed__nav-bar__close feed__nav-bar__close--active'
                    : 'feed__nav-bar__close'
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
      <CardsList
        searchTerm=''
        filterProperty=''
        category={category}
        history={props.history}
        verified={verified}
      />
      {/* <h3 className='feed__section-title'>Auction</h3>
      <CardsList
        searchTerm=''
        filterProperty=''
        category={category}
        history={props.history}
        filter='auction'
        verified={verified}
      />
      <h3 className='feed__section-title'>Free NFT</h3>
      <CardsList
        searchTerm=''
        filterProperty=''
        category={category}
        history={props.history}
        verified={verified}
        filter='free'
      /> */}
      <CardsList
        searchTerm=''
        filterProperty=''
        category={category}
        history={props.history}
        verified={verified}
        infinite={true}
      />
      {/* <PackList searchTerm='' filterProperty='' category={category} /> */}
    </div>
  );
}

export default Feed;
