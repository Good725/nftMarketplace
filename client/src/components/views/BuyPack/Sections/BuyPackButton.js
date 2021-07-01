import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  buyFromPack,
  addPackCardsToUserCart,
} from '../../../../_actions/pack_actions';
import { useSelector } from 'react-redux';

function BuyPackButton({ packId }) {
  const dispatch = useDispatch();
  const packArray = useSelector((state) => state.pack.cardPurchaseInfo);

  useEffect(() => {
    packArray.length > 0 &&
      packArray.forEach((pack, index) => {
        setTimeout(() => {
          dispatch(addPackCardsToUserCart(pack, packId));
        }, 1000 * index);
      });
  }, [packArray]);

  const onClick = () => {
    dispatch(buyFromPack(packId));
  };
  return (
    <div style={{ gridColumn: '2/3', marginTop: '10rem' }}>
      <button onClick={onClick}>Buy 3 Cards From Pack</button>
    </div>
  );
}

export default BuyPackButton;
