import React, { useEffect } from 'react';
import TopCollectionsPage from './Sections/TopCollectionsPage';
import Featured from './Sections/Featured';
import Feed from './Sections/Feed';
import { useSelector, useDispatch } from 'react-redux';
import { endCreateTour, trackTour } from '../../../_actions/user_actions';
import NavBar from '../NavBar/NavBar';

function LandingPage(props) {
  //these are the userID's of users on the best backend, replace with users from yourown test backend
  useEffect(() => {
    dispatch(trackTour(true));
  }, []);

  // useEffect(() => {
  //   props.props.history.push(`/collection/${_id}`);
  // });
  const dispatch = useDispatch();
  return (
    <div className='landing__container'>
      <Featured history={props.history} />
      <TopCollectionsPage />
      <Feed history={props.history} />
    </div>
  );
}

export default LandingPage;
