import AnimatedCard from '@sl-codeblaster/react-3d-animated-card';
import React from 'react';
import useWindowDimensions from '../../NavBar/Sections/ScreenWidth';

function UnlockableContent({ product }) {
  const { width } = useWindowDimensions();
  return (
    <div>
      {/* 
		this animated card cam from:
		https://www.npmjs.com/package/@sl-codeblaster/react-3d-animated-card */}
      <AnimatedCard
        config={{
          rotation: 15, // this value for the divide (window.innerWidth / 2 - e.pageX) / rotation && (window.innerWidth / 2 - e.pageY) / rotation
          transition: {
            duration: 1,
            timingMode: 'ease',
          },
          transform: {
            figureIcon: {
              rotation: 20,
              translateZ: 160,
            },
            titleTranslateZ: 100,
            bodyTextTranslateZ: 100,
            buttonTranslateZ: 80,
          },
        }}
        style={{
          width: '100%', //container style (you can use className as well)
        }}
      >
        <div
          style={{
            width: 240,
            height: 240.66666666667,
            borderRadius: 25,
            display: 'flex',

            verticalAlign: 'center',
            textAlign: 'center',
            justifyItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className='card'
            style={{
              width: 240,
              height: 240.66666666667,
              borderRadius: 25,
              display: 'flex',

              marginTop: '-10px',
              justifyItems: 'center',
              justifyContent: 'center',
            }}
          >
            {product.unlockableMedia &&
            product.unlockableMedia[0].split('/')[4] == 'video' ? (
              <video
                autoPlay
                loop
                muted
                height='auto'
                width='100%'
                className='bid-popup__image'
                style={{
                  borderRadius: 20,
                  marginRight: '10px',
                  height: width > 1160 ? '341px' : '270px',
                  width: width > 1160 ? '341px' : '270px',
                  marginTop: width < 1160 && '10rem',
                  marginBottom: width < 1160 && '5rem',
                  verticalAlign: 'center',
                  textAlign: 'center',
                  justifyItems: 'center',
                  justifyContent: 'center',
                  objectFit: 'cover',
                }}
              >
                <source src={product.unlockableMedia} type='video/mp4' />
                <source src={product.unlockableMedia} type='video/ogg' />
                <source src={product.unlockableMedia} type='video/webm' />
              </video>
            ) : (
              <img
                className='title'
                alt='image1'
                style={{
                  borderRadius: 20,
                  marginRight: '10px',
                  height: width > 1160 ? '341px' : '270px',
                  width: width > 1160 ? '341px' : '270px',
                  marginTop: width < 1160 && '10rem',
                  marginBottom: width < 1160 && '5rem',

                  verticalAlign: 'center',
                  textAlign: 'center',
                  justifyItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto',

                  objectFit: 'cover',
                }}
                src={product.unlockableMedia}
              />
            )}
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}

export default UnlockableContent;
