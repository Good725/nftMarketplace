import React, { useState, useEffect } from 'react';
import CreatePotentialPackCard from './CreatePotentialPackCard';
import { useSelector, useDispatch } from 'react-redux';
import CreatePackCover from './CreatePackCover';
import { setCardIndex } from '../../../../_actions/pack_actions';
import ReviewCardEditions from './ReviewCardEditions';
function CreatePack({ history }) {
  const [input, setInput] = useState('');
  const [cardArray, setCardArray] = useState([]);
  const categories = [
    'None',
    'Sports',
    'Arts',
    'Movies',
    'Music',
    'Gifs',
    'Games',
    'Memorabilia',
    'Meme',
  ];

  const [LoggedIn, setLoggedIn] = useState(false);

  const TheUserData = useSelector((state) => state.user.userData);

  const dispatch = useDispatch();
  const onChange = (e) => {
    setInput(parseInt(e.currentTarget.value));
  };
  const cardPackNumber = useSelector((state) => state.pack.cardPackNumber);

  const EditionAmount = Array.apply(null, Array(99))
    .map((v, i) => i + 1)
    .concat(Array.apply(null, Array(10)).map((v, i) => (i + 1) * 100));

  const onSubmit = (e) => {
    e.preventDefault();
    setCardArray(Array.apply(null, Array(input)).map((item, i) => i));
    const number = cardPackNumber + 1;
    dispatch(setCardIndex(number));
  };

  useEffect(() => {
    if (!TheUserData.isAuth) {
      history.push('/login');
    }
    if (TheUserData) {
      if (TheUserData.username) {
        setLoggedIn(true);
      }
    }
    // eslint-disable-next-line
  }, [TheUserData]);
  return (
    <>
      {cardArray.length === 0 ? (
        <div className='create-pack'>
          <h1 className='create-pack__header'>Welcome To Pack Creation!</h1>
          <h2 className='create-pack__explanation'>
            Here you are able to create your own pack of cards. You can have as
            many cards as you'd like in your pack and any variation of editions,
            keeping in mind the total # of editions must be divisible by 3.
            Finally you will be able to create your pack cover'
          </h2>
          <h4 className='create-pack__title'>Pack Setup</h4>
          <h5 className='create-pack__label'>
            How Many Cards Would You Like In the pack?
          </h5>
          <form onSubmit={onSubmit} className='create-pack__form'>
            <input
              type='number'
              min='6'
              max='500'
              onChange={onChange}
              value={input}
              className='create-pack__input'
            />
            <div className=''>
              <button className='create-pack__button' type='submit'>
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : cardArray.length === cardPackNumber - 1 ? (
        // cardPackNumber is increased by one after user finally submits
        // all editiions
        <ReviewCardEditions
          LoggedIn={LoggedIn}
          writerId={TheUserData._id}
          EditionAmount={EditionAmount}
        />
      ) : // this is why cover shows up after cardPack -2 === length
      cardArray.length === cardPackNumber - 2 ? (
        <CreatePackCover
          categories={categories}
          LoggedIn={LoggedIn}
          writerId={TheUserData._id}
          history={history}
        />
      ) : (
        <CreatePotentialPackCard
          EditionAmount={EditionAmount}
          writerId={TheUserData._id}
          LoggedIn={LoggedIn}
          cardArray={cardArray}
        />
      )}
    </>
  );
}

export default CreatePack;
