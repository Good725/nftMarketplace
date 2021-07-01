import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import CollectionItem from './CollectionItem';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers } from '../../../../_actions/user_actions';
function TopCollectionsPage(props) {
  const { width } = useWindowDimensions();
  const users = useSelector((state) => state.user.searchedUsers);
  const [sorted, setSorted] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const variables = {
      skip: 0,
      limit: 15,
    };
    dispatch(getUsers(variables));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setSorted(users.sort((a, b) => b.cart.length - a.cart.length));
  }, [users]);

  useEffect(() => {
    const array1 = sorted.filter((u, i) => i === 1 || i === 6 || i === 11);
  }, [sorted]);
  return (
    <div className='top-collection'>
      <h2 className='top-collection__header'>Top Collection</h2>
      <div className='top-collection__users'>
        <div className='top-collection__user-section'>
          {sorted.map(
            (user, i) => i <= 2 && <CollectionItem user={user} index={i} />
          )}
        </div>
        <div className='top-collection__user-section'>
          {sorted.map(
            (user, i) =>
              i > 2 && i <= 5 && <CollectionItem user={user} index={i} />
          )}
        </div>

        <div className='top-collection__user-section'>
          {sorted.map(
            (user, i) =>
              i > 5 && i <= 8 && <CollectionItem user={user} index={i} />
          )}
        </div>

        <div className='top-collection__user-section'>
          {sorted.map(
            (user, i) =>
              i > 8 && i <= 11 && <CollectionItem user={user} index={i} />
          )}
        </div>

        <div className='top-collection__user-section'>
          {sorted.map(
            (user, i) =>
              i > 11 && i <= 14 && <CollectionItem user={user} index={i} />
          )}
        </div>
      </div>
    </div>
  );
}

export default TopCollectionsPage;
