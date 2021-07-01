import React from 'react'
import {  Button } from 'antd';

function PageSelectNoFeat(props) {
    return (
        <div
				class="container"
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
				{props.ShowProducts ? (
					<div>
						<Button
							type="link"
							style={{
								color: 'dimgrey',
							}}
							onClick={props.handleShowProducts}
						>
							Feed
						</Button>
						<Button
							type="link"
							style={{
								color: 'lightgray',
							}}
							onClick={props.handleShowLeaderboard}
						>
							Top Collections
						</Button>
					</div>
				) : null}{' '}
				{props.ShowLeaderboard ? (
					<div>
						<Button
							type="link"
							style={{
								color: 'lightgrey',
							}}
							onClick={props.handleShowProducts}
						>
							Feed
						</Button>
						<Button
							type="link"
							style={{
								color: 'dimgray',
							}}
							onClick={props.handleShowLeaderboard}
						>
							Top Collections
						</Button>
					</div>
				) : null}{' '}
			</div>
    )
}

export default PageSelectNoFeat
