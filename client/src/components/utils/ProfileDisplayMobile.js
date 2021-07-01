import React from 'react';
import { Progress, Button } from 'antd';

import EditProfile from '../views/SettingsPage/Sections/EditProfile';

function ProfileDisplay(props) {
  return (
    <div
      class='container'
      style={{
        float: 'center',
        backgroundColor: 'white',
        paddingTop: '40px',

        textAlign: 'center',
        justifyItems: 'center',
        justifyContent: 'center',
        width: '100%',

        backgroundPosition: '50% 50%',
        objectFit: 'cover',
        borderBottom: '2px solid #C5CBCB',
      }}
    >
      <div
      // Avatar and Name + num of cards, coins, followers , following
      >
        <div
          //Avatar, Name, Bio
          style={{
            display: 'inline-block',
          }}
        >
          <img
            alt='image1'
            class='container'
            style={{
              borderRadius: 75,
              minHeight: '100px',
              minWidth: '100px',
              maxHeight: '100px',
              maxWidth: '100px',
              verticalAlign: 'center',
              textAlign: 'center',
              justifyItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundPosition: '50% 50%',
              objectFit: 'cover',
            }}
            src={props.Avatar}
          />
          {/* User Name */}
          <div>
            <h1
              style={{
                fontSize: '24px',
                display: 'inline-block',
                color: 'black',
              }}
            >
              {' '}
              {props.Name}
            </h1>
            {props.role === 2 ? (
              <img
                alt='image1'
                style={{
                  width: '18px',
                  marginLeft: '5px',
                  marginBottom: '8px',
                }}
                src='/verifiedIcon.svg'
              />
            ) : null}
          </div>
          <div
            style={{
              paddingLeft: '5%',
              paddingRight: '5%',
              width: '100%',
              fontSize: '12px',
              display: 'inline-block',
            }}
          >
            {props.Bio}
          </div>
        </div>

        {/* User Bio */}

        <div
          style={{
            //lv, num of dbilias, coins, follower, following

            textAlign: 'center',
            justifyItems: 'center',
            justifyContent: 'center',

            // width: '50%',
          }}
        >
          <div
            style={{
              display: 'inline-block',
            }}
          >
            <div
              style={{
                display: 'inline-block',

                paddingLeft: '5px',
                paddingRight: '5px',
                // textAlign: 'center',
                // justifyItems: 'center',
                // justifyContent: 'center',
                // width: '400px',
              }}
            >
              <h3
                style={{
                  marginBottom: '-5px',
                }}
              >
                {`Tier ${props.Level}`}
              </h3>
              <h3
                style={{
                  marginTop: '-5px',
                  fontSize: '12px',
                }}
              >
                Collection
              </h3>
            </div>
            {/* <h3
						style={{
							
							paddingTop: '10px',
							paddingLeft: '10px',
							paddingRight: '10px',
							// textAlign: 'center',
							// justifyItems: 'center',
							// justifyContent: 'center',
							// width: '400px',
						}}
					>
						{`LV.${props.Level} Collection`}
					</h3> */}
          </div>

          {/* User Cards */}

          <div
            style={{
              display: 'inline-block',

              paddingLeft: '5px',
              paddingRight: '5px',
              // textAlign: 'center',
              // justifyItems: 'center',
              // justifyContent: 'center',
              // width: '400px',
            }}
          >
            <h3
              style={{
                marginBottom: '-5px',
              }}
            >
              {`${props.numOfDbilias}`}
            </h3>
            <h3
              style={{
                marginTop: '-5px',
                fontSize: '12px',
              }}
            >
              Cards
            </h3>
          </div>

          <a href={`/user/followerspage/${props.userId}`}>
            <div
              style={{
                display: 'inline-block',

                paddingLeft: '5px',
                paddingRight: '5px',
                // textAlign: 'center',
                // justifyItems: 'center',
                // justifyContent: 'center',
                // width: '400px',
              }}
            >
              <h3
                style={{
                  marginBottom: '-5px',
                }}
              >
                {`     ${props.numberWithCommas(props.Followers)}`}
              </h3>
              <h3
                style={{
                  marginTop: '-5px',
                  fontSize: '12px',
                }}
              >
                Followers
              </h3>
            </div>
          </a>
          <a href={`/user/followingpage/${props.userId}`}>
            <div
              style={{
                display: 'inline-block',

                paddingLeft: '5px',
                paddingRight: '5px',
                // textAlign: 'center',
                // justifyItems: 'center',
                // justifyContent: 'center',
                // width: '400px',
              }}
            >
              <h3
                style={{
                  marginBottom: '-5px',
                }}
              >
                {`     ${props.numberWithCommas(props.Following)}`}
              </h3>
              <h3
                style={{
                  marginTop: '-5px',
                  fontSize: '12px',
                }}
              >
                Following
              </h3>
            </div>
          </a>

          {/* User Money */}
          {/* <h3
						style={{
							display: 'inline-block',
							
							paddingLeft: '5px',
							paddingRight: '5px',
							// textAlign: 'center',
							// justifyItems: 'center',
							// justifyContent: 'center',
							// width: '400px',
						}}
					>
						<img
							style={{
								width: '15px',
								height: '20px',
								paddingBottom: '5px',
							}}
							src="/coinSVF.svg"
							alt="image"
						/>
						{`     ${props.numberWithCommas(props.Money)}`}
					</h3> */}
          {/* User Followers */}

          {/* User Following */}

          {/* User Progress Bar */}
          <div
            style={{
              paddingLeft: '5%',
              paddingRight: '5%',
            }}
          >
            <Progress
              // type="circle"
              percent={props.ProgressBar}
              status='active'
              format={(percent) => `    Tier ${props.Level + 1} `}
            />
          </div>
        </div>
      </div>

      <div></div>
      {/* Edit profile/ Follow/Unfollow Button */}
      <div
        style={{
          // display: 'inline-block',
          textAlign: 'center',
          justifyItems: 'center',
          justifyContent: 'center',

          // minWidth: '30px',
        }}
      >
        {props.UsersPage ? (
          <div>
            <EditProfile
              url={props.url}
              Avatar={props.Avatar}
              Bio={props.Bio}
              Name={props.Name}
            />
          </div>
        ) : (
          <div>
            {props.CurrentlyFollowing ? (
              <Button
                style={{
                  color: 'grey',
                }}
                // onClick={setProfile(false)}
                onClick={props.handleUnFollow}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                style={{
                  color: 'blue',
                }}
                // onClick={setProfile(false)}
                onClick={props.handleFollow}
              >
                Follow
              </Button>
            )}
          </div>
        )}
      </div>
      <div
        style={{
          textAlign: 'center',
          justifyItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>
          <Button
            type='link'
            style={{
              color: props.collectionColor,
            }}
          >
            <a href={`/collection/${props.userId}`}>Collection</a>
          </Button>
          <Button
            type='link'
            style={{
              color: props.shopColor,
            }}
          >
            <a href={`/shop/${props.userId}`}>Shop</a>
          </Button>
          <Button
            type='link'
            style={{
              color: props.linksColor,
            }}
          >
            <a href={`/link/${props.userId}`}>Links</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileDisplay;
