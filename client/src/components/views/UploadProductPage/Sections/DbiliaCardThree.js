import React from 'react';
import { Card } from 'antd';

function DbiliaCardThree(props) {
  return (
    <div>
      <div
        style={{
          width: 240,
          height: 426.66666666667,
          borderRadius: 25,
          //display:'flex',
          border: '2px solid grey',
          backgroundColor: 'white',

          //verticalAlign: 'center',
          //textAlign: 'center',
          //justifyItems: 'center',
          //justifyContent: 'center',
          boxShadow:
            '-10px -10px 15px rgba(255,255,255,0.5), 10px 10px 15px rgba(70,70,70,0.5)',
          //overflow: 'hidden',
          // backgroundImage: `url('/glass.png')`,
          // backgroundColor: 'rgba(246, 246, 246, 0.7)',
          //backgroundBlendMode: 'luminosity',
          // boxShadow: '3px 3px 10px 0.1px grey',
          //boxShadow: '-10px -10px 15px rgba(255,255,255,0.5), 10px 10px 15px rgba(70,70,70,0.5)',
        }}
      >
        <Card
          hoverable={true}
          style={{
            // padding: '10px',
            // paddingLeft: '10px',
            // paddingRight: '10px',

            // paddingTop: '10px',

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
            // backgroundImage: `url('/glass.png')`,
            // backgroundColor: 'rgba(246, 246, 246, 0.7)',
            backgroundBlendMode: 'luminosity',
            // boxShadow: '3px 3px 10px 0.1px grey',

            outline: 'none',
          }}
        >
          <div
            style={{
              // padding: '30px',
              minWidth: '100%',
              // minHeight: '70%',

              // borderRadius: 10,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              // minHeight: '200px',
              // maxHeight: '200px',
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
            {/* <ImageSlider images={product.images} /> */}
            <img
              alt='image1'
              style={{
                // padding: '30px',
                // minWidth: '100%',
                // minHeight: '70%',
                // borderRadius: 10,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                // minHeight: '200px',
                // maxHeight: '200px',
                // minHeight: '200px',
                // maxHeight: '200px',
                height: '241px',
                width: '241px',
                verticalAlign: 'center',
                textAlign: 'center',
                justifyItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                backgroundColor: 'black',

                objectFit: 'cover',
              }}
              src={props.url}
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
            Username
            {/* {props.writer} */}
            {/* {props.role == 2 ? (
								<img
									style={{
										width: '7px',
										marginLeft: '3px',
										marginBottom: '3px',
									}}
									src="/verifiedIcon.svg"
									alt="image"
								/>
							) : null} */}
          </div>

          <p
            style={{
              fontWeight: 'bold',
              fontSize: '20px',
              marginBottom: '-1px',
              color: 'black',
            }}
          >
            {props.TitleValue}
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
            {props.DescriptionValue}
          </p>
          <p
            style={{
              color: '#d7d7d7',
              fontWeight: 'bold',
            }}
          >
            1/{props.EditionValue}
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
      </div>
    </div>
  );
}

export default DbiliaCardThree;
