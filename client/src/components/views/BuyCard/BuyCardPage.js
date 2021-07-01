import React, { useEffect, useState } from 'react';
import { addToCart } from '../../../_actions/user_actions';
import { useDispatch, useSelector } from 'react-redux';
import Card3d from '../../utils/Card3d';
import { getSingleProduct } from '../../../_actions/product_actions';
import ProductMarketInfo from '../ProductPage/Sections/ProductMarketInfo';

function ProductPageOwn(props) {
  const dispatch = useDispatch();

  const productId = props.match.params.productId;
  const [Product, setProduct] = useState([]);
  const [User, setUser] = useState('');
  const [Username, setUsername] = useState('');
  const [UserId, setUserId] = useState('');
  const [Role, setRole] = useState('');
  const [CreatorMoney, setCreatorMoney] = useState(0);

  const [isShown] = useState(true);
  const singleItem = useSelector((state) => state.product.singleItem);
  const updateBid = useSelector((state) => state.product.bidUpdateSuccess);

  useEffect(() => {
    dispatch(getSingleProduct(productId));
    // eslint-disable-next-line
  }, [window.location.pathname, updateBid]);

  // WILL EVENTUALLY REFACTOR ALONG WITH CARD3 + PRODUCTINFO
  useEffect(() => {
    if (singleItem) {
      setProduct(singleItem);
      setUsername(singleItem.writer.username);
      setUser(singleItem.writer);
      setUserId(singleItem.writer._id);
      setCreatorMoney(singleItem.writer.money);
      setRole(singleItem.writer.role);
    }
  }, [singleItem]);

  const addToCartHandler = (productId) => {
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
      <ProductMarketInfo
        addToCart={addToCartHandler}
        detail={Product}
        writer={Username}
        userId={UserId}
        CreatorMoney={CreatorMoney}
        history={props.history}
        collection='own'
      />
    </div>
  );
}

export default ProductPageOwn;
