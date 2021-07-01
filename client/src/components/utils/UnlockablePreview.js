import AnimatedCard from '@sl-codeblaster/react-3d-animated-card';
import React from 'react';
import useWindowDimensions from '../views/NavBar/Sections/ScreenWidth';

function UnlockablePreview(props) {
  const { width } = useWindowDimensions();
  return (
    <>
      {props.unlockableUrl && (
        <div style={{ paddingTop: '5rem', margin: '0rem auto 5rem' }}>
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
              {props.unlockableUrl &&
              props.unlockableUrl[0].split('/')[4] == 'video' ? (
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
                    height: width > 900 ? '341px' : '270px',
                    width: width > 900 ? '341px' : '270px',
                    marginTop: width > 900 && '10rem',
                    marginBottom: width < 900 && '5rem',
                    verticalAlign: 'center',
                    textAlign: 'center',
                    justifyItems: 'center',
                    justifyContent: 'center',
                    objectFit: 'cover',
                  }}
                >
                  <source src={props.unlockableUrl} type='video/mp4' />
                  <source src={props.unlockableUrl} type='video/ogg' />
                  <source src={props.unlockableUrl} type='video/webm' />
                </video>
              ) : (
                <img
                  className='title'
                  alt='image1'
                  style={{
                    borderRadius: 20,
                    marginRight: '10px',
                    height: width > 900 ? '341px' : '270px',
                    width: width > 900 ? '341px' : '270px',
                    marginTop:
                      width > 900
                        ? '10rem'
                        : width <= 900 && width > 500
                        ? '5rem'
                        : '2rem',
                    marginBottom: width < 900 && '5rem',

                    verticalAlign: 'center',
                    textAlign: 'center',
                    justifyItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',

                    objectFit: 'cover',
                  }}
                  src={props.unlockableUrl}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {props.unlockableText && (
        <h3
          style={{
            gridRow: '2/3',
            textAlign: 'center',
            marginTop: '2rem',
          }}
        >
          {props.unlockableText}
        </h3>
      )}
    </>
  );
}

export default UnlockablePreview;
