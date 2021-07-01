import React from 'react';
import { Card } from 'antd';
import './DbiliaCards.css';
import AnimatedCard from '@sl-codeblaster/react-3d-animated-card';
import UnlockablePreview from './UnlockablePreview';
import useWindowDimensions from '../views/NavBar/Sections/ScreenWidth';
import sprite from '../../img/sprite.svg';

function Card3dMirrorSimple(props) {
  const { width } = useWindowDimensions();
  const adjustFont = (x) => {
    if (x.length <= 11) {
      return '14';
    } else if (x.length > 11 && x.length <= 12) {
      return '14';
    } else if (x.length > 12 && x.length <= 14) {
      return '14';
    } else if (x.length > 14 && x.length <= 16) {
      return '14';
    } else if (x.length > 14 && x.length <= 20) {
      return '12';
    } else if (x.length > 20 && x.length <= 25) {
      return '12';
    } else if (x.length > 25 && x.length < 30) {
      return '12';
    } else {
      return '12';
    }
  };
  console.log(props.price);
  return (
    <div
      style={{
        gridColumn: width < 900 && props.guideStep === 14 ? '2/3' : '1/2',
        display: 'grid',
        alignSelf: 'start',
      }}
    >
      {width > 900 ? (
        <AnimatedCard
          config={{
            rotation: 15,
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
            width: 300, //container style (you can use className as well)
          }}
        >
          <div
            style={{
              width: 240,
              height: 425.66666666667,
              borderRadius: 25,
              display: 'flex',
              border: '10px solid grey',

              borderStyle: 'solid none solid none',
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
                height: 426.66666666667,
                borderRadius: 25,
                display: 'flex',
                border: '2px solid grey',
                backgroundColor: 'white',
                marginTop: '-10px',
                left: '-10px',
                justifyContent: 'center',
                boxShadow:
                  '10px -10px 15px rgba(255,255,255,0.5), -10px 10px 15px rgba(70,70,70,0.5)',
              }}
            >
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
                  backgroundBlendMode: 'luminosity',
                  outline: 'none',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '5px',
                    borderColor: 'black',
                    height: '240px',
                    width: '185px',
                    verticalAlign: 'center',
                    textAlign: 'center',
                    justifyItems: 'center',
                    justifyContent: 'center',
                    marginTop: '25px',
                    marginLeft: '-5px',
                    marginRight: '13px',
                  }}
                >
                  <div
                    className='content'
                    style={{
                      minWidth: '100%',
                      borderWidth: '5px',
                      borderColor: 'white',

                      height: '241px',
                      width: '185px',
                      verticalAlign: 'center',
                      textAlign: 'center',
                      justifyItems: 'center',
                      justifyContent: 'center',

                      color: 'black',
                    }}
                  >
                    {props.url.split('/')[4] == 'video' ? (
                      <video
                        autoPlay
                        loop
                        height='auto'
                        width='100%'
                        className='title'
                        style={{
                          marginRight: '10px',
                          height: '241px',
                          width: '100%',
                          verticalAlign: 'center',
                          textAlign: 'center',
                          justifyItems: 'center',
                          justifyContent: 'center',

                          objectFit: 'cover',
                        }}
                      >
                        <source src={props.url} type='video/mp4' />
                        <source src={props.url} type='video/ogg' />
                        <source src={props.url} type='video/webm' />
                      </video>
                    ) : (
                      <img
                        className='title'
                        alt='image1'
                        style={{
                          marginRight: '10px',
                          height: '241px',
                          width: '100%',
                          verticalAlign: 'center',
                          textAlign: 'center',
                          justifyItems: 'center',
                          justifyContent: 'center',

                          objectFit: 'contain',
                        }}
                        src={props.url}
                      />
                    )}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: `${adjustFont(props.TitleValue)}px`,
                    // fontSize: `12px`,
                    marginBottom: '-1px',
                    color: 'black',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {props.TitleValue}
                </div>
                <div
                  style={{
                    color: '#d7d7d7',
                    fontWeight: 'bold',
                    paddingTop: '10px',
                    display: 'inline-block',
                  }}
                >
                  {props.writer}
                  {props.role === 2 ? (
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
                    fontSize: '10px',
                    color: 'black',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {props.DescriptionValue}
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
                  <div
                    style={{
                      display: 'grid',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gridTemplateColumns: 'repeat(2, max-content)',
                    }}
                  >
                    <p
                      style={{
                        color: '#d7d7d7',
                        gridRow: '1/2',
                      }}
                    >
                      {`Edition ${1} of  ${
                        props.infinite !== 'infinite'
                          ? props.EditionValue
                          : 'Unlimited'
                      }`}
                    </p>
                  </div>
                  <div className=''>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(props.price)}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </AnimatedCard>
      ) : (
        <div
          style={{
            width: 240,
            height: 425.66666666667,
            borderRadius: 25,
            display: 'flex',

            marginBottom: '7rem',
            marginTop: '3rem',

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
              height: 426.66666666667,
              borderRadius: 25,
              display: 'flex',
              border: '2px solid grey',
              backgroundColor: 'white',
              marginTop: '-10px',
              left: '-10px',
              justifyContent: 'center',
              boxShadow:
                '10px -10px 15px rgba(255,255,255,0.5), -10px 10px 15px rgba(70,70,70,0.5)',
            }}
          >
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

                outline: 'none',
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: '5px',
                  borderColor: 'black',
                  height: '240px',
                  width: '185px',
                  verticalAlign: 'center',
                  textAlign: 'center',
                  justifyItems: 'center',
                  justifyContent: 'center',
                  marginTop: '25px',
                  marginLeft: '-5px',
                  marginRight: '13px',
                }}
              >
                <div
                  className='content'
                  style={{
                    minWidth: '100%',
                    borderWidth: '5px',
                    borderColor: 'white',

                    height: '241px',
                    width: '185px',
                    verticalAlign: 'center',
                    textAlign: 'center',
                    justifyItems: 'center',
                    justifyContent: 'center',

                    color: 'black',
                  }}
                >
                  {props.url.split('/')[4] == 'video' ? (
                    <video
                      autoPlay
                      loop
                      height='auto'
                      width='100%'
                      className='title'
                      style={{
                        marginRight: '10px',
                        height: '241px',
                        width: '100%',
                        verticalAlign: 'center',
                        textAlign: 'center',
                        justifyItems: 'center',
                        justifyContent: 'center',

                        objectFit: 'cover',
                      }}
                    >
                      <source src={props.url} type='video/mp4' />
                      <source src={props.url} type='video/ogg' />
                      <source src={props.url} type='video/webm' />
                    </video>
                  ) : (
                    <img
                      className='title'
                      alt='image1'
                      style={{
                        marginRight: '10px',
                        height: '241px',
                        width: '100%',
                        verticalAlign: 'center',
                        textAlign: 'center',
                        justifyItems: 'center',
                        justifyContent: 'center',

                        objectFit: 'contain',
                      }}
                      src={props.url}
                    />
                  )}
                </div>
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: `${adjustFont(props.TitleValue)}px`,
                  // fontSize: `12px`,
                  marginBottom: '-1px',
                  color: 'black',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {props.TitleValue}
              </div>
              <div
                style={{
                  color: '#d7d7d7',
                  fontWeight: 'bold',
                  paddingTop: '10px',
                  display: 'inline-block',
                }}
              >
                {props.writer}
                {props.role === 2 ? (
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
                  fontSize: '10px',
                  color: 'black',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {props.DescriptionValue}
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
                <div
                  style={{
                    display: 'grid',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gridTemplateColumns: 'repeat(2, max-content)',
                  }}
                >
                  <p
                    style={{
                      color: '#d7d7d7',
                      gridRow: '1/2',
                    }}
                  >
                    {`Edition ${1} of  ${
                      props.infinite !== 'infinite'
                        ? props.EditionValue
                        : 'Unlimited'
                    }`}
                  </p>
                </div>
                <div className=''>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(props.price)}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      <UnlockablePreview
        unlockableUrl={props.unlockableUrl}
        unlockableText={props.unlockableText}
      />
    </div>
  );
}

export default Card3dMirrorSimple;
