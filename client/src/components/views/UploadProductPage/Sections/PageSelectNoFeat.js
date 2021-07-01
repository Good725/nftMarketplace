import React from 'react';
import { Button } from 'antd';

function PageSelectNoFeat(props) {
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
      {props.ShowNFT ? (
        <div>
          <Button
            type='link'
            style={{
              color: 'lightgray',
            }}
            onClick={props.handleHideNFT}
          >
            NFAs
          </Button>
          <Button
            type='link'
            style={{
              color: 'black',
            }}
            onClick={props.handleShowNFT}
          >
            NFTs
          </Button>
        </div>
      ) : (
        <div>
          <Button
            type='link'
            style={{
              color: 'black',
            }}
            onClick={props.handleHideNFT}
          >
            NFAs
          </Button>
          <Button
            type='link'
            style={{
              color: 'lightgray',
            }}
            onClick={props.handleShowNFT}
          >
            NFTs
          </Button>
        </div>
      )}
    </div>
  );
}

export default PageSelectNoFeat;
