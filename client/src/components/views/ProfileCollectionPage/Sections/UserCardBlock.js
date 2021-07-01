import React, { useEffect, useRef } from 'react';
import DbiliaCardThree from '../../../utils/DbiliaCardThree';
import { useSelector, useDispatch } from 'react-redux';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';
import {
  getCollectionProducts,
  setCollectionCount,
} from '../../../../_actions/_infinite_actions';
import { useInfiniteScrollCollection } from '../../../../hoc/infinteScrollHook';
import sprite from '../../../../img/sprite.svg';

function UserCardBlock(props) {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.user.profileUser);
  const user = useSelector((state) => state.user.userData);

  const { width } = useWindowDimensions();
  const {
    collectionProducts,
    collectionPage,
    collectionLoading,
    collectionCount,
  } = useSelector((state) => state.infinite);

  // INFINITE LIST
  useEffect(() => {
    if (
      collectionPage &&
      collectionLoading &&
      props.itemIds.length > 0 &&
      collectionCount + 1 <= collectionPage
    ) {
      dispatch(setCollectionCount());
      dispatch(getCollectionProducts(collectionPage, props.itemIds));
    }
  }, [
    profile,
    collectionPage,
    collectionLoading,
    collectionCount,
    props.itemIds,
  ]);
  let bottomBoundaryRef = useRef(null);

  useInfiniteScrollCollection(bottomBoundaryRef);

  return (
    <div className='feed__list'>
      <div
        className='card'
        style={{
          gridTemplateColumns: `repeat(${
            width > 1700
              ? 5
              : width <= 1700 && width > 1300
              ? 4
              : width <= 1300 && width > 900
              ? 3
              : width <= 900 && width > 700
              ? 2
              : 1
          }, minmax(26rem, 1fr))`,
          transition: 'all .3s ease',
        }}
      >
        {collectionProducts &&
          collectionProducts.length > 0 &&
          collectionProducts.map((product, i) => (
            <DbiliaCardThree
              displayCardsOwned={true}
              product={product}
              writer={product.writer.username}
              role={product.writer.role}
              type={product.type}
              link='/product/'
              user={profile}
              collection='own'
              history={props.history}
              usersPage={props.usersPage}
            />
          ))}
        <div className='feed__hidden' ref={bottomBoundaryRef}></div>
      </div>
      {user.firstLogin && collectionProducts.length !== 0 && (
        <svg className='tour__arrow tour__arrow--card'>
          <use href={sprite + '#arrow'}></use>
        </svg>
      )}
    </div>
  );
}

export default UserCardBlock;
