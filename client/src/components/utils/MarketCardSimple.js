import React from 'react';
import { Card } from 'antd';
function MarketCardSimple(props) {
  ////// RENDER /////
  return (
    <>
      <div className='card__item hello'>
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
          <a
            href={
              !props.displayCardsOwned
                ? `${props.link}${props.product._id}`
                : undefined
            }
          >
            <div
              style={{
                minWidth: '100%',

                height: '241px',
                width: '11px',
                verticalAlign: 'center',
                textAlign: 'center',
                justifyItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                color: 'black',
                marginTop: '25px',
              }}
            >
              <img
                style={{
                  height: '241px',
                  width: '100%',
                  verticalAlign: 'center',
                  textAlign: 'center',
                  justifyItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',

                  objectFit: 'contain',
                }}
                alt='image1'
                src={
                  props.product.videoPreview === 'false'
                    ? props.product.images
                    : props.product.videoPreview
                }
              />
            </div>
            <div
              style={{
                fontWeight: 'bold',
                // fontSize: `${adjustFont(props.product.title)}px`,
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
              {props.product.title}
            </div>
            <div
              style={{
                color: '#d7d7d7',
                fontWeight: 'bold',
                marginTop: '10px',
                display: 'inline-block',
              }}
            >
              {props.writer}
              {props.role === 2 ? (
                <img
                  style={{
                    width: '10px',
                    marginRight: '13px',
                    marginBottom: '3px',
                  }}
                  src='/verifiedIcon.svg'
                  alt='image1'
                />
              ) : null}
            </div>

            <div
              style={{
                color: '#d7d7d7',
                fontWeight: 'bold',
                position: 'absolute',
                bottom: '0',
                right: '15%',
                left: '15%',
              }}
            >
              {props.product.marketCount}
            </div>
          </a>
        </Card>
      </div>
    </>
  );
}

export default MarketCardSimple;
