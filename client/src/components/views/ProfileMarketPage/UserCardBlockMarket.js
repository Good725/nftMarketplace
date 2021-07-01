import React, { useEffect, useRef } from 'react';
import { usersMarketCards } from '../../../_actions/market_actions';
import useWindowDimensions from '../NavBar/Sections/ScreenWidth';
import DbiliaCardThree from '../../utils/DbiliaCardThree';
import {
  getSaleProducts,
  setSaleCount,
} from '../../../_actions/_infinite_actions';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useInfiniteScrollSale } from '../../../hoc/infinteScrollHook';

function UserCardBlockMarket(props) {
  const { width } = useWindowDimensions();
  const { _id, cart } = useSelector((state) => state.user.profileUser);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profileUser);

  const { saleProducts, salePage, saleLoading, saleCount } = useSelector(
    (state) => state.infinite
  );
  useEffect(() => {
    if (
      salePage &&
      saleLoading &&
      props.itemIds.length > 0 &&
      saleCount + 1 <= salePage
    ) {
      dispatch(setSaleCount());
      dispatch(getSaleProducts(salePage, props.itemIds, profile._id));
    }
  }, [profile, salePage, saleLoading, saleCount, props.itemIds]);
  let bottomBoundaryRef = useRef(null);

  useInfiniteScrollSale(bottomBoundaryRef);
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
        {saleProducts &&
          saleProducts.length > 0 &&
          saleProducts.map((product, i) => (
            <DbiliaCardThree
              collection='own'
              product={product}
              writer={product.writer.username}
              role={product.writer.role}
              link='/product/'
              history={props.history}
              marketUser={true}
              totalEditionsInMarket={product.editions.length}
              userCart={cart}
            />
          ))}
        <div className='feed__hidden' ref={bottomBoundaryRef}></div>
      </div>
    </div>
  );
}

export default UserCardBlockMarket;

// ok so i fixed a bug going on with selecting a card, properly formatted the cards in the sale and the collection, changed the font so the edi
