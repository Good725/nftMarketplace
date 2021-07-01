import React, { useEffect, useState } from 'react';
import {
  getProductByCategory,
  getProducts,
} from '../../_actions/product_actions';
import DbiliaCardThree from '../utils/DbiliaCardThree';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
function Card({ limit, search, grid, category }) {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const searchString = useSelector((state) => state.search.searchString);

  const [variables, setVariables] = useState();

  useEffect(() => {
    setVariables({
      skip: 0,
      limit,
      searchString,
    });
    if (limit !== 0) console.log('hello');
    category === 'All'
      ? dispatch(getProducts(variables))
      : dispatch(getProductByCategory(category));

    // eslint-disable-next-line
  }, [searchString, category, limit]);
  return (
    <div className='feed__list'>
      {/* NO PRODUCTS */}

      {productList.length === 0 ? (
        <h2 style={{ paddingTop: '6rem' }}>
          {search ? 'No Cards with this title yet...' : 'No post yet...'}
        </h2>
      ) : (
        // MAPPING THROUGH PRODUCTS
        <>
          <div
            className='card'
            style={{
              gridTemplateColumns: `repeat(${grid}, minmax(25rem, 1fr))`,
              transition: 'all .3s ease',
            }}
          >
            {productList.map(
              (product, i) =>
                (moment(product.auctionDeadline) > moment(Date.now()) ||
                  !product.auction) && (
                  <DbiliaCardThree
                    key={product._id}
                    product={product}
                    writer={product.writer.username}
                    role={product.writer.role}
                    type={product.type}
                    link='/product/'
                  />
                )
            )}
          </div>
        </>
      )}
      {/* SHOW LOAD BUTTON IF THERE ARE MORE CARDS TO SHOW */}
      {productList.length >= 8 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* <button>Load More</button> */}
        </div>
      )}
    </div>
  );
}

export default Card;
