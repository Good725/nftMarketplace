import React from 'react';
import CardsList from '../../utils/CardsList';
import UserList from '../../utils/UserList';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchCategory } from '../../../_actions/search_actions';

function SearchPage() {
  const dispatch = useDispatch();
  const searchCategory = useSelector((state) => state.search.searchCategory);
  // SETTING SEARCH CATEGORY FOR SEARCH SUGGESTION ROUTE
  // TO RUN IN SEARCH NAV BAR
  const handleSearchCriteria = (e) => {
    dispatch(setSearchCategory(e.target.textContent));
  };

  return (
    <div className='landing__container'>
      <div className='view-selection' style={{ gridColumn: '1/4' }}>
        {/* PAGE SELECT */}
        <div>
          <button
            className='view-selection__buttons'
            onClick={handleSearchCriteria}
            style={{ cursor: 'pointer' }}
          >
            Cards
          </button>
          <button
            className='view-selection__buttons'
            onClick={handleSearchCriteria}
            style={{ cursor: 'pointer' }}
          >
            Users
          </button>
        </div>
      </div>
      {/* RENDER CARDS OR USERS */}

      {searchCategory === 'Cards' ? (
        <CardsList search={true} category='All' infinite={true} />
      ) : (
        <UserList search={true} infinite={true} />
      )}
    </div>
  );
}

export default SearchPage;

// const updateSearchTerms = (newSearchTerm) => {
//   const variables = {
//     skip: 0,
//     limit: Limit,
//     // filters: Filters,
//     searchTerm: newSearchTerm,
//   };

//   setSkip(0);
//   setSearchTerms(newSearchTerm);

//   dispatch(getProducts(variables));
// };

// line 206
// useEffect(() => {
// 	const userVariables = {
// 		userSkip: UserSkip,
// 		userLimit: UserLimit,
// 	};

// 	getUsers(userVariables);
// }, []);

// useEffect(() => {
// 	console.log('from getUser');
// 	Axios.post('/api/user/getUsers').then((response) => {
// 		if (response.data.success) {
// 			setUsers(response.data.users);

// 			console.log(response.data.users);
// 		} else {
// 			alert('failed to fetch user data');
// 		}
// 	});
// }, []);

// const onLoadMore = () => {
// 	let skip = Skip + Limit;

// 	const variables = {
// 		skip: skip,
// 		limit: Limit,
// 		loadMore: true,
// 		filters: Filters,
//
// 	dispatch(getProducts(variables));

// 	setSkip(skip);
//

// line 326 <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
// 									<SearchFeature refreshFunction={updateSearchTerms} />
// 								</div>

// Filter

//   <Row gutter={[16, 16]}>
// 				<Col lg={12} sx={24}>
// 					<CheckBox list={continents} handleFilters={(filters) => handleFilters(filters, 'continents')} />
// 				</Col>
// 				<Col lg={12} sx={24}>
// 					<RadioBox list={price} handleFilters={(filters) => handleFilters(filters, 'price')} />
// 				</Col>
// 			</Row>

//   Search
