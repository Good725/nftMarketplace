import React, { useEffect, useState } from 'react';
import { Button, Descriptions } from 'antd';
import { useDispatch } from 'react-redux';
import { addCoins, updateSold } from '../../../../_actions/user_actions';
import { purchaseCardFromMarket } from '../../../../_actions/market_actions';
import { useSelector } from 'react-redux';

function MarketItemInfo(props) {
  const [Product, setProduct] = useState({});
  const [Money, setMoney] = useState(0);

  const dispatch = useDispatch();
  const Axios = require('axios');
  const edition = useSelector((state) => state.market.marketEdition);
  const user = useSelector((state) => state.user.userData);

  useEffect(() => {
    setProduct(props.detail);
  }, [props.detail, user]);

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
    if (Money >= Product.price) {
      let wallet = Money - Product.price;

      dispatch(addCoins(wallet));
      dispatch(purchaseCardFromMarket(Product._id, edition));
      alert(`Card Purchased from market ${Product._id}`);

      window.location.reload();
    } else {
      alert('not enough coins');
    }
  }

  return (
    <div>
      <Descriptions>
        <Descriptions.Item label='Price'>
          {' '}
          {
            <h3
              style={{
                display: 'inline-block',
                paddingTop: '10px',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
            >
              <img
                style={{
                  width: '14px',

                  paddingBottom: '3px',
                }}
                src='/coinSVF.svg'
                alt='image1'
              />
              {`     ${Product.price}`}
            </h3>
          }
        </Descriptions.Item>

        <Descriptions.Item label='Edition'>{edition}</Descriptions.Item>
        <Descriptions.Item label='Creator'>{props.writer}</Descriptions.Item>
        <Descriptions.Item label='Description'>
          {' '}
          {Product.description}
        </Descriptions.Item>
      </Descriptions>

      <br />
      <br />
      <br />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button size='large' shape='round' type='danger' onClick={checkFunds}>
          Buy Edition
        </Button>

        <div
          style={{
            marginLeft: '10px',
          }}
        >
          <a href={`/shop/${props.userId}`}>
            <Button size='large' shape='round' type='danger'>
              Creator's Shop
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MarketItemInfo;
