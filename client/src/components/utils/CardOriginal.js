import React from 'react';
import { Card } from 'antd';

function CardOriginal(props) {
  return (
    <div>
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
          // backgroundImage: `url('/glass.png')`,
          // backgroundColor: 'rgba(246, 246, 246, 0.7)',
          backgroundBlendMode: 'luminosity',
          // boxShadow: '3px 3px 10px 0.1px grey',
          boxShadow:
            '-10px -10px 15px rgba(255,255,255,0.5), 10px 10px 15px rgba(70,70,70,0.5)',
          outline: 'none',
        }}
      >
        <a href={`/product/${props.product._id}`}>
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
              color: 'black',
            }}
          >
            {/* <ImageSlider images={product.images} /> */}
            <img
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

                objectFit: 'cover',
              }}
              src={props.product.images}
            />
          </div>

          <div
            style={{
              color: '#d7d7d7',
              fontWeight: 'bold',
              marginTop: '10px',
              display: 'inline-block',
            }}
          >
            {props.product.writer.name}
            {props.product.writer.role == 2 ? (
              <img
                style={{
                  width: '7px',
                  marginLeft: '3px',
                  marginBottom: '3px',
                }}
                src='/verifiedIcon.svg'
                alt='image'
              />
            ) : null}
          </div>

          <p
            style={{
              fontWeight: 'bold',
              fontSize: '20px',
              marginBottom: '-1px',
              color: 'black',
            }}
          >
            {props.product.title}
          </p>
          <p
            style={{
              fontWeight: 'bold',
              fontSize: '10px',
              color: 'black',
            }}
          >
            {'─────'}
          </p>
          <p
            style={{
              fontWeight: 'bold',
              fontSize: '10px',
              color: 'black',
            }}
          >
            {props.product.description}
          </p>
          <p
            style={{
              color: '#d7d7d7',
              fontWeight: 'bold',
            }}
          >
            {/* {product.sold}/{product.editions} */}
            {props.product.numberEditions == props.product.sold
              ? 'Sold Out'
              : `${props.product.sold + 1} /  ${props.product.numberEditions}`}
          </p>
        </a>
      </Card>
    </div>
  );
}

export default CardOriginal;
