import React from 'react';
import { Card } from 'antd';
import { useSelector } from 'react-redux';

function PackCardItem({ product, user }) {
  return (
    <div className='card__item'>
      <Card
        hoverable={true}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 25,
          borderWidth: '5px',
          borderColor: 'white',
          verticalAlign: 'center',
          textAlign: 'center',
          justifyItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundBlendMode: 'luminosity',
          outline: 'none',
        }}
      >
        <div
          style={{
            minWidth: '100%',
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            height: '241px',
            width: '241px',
            verticalAlign: 'center',
            textAlign: 'center',
            justifyItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            color: 'black',
            marginTop: '-25px',
            marginLeft: '-25px',
          }}
        >
          <img
            style={{
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              height: '241px',
              width: '241px',
              verticalAlign: 'center',
              textAlign: 'center',
              justifyItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',

              objectFit: 'cover',
            }}
            alt='image1'
            src={product.images}
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
          {user}
          {product.writer.role === 2 ? (
            <img
              style={{
                width: '10px',
                marginLeft: '3px',
                marginBottom: '3px',
              }}
              src='/verifiedIcon.svg'
              alt='image1'
            />
          ) : null}
        </div>
        <div
          style={{
            fontWeight: 'bold',
            // fontSize: `${adjustFont(product.title)}px`,
            fontSize: `14px`,
            marginBottom: '-1px',
            color: 'black',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.title}
        </div>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '10px',
            color: 'black',
          }}
        >
          {'─────'}
        </div>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '10px',
            color: 'black',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.description}
        </div>
      </Card>
    </div>
  );
}

export default PackCardItem;
