import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updatePotentialCardToPack,
  setCardIndex,
} from '../../../../_actions/pack_actions';
import PackCardItem from '../../BuyPack/Sections/PackCardItem';
function ReviewCardEditions(props) {
  const dispatch = useDispatch();
  const cardPackNumber = useSelector((state) => state.pack.cardPackNumber);
  const potentialCards = useSelector((state) => state.pack.potentialCards);
  const [totalEditions, setTotalEditions] = useState(0);
  const [editions, setEditions] = useState([]);

  useEffect(() => {
    setTotalEditions(
      potentialCards.reduce((acc, curr) => (acc += curr.numberEditions), 0)
    );
    setEditions(potentialCards.map((card) => card.numberEditions));
  }, [potentialCards]);
  const user = useSelector((state) => state.user.userData.username);

  const onSubmit = () => {
    console.log('hello');
    const number = cardPackNumber + 1;
    dispatch(setCardIndex(number));
  };
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,33%)' }}>
        {potentialCards.map((product, index) => (
          <div>
            <PackCardItem product={product} creator={user} />
            <select
              value={editions[index]}
              onChange={(e) => {
                console.log(parseInt(e.target.value));
                dispatch(
                  updatePotentialCardToPack(parseInt(e.target.value), index)
                );
              }}
            >
              {props.EditionAmount.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className='' style={{ display: 'grid' }}>
        <p style={{ color: totalEditions % 3 === 0 ? 'green' : 'red' }}>
          {totalEditions}
        </p>
        <button disabled={totalEditions % 3 !== 0} onClick={onSubmit}>
          Submit Cards To Pack
        </button>
      </div>
    </div>
  );
}

export default ReviewCardEditions;
