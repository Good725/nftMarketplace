import React from 'react';
import { Card, Col } from 'antd';
import ImageSlider from '../../../utils/ImageSlider';

function RenderCard(props) {
  return (
    <div>
      <Col>
        <Card
          hoverable={true}
          style={{
            // padding: '10px',
            // paddingLeft: '10px',
            // paddingRight: '10px',

            // paddingTop: '10px',
            width: 240,
            height: 426.66666666667,
            borderRadius: 25,
            borderWidth: '1px',
            borderColor: 'light-grey',
            overflow: 'hidden',
            verticalAlign: 'center',
            textAlign: 'center',
            justifyItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            // backgroundImage: `url('/resizeCardTexture.jpg')`,
          }}
          // cover={
          // 	<a href={`/product/${product._id}`}>
          // 		{' '}
          // 		<ImageSlider images={product.images} />
          // 	</a>
          // }
        >
          <div
            style={{
              // padding: '30px',
              minWidth: '100%',
              // minHeight: '70%',

              // borderRadius: 10,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              minHeight: '200px',
              maxHeight: '200px',
              verticalAlign: 'center',
              textAlign: 'center',
              justifyItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <ImageSlider images={props.Image} />
          </div>

          <p
            style={{
              color: '#d7d7d7',
              fontWeight: 'bold',
            }}
          >
            {/* {props.user.userData._id} */}
            user
          </p>

          <p
            style={{
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            {props.title}
          </p>
          <p>{'─────'}</p>
          <p
            style={{
              fontWeight: 'bold',
              fontSize: '10px',
            }}
          >
            {props.description}
          </p>

          {/* <Meta
						style={{
							maxHeight: '100px',
							verticalAlign: 'bottom',

							textAlign: 'center',
							justifyItems: 'center',
							justifyContent: 'center',
						}}
						// title={`${product.title}`}
						description={`${product.price} coins`}
					/> */}
        </Card>
      </Col>
    </div>
  );
}

export default RenderCard;
