import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DbiliaCardThree from '../utils/DbiliaCardThree';
import { getPacks, getPacksByCategory } from '../../_actions/pack_actions';

function PackList({ search, category }) {
  // GETTING REDUX STATE AND ACTIONS
  const dispatch = useDispatch();
  const packList = useSelector((state) => state.pack.packList);

  const searchString = useSelector((state) => state.search.searchString);

  // LOCAL STATE,

  // DETERMINING WHICH AND HOW MANY CARDS ARE SHOWN
  useEffect(() => {
    const variables = {
      skip: 0,
      limit: 8,
      searchString,
    };
    category === 'All'
      ? dispatch(getPacks(variables))
      : dispatch(getPacksByCategory(category));
    // eslint-disable-next-line
  }, [searchString, category]);

  return (
    // CARDS GROUPS
    <>
      <div className='feed__list feed__list--packs'>
        {/* NO PRODUCTS */}
        <div className='cards'>
          <>
            <div className='card'>
              {packList.map((product) => (
                <DbiliaCardThree
                  key={product._id}
                  product={product}
                  writer={product.writer.username}
                  role={product.writer.role}
                  type={product.type}
                  link='/buyPack/'
                />
              ))}
            </div>
          </>
          {/* SHOW LOAD BUTTON IF THERE ARE MORE CARDS TO SHOW */}
          {packList.length >= 8 && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {/* <button>Load More</button> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PackList;
