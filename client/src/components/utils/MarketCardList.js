import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MarketCard from './MarketCardClassic';
import { useDispatch } from 'react-redux';
import {
  getMarketCards,
  getMarketCardsByCategory,
} from '../../_actions/market_actions';
import MarketCardClassic from './MarketCardClassic';
import MarketCardOpulent from './MarketCardOpulent';
import MarketCardSimple from './MarketCardSimple';
import useWindowDimensions from '../views/NavBar/Sections/ScreenWidth';
import {
  getMarketProducts,
  setMarketCount,
} from '../../_actions/_infinite_actions';
import { useInfiniteScrollMarket } from '../../hoc/infinteScrollHook';

function MarketCardList({ history, category, infinite, verified }) {
  // GETTING REDUX STATE AND ACTIONS
  const marketList = useSelector((state) => state.market.marketList);
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  useEffect(() => {
    if (!infinite) {
      category === 'All'
        ? dispatch(getMarketCards())
        : dispatch(getMarketCardsByCategory(category));
    }
    // eslint-disable-next-line
  }, [category, infinite]);
  // DETERMINING WHICH AND HOW MANY CARDS ARE SHOWN
  console.log(verified);
  const { marketProducts, marketPage, marketLoading, marketCount } =
    useSelector((state) => state.infinite);

  // INFINITE LIST
  useEffect(() => {
    if (
      infinite &&
      marketPage &&
      marketLoading &&
      marketCount + 1 <= marketPage
    ) {
      dispatch(setMarketCount());
      dispatch(getMarketProducts(marketPage, category));
    }
  }, [marketPage, marketLoading, marketCount, infinite]);

  let bottomBoundaryRef = useRef(null);

  useInfiniteScrollMarket(bottomBoundaryRef);
  return (
    // CARDS GROUPS

    <div className='feed__list'>
      {/* NO Market */}
      {marketList.length === 0 ? (
        <h2>'No Cards in the marketplace'</h2>
      ) : (
        // MAPPING THROUGH PRODUCTS
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
          {!infinite && verified ? (
            marketList.map(
              (product, i) =>
                product.writer.role === 2 &&
                (product.layout === 'Classic' ? (
                  <MarketCardClassic
                    product={product}
                    writer={product.writer.username}
                    role={product.writer.role}
                    type={product.type}
                    link='/buy/'
                    history={history}
                  />
                ) : product.layout === 'Opulent' ? (
                  <MarketCardOpulent
                    product={product}
                    writer={product.writer.username}
                    role={product.writer.role}
                    type={product.type}
                    link='/buy/'
                    history={history}
                  />
                ) : (
                  <MarketCardSimple
                    product={product}
                    writer={product.writer.username}
                    role={product.writer.role}
                    type={product.type}
                    link='/buy/'
                    history={history}
                  />
                ))
            )
          ) : infinite && verified ? (
            marketProducts.map(
              (product, i) =>
                product.writer.role === 2 &&
                (product.layout === 'Classic' ? (
                  <MarketCardClassic
                    product={product}
                    writer={product.writer.username}
                    role={product.writer.role}
                    type={product.type}
                    link='/buy/'
                    history={history}
                  />
                ) : product.layout === 'Opulent' ? (
                  <MarketCardOpulent
                    product={product}
                    writer={product.writer.username}
                    role={product.writer.role}
                    type={product.type}
                    link='/buy/'
                    history={history}
                  />
                ) : (
                  <MarketCardSimple
                    product={product}
                    writer={product.writer.username}
                    role={product.writer.role}
                    type={product.type}
                    link='/buy/'
                    history={history}
                  />
                ))
            )
          ) : infinite && !verified ? (
            marketProducts.map((product, i) =>
              product.layout === 'Classic' ? (
                <MarketCardClassic
                  product={product}
                  writer={product.writer.username}
                  role={product.writer.role}
                  type={product.type}
                  link='/buy/'
                  history={history}
                />
              ) : product.layout === 'Opulent' ? (
                <MarketCardOpulent
                  product={product}
                  writer={product.writer.username}
                  role={product.writer.role}
                  type={product.type}
                  link='/buy/'
                  history={history}
                />
              ) : (
                <MarketCardSimple
                  product={product}
                  writer={product.writer.username}
                  role={product.writer.role}
                  type={product.type}
                  link='/buy/'
                  history={history}
                />
              )
            )
          ) : !infinite && !verified ? (
            marketList.map((product, i) =>
              product.layout === 'Classic' ? (
                <MarketCardClassic
                  product={product}
                  writer={product.writer.username}
                  role={product.writer.role}
                  type={product.type}
                  link='/buy/'
                  history={history}
                />
              ) : product.layout === 'Opulent' ? (
                <MarketCardOpulent
                  product={product}
                  writer={product.writer.username}
                  role={product.writer.role}
                  type={product.type}
                  link='/buy/'
                  history={history}
                />
              ) : (
                <MarketCardSimple
                  product={product}
                  writer={product.writer.username}
                  role={product.writer.role}
                  type={product.type}
                  link='/buy/'
                  history={history}
                />
              )
            )
          ) : (
            <div>hello</div>
          )}
        </div>
      )}
      {infinite && <div className='feed__hidden' ref={bottomBoundaryRef}></div>}
    </div>
  );
}

export default MarketCardList;
