import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Button } from 'antd';

function OtherFollowersPage(props) {
  const userId = props.match.params.userId;
  const [UsersFollowers, setUsersFollowers] = useState([]);
  const [Following, setFollowing] = useState([]);

  useEffect(() => {
    let followingList = [];
    Axios.get(`/api/users/getotheruser?_id=${userId}`).then((response) => {
      console.log('response of this user');
      console.log(response.data.users[0]);
      if (response.data.users[0].followers.length > 0) {
        response.data.users[0].followers.forEach((item) => {
          Axios.get(`/api/users/getUserById?_id=${item.id}`).then(
            (response) => {
              if (response.data.success) {
                followingList.push(response.data.users);
                setUsersFollowers(...UsersFollowers, response.data.users);
              } else {
                alert('failed to fetch product data');
              }
            }
          );
          setFollowing(followingList);
        });
      }
    });
    // eslint-disable-next-line
  }, []);

  const renderUsers = Following.map((Users, index) => {
    return (
      <a href={`../${Users._id}`}>
        <div
          className='userCard'
          style={{
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <img
            alt='image1'
            style={{
              borderRadius: 75,

              minHeight: '75px',
              minWidth: '75px',
              maxHeight: '75px',
              maxWidth: '75px',
              overflow: 'hidden',
              backgroundPosition: '50% 50%',
              objectFit: 'cover',
              marginLeft: '5px',
              marginRight: '10px',

              marginTop: '-70px',
            }}
            src={Users.image}
          />
          <div
            style={{
              display: 'inline-block',
            }}
          >
            <div
              style={{
                fontSize: '40px',
              }}
            >
              {Users.username}
              {Users.role === 2 ? (
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
            <div>Vibes {Users.cart.length}</div>
          </div>
        </div>
      </a>
    );
  });

  return (
    <div style={{ width: '100%', backgroundColor: '#f6f6f6' }}>
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
        <div>
          <Button
            type='link'
            style={{
              color: 'dimgray',
            }}
            // onClick={handleShowDbilia}
          >
            <a href={`/user/followerspage/${userId}`}>Followers </a>
          </Button>
          <Button
            type='link'
            style={{
              color: 'lightgrey',
            }}
            // onClick={handleShowUser}
          >
            <a href={`/user/followingpage/${userId}`}>Following </a>
          </Button>
        </div>
      </div>

      {renderUsers}
    </div>
  );
  // const [UsersFollowers, setUsersFollowers] = useState([]);
  // const [Following, setFollowing] = useState([]);

  // useEffect(() => {
  // 	let followingList = [];

  // 	if (props.user.userData) {
  // 		// setFollowingCount(props.user.userData.following.length);
  // 	}

  // 	if (props.user.userData && props.user.userData.following) {
  // 		if (props.user.userData.following.length > 0) {
  // 			props.user.userData.following.forEach((item) => {
  // 				Axios.get(`/api/users/getUserById?_id=${item.id}`).then((response) => {
  // 					if (response.data.success) {
  // 						followingList.push(response.data.users);
  // 						setUsersFollowers(...UsersFollowers, response.data.users);
  // 					} else {
  // 						alert('failed to fetch product data');
  // 					}
  // 				});

  // 				//this works but the console.logs dont show it working?
  // 				console.log('follingList');
  // 				console.log(followingList);
  // 				setFollowing(followingList);
  // 			});

  // 			console.log('following');
  // 			console.log(Following);
  // 			console.log('usersfollowing');
  // 			console.log(UsersFollowers);
  // 		}
  // 	}
  // }, [props.user.userData]);

  // const renderUsers = Following.map((Users, index) => {
  // 	return (
  // 		<a href={`../${Users._id}`}>
  // 			<div
  // 				className="userCard"
  // 				style={{
  // 					backgroundColor: 'white',
  // 				}}
  // 			>
  // 				<img
  // 					style={{
  // 						borderRadius: 75,

  // 						minHeight: '75px',
  // 						minWidth: '75px',
  // 						maxHeight: '75px',
  // 						maxWidth: '75px',
  // 						overflow: 'hidden',
  // 						backgroundPosition: '50% 50%',
  // 						objectFit: 'cover',
  // 						marginLeft: '5px',
  // 						marginRight: '10px',

  // 						marginTop: '-70px',
  // 					}}
  // 					src={`http://localhost:5000/${Users.image}`}
  // 				/>
  // 				<div
  // 					style={{
  // 						display: 'inline-block',
  // 					}}
  // 				>
  // 					<div
  // 						style={{
  // 							fontSize: '40px',
  // 						}}
  // 					>
  // 						{Users.name}
  // 						{Users.role == 2 ? (
  // 							<img
  // 								style={{
  // 									width: '20px',
  // 									marginLeft: '3px',
  // 									marginBottom: '6px',
  // 								}}
  // 								src="/verifiedIcon.svg"
  // 								alt="image"
  // 							/>
  // 						) : null}
  // 					</div>
  // 					<div>Vibes {Users.cart.length}</div>
  // 				</div>
  // 			</div>
  // 		</a>
  // 	);
  // });

  // return (
  // 	<div style={{ width: '100%', backgroundColor: '#f6f6f6' }}>
  // 		<div
  // 			class="container"
  // 			style={{
  // 				float: 'center',
  // 				backgroundColor: 'white',
  // 				paddingTop: '40px',

  // 				textAlign: 'center',
  // 				justifyItems: 'center',
  // 				justifyContent: 'center',
  // 				width: '100%',

  // 				backgroundPosition: '50% 50%',
  // 				objectFit: 'cover',
  // 				borderBottom: '2px solid #C5CBCB',
  // 			}}
  // 		>
  // 			<div>
  // 				<Button
  // 					type="link"
  // 					style={{
  // 						color: 'lightgrey',
  // 					}}
  // 					// onClick={handleShowDbilia}
  // 				>
  // 					<a href="/user/collection/followerspage">Followers</a>
  // 				</Button>
  // 				<Button
  // 					type="link"
  // 					style={{
  // 						color: 'dimgray',
  // 					}}
  // 					// onClick={handleShowUser}
  // 				>
  // 					<a href="/user/collection/followingpage">Following</a>
  // 				</Button>
  // 			</div>
  // 		</div>

  // 		{renderUsers}
  // 	</div>
  // );
}

export default OtherFollowersPage;
