import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getProductByCategory,
  getProducts,
} from '../../_actions/product_actions';
import DbiliaCardThree from '../utils/DbiliaCardThree';
import useWindowDimensions from '../views/NavBar/Sections/ScreenWidth';
import {
  getFeedProducts,
  getSearchCardProducts,
  setFeedCount,
  setSearchCardCount,
} from '../../_actions/_infinite_actions';
import {
  useInfiniteScrollFeed,
  useInfiniteScrollSearchCard,
} from '../../hoc/infinteScrollHook';

import moment from 'moment';
function CardsList({ search, category, history, verified, filter, infinite }) {
  // GETTING REDUX STATE AND ACTIONS
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const searchString = useSelector((state) => state.search.searchString);
  const { width } = useWindowDimensions();
  const {
    feedProducts,
    feedPage,
    feedLoading,
    feedCount,
    searchCardProducts,
    searchCardPage,
    searchCardLoading,
    searchCardCount,
  } = useSelector((state) => state.infinite);

  // INFINITE LIST FOR FEED
  useEffect(() => {
    if (
      !search &&
      infinite &&
      feedPage &&
      feedLoading &&
      feedCount + 1 <= feedPage
    ) {
      dispatch(setFeedCount());
      dispatch(getFeedProducts(feedPage));
    }
  }, [feedPage, feedLoading, feedCount, infinite]);

  // INFINITE LIST FOR SEARCH
  useEffect(() => {
    if (
      search &&
      infinite &&
      searchString !== '' &&
      searchCardPage &&
      searchCardLoading &&
      searchCardCount + 1 <= searchCardPage
    ) {
      dispatch(setSearchCardCount());
      dispatch(getSearchCardProducts(searchCardPage, searchString));
    }
  }, [
    searchCardPage,
    searchCardLoading,
    searchCardCount,
    infinite,
    search,
    searchString,
  ]);

  // NON INFINITE LIST FOR FEED
  useEffect(() => {
    if (!infinite) {
      const variables = {
        skip: 0,
        limit: 15,
        searchString: '',
      };
      category === 'All'
        ? dispatch(getProducts(variables))
        : dispatch(getProductByCategory(category));
    }

    // eslint-disable-next-line
  }, [searchString, category, infinite]);
  let bottomBoundaryRef = useRef(null);
  let bottomBoundaryRefSearch = useRef(null);

  useInfiniteScrollFeed(bottomBoundaryRef);
  useInfiniteScrollSearchCard(bottomBoundaryRefSearch);

  return (
    // CARDS GROUPS
    <>
      <div className='feed__list'>
        {/* NO PRODUCTS */}

        {((feedProducts.length === 0 && infinite) ||
          (productList.length === 0 && !infinite)) &&
        searchCardProducts.length === 0 ? (
          <h2 style={{ paddingTop: '6rem' }}>
            {search ? 'No Cards with this title yet...' : 'No post yet...'}
          </h2>
        ) : (
          // MAPPING THROUGH PRODUCTS
          <>
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
              {search
                ? searchCardProducts.map((product, i) => (
                    <DbiliaCardThree
                      collection='feed'
                      key={product._id}
                      product={product}
                      writer={product.writer.username}
                      role={product.writer.role}
                      type={product.type}
                      link='/product/'
                      history={history}
                    />
                  ))
                : verified && !infinite
                ? filter === 'auction'
                  ? productList.map(
                      (product, i) =>
                        product.auction &&
                        product.writer.role == 2 &&
                        moment(product.auctionDeadline) >
                          moment(Date.now()) && (
                          <DbiliaCardThree
                            collection='feed'
                            key={product._id}
                            product={product}
                            writer={product.writer.username}
                            role={product.writer.role}
                            type={product.type}
                            link='/product/'
                            history={history}
                          />
                        )
                    )
                  : filter === 'free'
                  ? productList.map(
                      (product, i) =>
                        product.writer.role == 2 &&
                        product.price === 0 &&
                        !product.auction && (
                          <DbiliaCardThree
                            collection='feed'
                            key={product._id}
                            product={product}
                            writer={product.writer.username}
                            role={product.writer.role}
                            type={product.type}
                            link='/product/'
                            history={history}
                          />
                        )
                    )
                  : productList.map(
                      (product, i) =>
                        product.writer.role == 2 &&
                        !product.auction && (
                          <DbiliaCardThree
                            collection='feed'
                            key={product._id}
                            product={product}
                            writer={product.writer.username}
                            role={product.writer.role}
                            type={product.type}
                            link='/product/'
                            history={history}
                          />
                        )
                    )
                : verified && infinite
                ? filter === 'auction'
                  ? feedProducts.map(
                      (product, i) =>
                        product.auction &&
                        product.writer.role == 2 &&
                        moment(product.auctionDeadline) >
                          moment(Date.now()) && (
                          <DbiliaCardThree
                            collection='feed'
                            key={product._id}
                            product={product}
                            writer={product.writer.username}
                            role={product.writer.role}
                            type={product.type}
                            link='/product/'
                            history={history}
                          />
                        )
                    )
                  : filter === 'free'
                  ? feedProducts.map(
                      (product, i) =>
                        product.writer.role == 2 &&
                        product.price === 0 &&
                        !product.auction && (
                          <DbiliaCardThree
                            collection='feed'
                            key={product._id}
                            product={product}
                            writer={product.writer.username}
                            role={product.writer.role}
                            type={product.type}
                            link='/product/'
                            history={history}
                          />
                        )
                    )
                  : feedProducts.map(
                      (product, i) =>
                        product.writer.role == 2 &&
                        !product.auction && (
                          <DbiliaCardThree
                            collection='feed'
                            key={product._id}
                            product={product}
                            writer={product.writer.username}
                            role={product.writer.role}
                            type={product.type}
                            link='/product/'
                            history={history}
                          />
                        )
                    )
                : !verified && !infinite
                ? filter === 'auction'
                  ? productList.map(
                      (product, i) =>
                        product.auction &&
                        moment(product.auctionDeadline) >
                          moment(Date.now()) && (
                          <DbiliaCardThree
                            collection='feed'
                            key={product._id}
                            product={product}
                            writer={product.writer.username}
                            role={product.writer.role}
                            type={product.type}
                            link='/product/'
                            history={history}
                          />
                        )
                    )
                  : filter === 'free'
                  ? productList.map(
                      (product, i) =>
                        product.price === 0 &&
                        !product.auction && (
                          <DbiliaCardThree
                            collection='feed'
                            key={product._id}
                            product={product}
                            writer={product.writer.username}
                            role={product.writer.role}
                            type={product.type}
                            link='/product/'
                            history={history}
                          />
                        )
                    )
                  : productList.map(
                      (product, i) =>
                        !product.auction && (
                          <DbiliaCardThree
                            collection='feed'
                            key={product._id}
                            product={product}
                            writer={product.writer.username}
                            role={product.writer.role}
                            type={product.type}
                            link='/product/'
                            history={history}
                          />
                        )
                    )
                : filter === 'auction'
                ? feedProducts.map(
                    (product, i) =>
                      product.auction &&
                      moment(product.auctionDeadline) > moment(Date.now()) && (
                        <DbiliaCardThree
                          collection='feed'
                          key={product._id}
                          product={product}
                          writer={product.writer.username}
                          role={product.writer.role}
                          type={product.type}
                          link='/product/'
                          history={history}
                        />
                      )
                  )
                : filter === 'free'
                ? feedProducts.map(
                    (product, i) =>
                      product.price === 0 &&
                      !product.auction && (
                        <DbiliaCardThree
                          collection='feed'
                          key={product._id}
                          product={product}
                          writer={product.writer.username}
                          role={product.writer.role}
                          type={product.type}
                          link='/product/'
                          history={history}
                        />
                      )
                  )
                : feedProducts.map((product, i) => (
                    <DbiliaCardThree
                      collection='feed'
                      key={product._id}
                      product={product}
                      writer={product.writer.username}
                      role={product.writer.role}
                      type={product.type}
                      link='/product/'
                      history={history}
                    />
                  ))}
            </div>
          </>
        )}
        {infinite && !search && (
          <div className='feed__hidden' ref={bottomBoundaryRef}></div>
        )}
        {search && (
          <div className='feed__hidden' ref={bottomBoundaryRefSearch}></div>
        )}
      </div>
    </>
  );
}

export default CardsList;
