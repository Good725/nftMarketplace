import React from 'react';
import sprite from '../../../../img/sprite.svg';

function CollectionItem({ user, index }) {
  return (
    <a
      key={user._id}
      className='top-collection__item'
      href={`../collection/${user._id}`}
    >
      <h5 className='top-collection__rank'>{index + 1}</h5>
      <div className='top-collection__image-section'>
        <img alt='image1' src={user.image} className='top-collection__image' />
      </div>
      <div className='top-collection__user-info'>
        <h5 className='top-collection__user-item top-collection__user-item--username'>
          {user.username}
          {user.role === 2 && (
            <img
              src='/verifiedIcon.svg'
              className='top-collection__verified '
              alt='image1'
            />
          )}
        </h5>
        <h5 className='top-collection__user-item'>
          NFTs owned: {user.cart.length}{' '}
        </h5>
      </div>
    </a>
  );
}

export default CollectionItem;
