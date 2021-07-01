import React from 'react';
import BuyPackCards from './Sections/BuyPackCards';
import BuyPackButton from './Sections/BuyPackButton';

function BuyPackPage(props) {
  const packId = props.match.params.packId;

  return (
    <div style={{ display: 'grid' }}>
      <BuyPackCards packId={packId} />
      <BuyPackButton packId={packId} />
    </div>
  );
}

export default BuyPackPage;
