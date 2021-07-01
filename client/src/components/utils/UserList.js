import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInfiniteScrollSearchUser } from '../../hoc/infinteScrollHook';
import {
  setSearchUserCount,
  getSearchUserProducts,
} from '../../_actions/_infinite_actions';
import CollectionItem from '../views/LandingPage/Sections/CollectionItem';

function UserList(props) {
  // GETTNG REDUX STATE AND ACTIONS
  const dispatch = useDispatch();
  const searchString = useSelector((state) => state.search.searchString);
  const {
    searchUserProducts,
    searchUserPage,
    searchUserLoading,
    searchUserCount,
  } = useSelector((state) => state.infinite);

  useEffect(() => {
    if (
      searchString !== '' &&
      searchUserPage &&
      searchUserLoading &&
      searchUserCount + 1 <= searchUserPage
    ) {
      dispatch(setSearchUserCount());
      dispatch(getSearchUserProducts(searchUserPage, searchString));
      // eslint-disable-next-line
    }
  }, [searchString, searchUserPage, searchUserLoading, searchUserCount]);
  let bottomBoundaryRefSearch = useRef(null);
  useInfiniteScrollSearchUser(bottomBoundaryRefSearch);
  return (
    <div className='top-collection__users'>
      {searchUserProducts.length === 0 ? (
        <h3>No Users with that name</h3>
      ) : (
        searchUserProducts.map((user, i) => (
          <CollectionItem user={user} index={i} />
        ))
      )}
      <div className='feed__hidden' ref={bottomBoundaryRefSearch}></div>
    </div>
  );
}

export default UserList;
