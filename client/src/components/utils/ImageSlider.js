import React from 'react';
import { Carousel } from 'antd';

function ImageSlider(props) {
  return (
    <div>
      <Carousel autoplay>
        {props.images.map((image, index) => (
          <div
            key={index}
            style={{
              // padding: '30px',
              minWidth: '100%',

              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              minHeight: '200px',
              maxHeight: '200px',
              verticalAlign: 'center',
              textAlign: 'center',
              justifyItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundPosition: '50% 50%',
              objectFit: 'cover',
            }}
          >
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
              }}
              src={`http://localhost:5000/${image}`}
              alt='productImage'
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
