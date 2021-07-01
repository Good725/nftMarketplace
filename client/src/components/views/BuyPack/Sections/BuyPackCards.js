import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPackCards, getPackInfo } from '../../../../_actions/pack_actions';
import PackCardItem from './PackCardItem';
import PackEditionsRemaining from '../../UploadProductPage/Sections/PackEditionsRemaining';

function BuyPackCards({ packId }) {
  const dispatch = useDispatch();
  const packCards = useSelector((state) => state.pack.packCards);
  useEffect(() => {
    dispatch(getPackCards(packId));
    dispatch(getPackInfo(packId));
  }, [packId]);
  return (
    <div style={{ display: 'grid', paddingLeft: '10rem' }}>
      {packCards.map((product, index) => (
        <>
          <PackCardItem product={product} index={index} />
          <PackEditionsRemaining product={product} index={index} />
        </>
      ))}
    </div>
  );
}

export default BuyPackCards;
