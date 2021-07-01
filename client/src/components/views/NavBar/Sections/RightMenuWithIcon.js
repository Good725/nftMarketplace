/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import {coinTrans.png} from './icons';

function RightMenuWithIcon(props) {
	const user = useSelector((state) => state.user);
	const TheUserData = useSelector((state) => state.user.userData);
	const [role] = useState(0);
	const [UserId, setUserId] = useState(0);

	const logoutHandler = () => {
		axios.get(`${USER_SERVER}/logout`).then((response) => {
			if (response.status === 200) {
				props.history.push('/login');
			} else {
				alert('Log Out Failed');
			}
		});
	};

	useEffect(() => {
		if (TheUserData) {
			setUserId(TheUserData._id);
		}
	}, [TheUserData]);

	if (user.userData && !user.userData.isAuth) {
		return (
			<Menu
				mode={props.mode}
				style={{
					textAlign: 'center',
					justifyItems: 'center',
					justifyContent: 'center',
					color: 'black',
				}}
			>
				<Menu.Item key="Home">
					<a
						href="/"
						style={{
							textAlign: 'center',
							justifyItems: 'center',
							justifyContent: 'center',
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '25px', height: '25px', fontSize: 30, marginBottom: 3 }}
							src="/home.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Coming Soon
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="SearchMenuIcon">
					<a
						href="/search"
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '20px', height: '20px', fontSize: 30, marginBottom: 3 }}
							src="/searchIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Coming Soon
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="Marketplace">
					<a
						href="/marketplace"
						style={{
							fontSize:'10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '23px', height: '23px', fontSize: 30, marginBottom: 3 }}
							src="/marketplaceIcon.svg"
							alt="image"
						/>
						<p
						style={{
							fontSize:'10px',
							// padding: '-50PX',
							marginBottom: '-25px',
							marginTop: '-25px',
						}}
						>
						Coming Soon
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="Coins">
					<a
						href="/coins"
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '20px', height: '20px', fontSize: 30, marginBottom: 3 }}
							src="/coinIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Coins
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="upload">
					<a
						href="/product/upload"
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{
								width: '23px',
								height: '23px',
								fontSize: 30,
								marginBottom: 3,

								textAlign: 'center',
								justifyItems: 'center',
								justifyContent: 'center',
							}}
							src="/threeCardsIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Create
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="Profile">
					<a
						href={`/collection/${UserId}`}
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{
								width: '20px',
								height: '20px',
								fontSize: 30,
								marginBottom: 3,

								textAlign: 'center',
								justifyItems: 'center',
								justifyContent: 'center',
							}}
							src="/ProfileIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Profile
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="mail">
					<a href="/login">Log In</a>
				</Menu.Item>
			</Menu>
		);
	} else if (role == 1 || 2) {
		return (
			<Menu
				mode={props.mode}
				style={{
					textAlign: 'center',
					justifyItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Menu.Item key="Home">
					<a
						href="/"
						style={{
							textAlign: 'center',
							justifyItems: 'center',
							justifyContent: 'center',
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '25px', height: '25px', fontSize: 30, marginBottom: 3 }}
							src="/home.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
								color: 'green',
							}}
						>
							Coming Soon
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="SearchMenuIcon">
					<a
						href="/search"
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '20px', height: '20px', fontSize: 30, marginBottom: 3 }}
							src="/searchIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Coming Soon
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="Marketplace">
					<a
						href="/marketplace"
						style={{
							fontSize:'10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '23px', height: '23px', fontSize: 30, marginBottom: 3 }}
							src="/marketplaceIcon.svg"
							alt="image"
						/>
						<p
						style={{
							fontSize:'10px',
							// padding: '-50PX',
							marginBottom: '-25px',
							marginTop: '-25px',
						}}
						>
						Coming Soon
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="Coins">
					<a
						href="/coins"
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '20px', height: '20px', fontSize: 30, marginBottom: 3 }}
							src="/coinIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Coins
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="upload">
					<a
						href="/product/upload"
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{
								width: '23px',
								height: '23px',
								fontSize: 30,
								marginBottom: 3,

								textAlign: 'center',
								justifyItems: 'center',
								justifyContent: 'center',
							}}
							src="/threeCardsIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Create
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="Profile">
					<a
						href={`/collection/${UserId}`}
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{
								width: '20px',
								height: '20px',
								fontSize: 30,
								marginBottom: 3,

								textAlign: 'center',
								justifyItems: 'center',
								justifyContent: 'center',
							}}
							src="/ProfileIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Profile
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="logout">
					<a onClick={logoutHandler}>Logout</a>
				</Menu.Item>
			</Menu>
		);
	} else {
		return (
			<Menu
				mode={props.mode}
				style={{
					textAlign: 'center',
					justifyItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Menu.Item key="Home">
					<a
						href="/"
						style={{
							textAlign: 'center',
							justifyItems: 'center',
							justifyContent: 'center',
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '25px', height: '25px', fontSize: 30, marginBottom: 3 }}
							src="/home.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Coming Soon
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="SearchMenuIcon">
					<a
						href="/search"
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '20px', height: '20px', fontSize: 30, marginBottom: 3 }}
							src="/searchIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Coming Soon
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="Marketplace">
					<a
						href="/marketplace"
						style={{
							fontSize:'10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '23px', height: '23px', fontSize: 30, marginBottom: 3 }}
							src="/marketplaceIcon.svg"
							alt="image"
						/>
						<p
						style={{
							fontSize:'10px',
							// padding: '-50PX',
							marginBottom: '-25px',
							marginTop: '-25px',
						}}
						>
						Coming Soon
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="Coins">
					<a
						href="/coins"
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{ width: '20px', height: '20px', fontSize: 30, marginBottom: 3 }}
							src="/coinIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Coins
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="upload">
					<a
						href="/product/upload"
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{
								width: '23px',
								height: '23px',
								fontSize: 30,
								marginBottom: 3,

								textAlign: 'center',
								justifyItems: 'center',
								justifyContent: 'center',
							}}
							src="/threeCardsIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Create
						</p>
						<br />
					</a>
				</Menu.Item>
				<Menu.Item key="Profile">
					<a
						href={`/collection/${UserId}`}
						style={{
							fontSize: '10px',
							height: '68px',
						}}
					>
						<img
							style={{
								width: '20px',
								height: '20px',
								fontSize: 30,
								marginBottom: 3,

								textAlign: 'center',
								justifyItems: 'center',
								justifyContent: 'center',
							}}
							src="/ProfileIcon.svg"
							alt="image"
						/>
						<p
							style={{
								fontSize: '10px',
								// padding: '-50PX',
								marginBottom: '-25px',
								marginTop: '-25px',
							}}
						>
							Profile
						</p>
						<br />
					</a>
				</Menu.Item>

				<Menu.Item key="logout">
					<a onClick={logoutHandler}>Logout</a>
				</Menu.Item>
			</Menu>
		);
	}
}

export default withRouter(RightMenuWithIcon);
