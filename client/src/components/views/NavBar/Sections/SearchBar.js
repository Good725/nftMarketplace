import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setSearchCategory,
  setSearchString,
} from '../../../../_actions/search_actions';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSuggestedProducts } from '../../../../_actions/product_actions';
import { getSuggestedUsers } from '../../../../_actions/user_actions';
import {
  resetSearchCard,
  resetSearchUser,
} from '../../../../_actions/_infinite_actions';

function SearchBar({ history, tour }) {
  const dispatch = useDispatch();
  const [searchString, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [cancelEnter, setCancelEnter] = useState(false);
  const category = useSelector((state) => state.search.searchCategory);
  const users = useSelector((state) => state.user.suggestedUsers);
  const products = useSelector((state) => state.product.suggestedProducts);
  const [productId, setProductId] = useState('');
  const onChangeSearch = (e) => {
    setSearch(e.currentTarget.value);
  };

  useEffect(() => {
    window.location.pathname !== '/search' && setSearch('');
    window.location.pathname !== '/search' && setSearchCategory('Cards');
  }, [window.location.pathname]);
  useEffect(() => {
    const variables = {
      skip: 0,
      limit: 3,
      searchString,
    };

    category === 'Cards'
      ? dispatch(getSuggestedProducts(variables))
      : dispatch(getSuggestedUsers(variables));
    // eslint-disable-next-line
  }, [searchString, category]);

  useEffect(() => {
    searchString !== '' &&
      setSuggestions(category === 'Cards' ? products : users);
    searchString === '' && setSuggestions([]);
    // eslint-disable-next-line
  }, [products, users]);

  useEffect(() => {
    return () => {
      setCancelEnter(false);
      setSearch('');
      setSuggestions([]);
    };
  }, [cancelEnter]);

  useEffect(() => {
    if (searchString === '') {
      dispatch(resetSearchUser());
      dispatch(setSearchString(''));
      dispatch(resetSearchCard());
    }
  }, [searchString]);

  const onSubmit = (e) => {
    !cancelEnter && e.preventDefault();
    dispatch(setSearchString(searchString));
    dispatch(resetSearchUser());
    dispatch(resetSearchCard());
    !cancelEnter && history.push('/search');
    setSuggestions([]);
  };

  const userSelect = (userId) => {
    setCancelEnter(true);
    history.push(`/user/${userId}`);
  };

  const cardSelect = (productId) => {
    setCancelEnter(true);
    setTimeout(() => {
      history.push(`/product/${productId}`);
    }, 400);
  };
  return (
    <div
      className='nav-bar__search-container'
      style={{ top: tour && '17.6rem' }}
    >
      <form onSubmit={onSubmit}>
        <input
          className='nav-bar__search-bar'
          value={searchString}
          onChange={onChangeSearch}
          placeholder={`Search by creator, card or collection`}
        />
      </form>
      <ul className='nav-bar__search-suggestions'>
        {category === 'Cards'
          ? suggestions.map((card) => (
              <li
                className='nav-bar__search-suggestion-item'
                value={card._id}
                key={card._id}
              >
                <button
                  className='nav-bar__search-suggestion-button'
                  value={card._id}
                  onClick={() => cardSelect(card._id)}
                >
                  {card.title}
                </button>
              </li>
            ))
          : suggestions.map((user) => (
              <li
                className='nav-bar__search-suggestion-item'
                value={user._id}
                key={user._id}
              >
                <button
                  className='nav-bar__search-suggestion-button'
                  value={user._id}
                  onClick={() => userSelect(user._id)}
                >
                  {user.username}
                </button>
              </li>
            ))}
      </ul>
    </div>
  );
}

export default withRouter(SearchBar);
