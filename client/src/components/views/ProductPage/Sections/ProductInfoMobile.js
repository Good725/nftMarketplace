import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { addCoins, updateSold } from '../../../../_actions/user_actions';

function ProductInfoMobile(props) {
  const [Money, setMoney] = useState(0);
  const [AmountSold] = useState(props.product.sold);
  const dispatch = useDispatch();

  const Axios = require('axios');

  const addToCarthandler = () => {
    props.addToCart(props.product._id);
  };

  useEffect(() => {
    Axios.get('../api/users/getCoins').then((response) => {
      if (response.data.success) {
        setMoney(response.data.money);
      } else {
        // alert('Failed to get Coins');
      }
    });
    // eslint-disable-next-line
  }, []);

  function checkFunds() {
    if (Money >= props.product.price) {
      let wallet = Money - props.product.price;

      dispatch(addCoins(wallet));
      alert(`added to collection ${props.product._id}`);
      dispatch(updateSold(props.product._id, AmountSold));
      addToCarthandler();

      // updateSoldAmount();

      window.location.reload();

      // addToCarthandler();
    } else {
      alert('not enough coins');
    }
  }

  return (
    <div>
      <br />
      <div style={{ justifyContent: 'center' }}>
        {props.product.sold >= props.product.editions ? (
          <Button
            size='large'
            shape='round'
            type='danger'
            style={{
              backgroundColor: 'grey',
              borderColor: 'grey',
              width: '100%',
            }}
          >
            Sold Out
          </Button>
        ) : (
          <Button
            size='large'
            shape='round'
            type='danger'
            onClick={checkFunds}
            style={{
              width: '100%',
            }}
          >
            Add to Collection
          </Button>
        )}
        <div style={{}}>
          <br />
          <a href={`/shop/${props.userId}`}>
            <Button
              size='large'
              shape='round'
              type='danger'
              style={{
                width: '100%',
              }}
            >
              Creator's Shop
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductInfoMobile;
