import React from 'react';

function FeaturedName(props) {
  return (
    <div>
      {window.innerWidth > 900 ? (
        <div
          style={{
            backgroundColor: 'white',
            height: '85px',
            paddingLeft: '5%',
            paddingRight: '5%',
          }}
        >
          <a href={`/shop/${props.Users._id}`}>
            <img
              style={{
                borderRadius: 75,
                height: '150px',
                width: '150px',
                marginTop: '10px',
                marginLeft: '5px',
                marginRight: '10px',
                marginBottom: '100px',
              }}
              src={props.Users.image}
              alt='image1'
            />

            <div
              style={{
                display: 'inline-block',
                color: 'black',
              }}
            >
              <div
                style={{
                  fontSize: '60px',
                  marginTop: '6px',
                }}
              >
                {props.Users.username}
                {props.Users.role === 2 ? (
                  <img
                    style={{
                      width: '40px',
                      marginLeft: '6px',
                      marginBottom: '1px',
                    }}
                    src='/verifiedIcon.svg'
                    alt='image1'
                  />
                ) : null}
              </div>
            </div>
          </a>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'white',
            height: '85px',
            width: '100%',
            paddingLeft: '5%',
            paddingRight: '5%',
          }}
        >
          <a href={`/shop/${props.Users._id}`}>
            <img
              style={{
                borderRadius: 75,
                height: '75px',
                width: '75px',
                marginTop: '10px',
                marginLeft: '5px',
                marginRight: '10px',
                marginBottom: '60px',
              }}
              alt='image1'
              src={props.Users.image}
            />

            <div
              style={{
                display: 'inline-block',
                color: 'black',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  marginTop: '6px',
                }}
              >
                {props.Users.username}
                {props.Users.role === 2 ? (
                  <img
                    style={{
                      width: '20px',
                      marginLeft: '3px',
                      marginBottom: '6px',
                    }}
                    src='/verifiedIcon.svg'
                    alt='image1'
                  />
                ) : null}
              </div>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}

export default FeaturedName;
