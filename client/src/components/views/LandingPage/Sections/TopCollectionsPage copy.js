import React from 'react';

function TopCollectionsPage(props) {
	return (

            <div
			style={{
				marginTop:'-50px',
			}}
			>
			{props.Users.length === 0 ? (
				<div>
					<h2>No users yet...</h2>
				</div>
			) : (
				<div>
				<div style={{
					width:'320px',
					margin: '0 auto',	
                }}
				>
				{props.renderUsers}</div>
				</div>
			)}
			<br /> <br />
			{props.PostSize >= props.Limit && (
				<div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto', }}>
					<button onClick={props.onLoadMoreUsers}>Load More</button>
				</div>
			)}
		</div>
	);
}

export default TopCollectionsPage;
