import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFeaturedProducts,
  setFeatureCount,
} from '../../../../_actions/_infinite_actions';
import FeaturedItem from './FeaturedItem';
import { useInfiniteScrollFeature } from '../../../../hoc/infinteScrollHook';

function Featured(props) {
  const dispatch = useDispatch();

  const { featuredProducts, featuredPage, featuredLoading, featureCount } =
    useSelector((state) => state.infinite);

  const productArray = [
    { type: 'card', _id: '60be33d285173b0b2bab5ff8' },
    { type: 'card', _id: '60be33e685173b0b2bab5ffa' },
    { type: 'card', _id: '60be33fd85173b0b2bab5ffc' },
    { type: 'card', _id: '60be340d85173b0b2bab5ffe' },
    { type: 'card', _id: '60be341f85173b0b2bab6000' },
    { type: 'card', _id: '60be342f85173b0b2bab6002' },
    { type: 'card', _id: '60be344385173b0b2bab6004' },
    { type: 'card', _id: '60be345285173b0b2bab6006' },
    { type: 'card', _id: '60be346485173b0b2bab6008' },
    { type: 'card', _id: '60be347b85173b0b2bab600a' },
    { type: 'user', _id: '6032f17887a7c102fe86a6c8' },
  ];

  // AFTER 1ST RUN
  useEffect(() => {
    if (featuredPage && featuredLoading && featureCount + 1 <= featuredPage) {
      dispatch(setFeatureCount());
      dispatch(getFeaturedProducts(productArray, featuredPage));
    }
  }, [featuredPage, featuredLoading, featureCount]);

  let bottomBoundaryRef = useRef(null);

  useInfiniteScrollFeature(bottomBoundaryRef);

  return (
    <div className='featured'>
      <div className='featured__images-section'>
        <div className='featured__images'>
          {featuredProducts.length > 0 &&
            featuredProducts.map((item, i) => <FeaturedItem item={item} />)}
          <div
            className='featured__hidden'
            ref={bottomBoundaryRef}
            style={{
              gridColumn: `${featuredProducts.length + 1}/${
                featuredProducts.length + 2
              }`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Featured;
