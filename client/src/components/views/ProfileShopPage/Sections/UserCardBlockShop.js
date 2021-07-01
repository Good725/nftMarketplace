import React, { useEffect, useRef } from 'react';
import DbiliaCardThree from '../../../utils/DbiliaCardThree';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';
import sprite from '../../../../img/sprite.svg';
import { useSelector, useDispatch } from 'react-redux';
import {
  getShopProducts,
  setShopCount,
} from '../../../../_actions/_infinite_actions';
import { useInfiniteScrollShop } from '../../../../hoc/infinteScrollHook';

function UserCardBlockShop(props) {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profileUser);

  const { shopProducts, shopPage, shopLoading, shopCount } = useSelector(
    (state) => state.infinite
  );
  useEffect(() => {
    console.log(props.itemIds);
    if (
      shopPage &&
      shopLoading &&
      props.itemIds.length > 0 &&
      shopCount + 1 <= shopPage
    ) {
      dispatch(setShopCount());
      dispatch(getShopProducts(shopPage, props.itemIds));
    }
  }, [profile, shopPage, shopLoading, shopCount, props.itemIds]);
  let bottomBoundaryRef = useRef(null);

  useInfiniteScrollShop(bottomBoundaryRef);
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
        {shopProducts &&
          shopProducts.length > 0 &&
          shopProducts.map((product, i) => (
            <DbiliaCardThree
              className='coin'
              product={product}
              writer={product.writer.username}
              role={product.writer.role}
              link='/product/'
              history={props.history}
            />
          ))}
        <div className='feed__hidden' ref={bottomBoundaryRef}></div>
      </div>
    </div>
  );
}

export default UserCardBlockShop;
