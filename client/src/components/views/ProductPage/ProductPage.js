import React, { useEffect, useState } from 'react';
import ProductInfo from './Sections/ProductInfo';
import { addToCart, getProfileUser } from '../../../_actions/user_actions';
import { useDispatch, useSelector } from 'react-redux';
import Card3d from '../../utils/Card3d';
import { getSingleProduct } from '../../../_actions/product_actions';
import ProductInfoAuction from './Sections/ProductInfoAuction';
import useWindowDimensions from '../NavBar/Sections/ScreenWidth';
import moment from 'moment';
import { setEditionsOpen } from '../../../_actions/in_view_actions';
import { resetCollection } from '../../../_actions/_infinite_actions';

function ProductPage(props) {
  const dispatch = useDispatch();

  const productId = props.match.params.productId;
  const [Product, setProduct] = useState([]);
  const [User, setUser] = useState('');
  const [Username, setUsername] = useState('');
  const [UserId, setUserId] = useState('');
  const [Role, setRole] = useState('');
  const [CreatorMoney, setCreatorMoney] = useState(0);

  const [isShown] = useState(true);
  const { singleItem, bidSuccess, bidUpdateSuccess } = useSelector(
    (state) => state.product
  );
  const { width } = useWindowDimensions();
  useEffect(() => {
    dispatch(getSingleProduct(productId));
    // eslint-disable-next-line
  }, [window.location.pathname, bidSuccess, bidUpdateSuccess]);

  // WILL EVENTUALLY REFACTOR ALONG WITH CARD3 + PRODUCTINFO
  useEffect(() => {
    if (singleItem) {
      setProduct(singleItem);
      setUsername(singleItem.writer.username);
      setUser(singleItem.writer);
      setUserId(singleItem.writer._id);
      setCreatorMoney(+singleItem.writer.money.$numberDecimal);
      setRole(singleItem.writer.role);
    }
  }, [singleItem]);

  const addToCartHandler = (productId) => {
    console.log('HANDLER');
    dispatch(resetCollection());
    dispatch(addToCart(productId));
  };

  return (
    <div className='product'>
      <div className='product__card'>
        <Card3d
          product={Product}
          writer={Username}
          role={Role}
          overflow={isShown}
        />
      </div>

      {/* {account ? (
        <div>
          Ethereum address:{' '}
          <u>{account.substring(0, 6) + '...' + account.substring(38, 42)}</u>
          &nbsp; network: <u>{network}</u>&nbsp; balance: <u>{balance} ETH</u>
          &nbsp;
        </div>
      ) : (
        <button
          className='product__metamask-button'
          style={{ marginTop: '10rem' }}
          onClick={() => window.ethereum.enable()}
        >
          Connect Metamask
        </button>
      )} */}

      {Product.auction &&
      moment(Product.auctionDeadline) > moment(Date.now()) ? (
        <ProductInfoAuction
          detail={Product}
          writer={Username}
          userId={UserId}
          CreatorMoney={CreatorMoney}
          history={props.history}
        />
      ) : (
        <ProductInfo
          addToCart={addToCartHandler}
          detail={Product}
          writer={Username}
          userId={UserId}
          CreatorMoney={CreatorMoney}
          history={props.history}
        />
      )}
      {width > 900 && (
        <div className='product__description-section'>
          <h3 className='product__description-title'>Description</h3>
          <h3 className='product__description'>{Product.description}</h3>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
