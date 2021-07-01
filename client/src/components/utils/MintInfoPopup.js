import React from 'react';

function MintInfoPopup(props) {
  return (
    <div className={bidOpen ? 'bid-popup bid-popup--visible' : 'bid-popup'}>
      <div className='bid-popup__window'>
        <h2 className='bid-popup__title'>Place or Edit Bid</h2>
        {width > 900 && (
          <div className='bid-popup__image'>
            {Product.images && Product.images[0].split('/')[4] == 'video' ? (
              <video
                autoPlay
                loop
                muted
                height='auto'
                width='100%'
                className='bid-popup__image-item'
              >
                <source src={Product.images} type='video/mp4' />
                <source src={Product.images} type='video/ogg' />
                <source src={Product.images} type='video/webm' />
              </video>
            ) : (
              <img
                className='bid-popup__image-item'
                alt='image1'
                src={Product.images}
              />
            )}
          </div>
        )}
        <>
          <button
            className='bid-popup__close'
            onClick={() => dispatch(setBidOpen(false))}
          >
            &times;
          </button>
          {/* {Product.auctionHistory && Product.auctionHistory.length > 0 && ( */}
          <>
            <h3 className='bid-popup__history-title'>Bidding History</h3>
            {Product.auctionHistory && Product.auctionHistory.length === 0 ? (
              <div className='bid-popup__first-bid'>
                <p>Be the first to place a bid!</p>
              </div>
            ) : (
              <div className='bid-popup__table-section'>
                <table className='bid-popup__table'>
                  <thead>
                    <th>Edition</th>
                    <th>User</th>
                    <th>Bid</th>
                    <th>Time</th>
                    <th>Edit</th>
                  </thead>
                  <tbody>
                    {Product.auctionHistory &&
                      Product.auctionHistory
                        .map((item, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item.username}</td>
                            <td>
                              {updateBid === item.bidId ? (
                                <input
                                  className='bid-popup__bid-input bid-popup__bid-input--1'
                                  value={
                                    updateBidAmount == '0'
                                      ? ''
                                      : updateBidAmount
                                  }
                                  type='number'
                                  min={highestBid * 1.05}
                                  onChange={onBidUpdate}
                                  onBlur={onBidUpdateBlur}
                                />
                              ) : (
                                new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                }).format(item.bid)
                              )}
                            </td>
                            <td>{moment(item.bidTime).format('YYYY-MM-DD')}</td>
                            <td>
                              {item.userId == user._id && (
                                <>
                                  {updateBid === item.bidId ? (
                                    <button
                                      className={
                                        updateBidAmount < highestBid * 1.05
                                          ? ' bid-popup__add-button--1 bid-popup__add-button--2'
                                          : 'bid-popup__add-button bid-popup__add-button--1 '
                                      }
                                      style={{
                                        cursor:
                                          updateBidAmount < highestBid * 1.05 &&
                                          'auto',
                                      }}
                                      disabled={
                                        updateBidAmount < highestBid * 1.05
                                      }
                                      onClick={() => {
                                        updateBidAmount > highestBid * 1.05 &&
                                          dispatch(
                                            editBid(
                                              item.bidId,
                                              updateBidAmount,
                                              item.bid,
                                              user._id
                                            )
                                          );
                                        updateBidAmount > highestBid * 1.05 &&
                                          setUpdateBid(false);
                                        updateBidAmount > highestBid * 1.05 &&
                                          setUpdateBidAmount();
                                      }}
                                    >
                                      Update Bid
                                    </button>
                                  ) : (
                                    <button
                                      className={' bid-popup__add-button--2'}
                                      style={{}}
                                      onClick={() => {
                                        setUpdateBidAmount(item.bid);
                                        setUpdateBid(item.bidId);
                                      }}
                                    >
                                      Edit Bid
                                    </button>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                        .sort(function (a, b) {
                          return b.bid - a.bid;
                        })}
                  </tbody>
                </table>
                <p style={{ marginTop: '1rem' }}>
                  Updated Bid must be 5% higher than highest bid
                </p>
                <p style={{ marginTop: '1rem' }}>
                  Time remaining:{' '}
                  {moment(Product.auctionDeadline) > moment(Date.now()) && (
                    <Countdown
                      className='product__countdown'
                      date={moment(Product.auctionDeadline)}
                      key={moment(Product.auctionDeadline)}
                      renderer={renderer}
                    />
                  )}
                </p>
              </div>
            )}
          </>
          {/* )} */}

          <div className='bid-popup__enter-bid'>
            <p className='bid-popup__disclaimer'>
              Bid must be 5% higher than highest bid
            </p>
            <h3>Bid Entry (USD):</h3>
            <input
              className='bid-popup__bid-input'
              value={bidAmount == '0' ? '' : bidAmount}
              type='number'
              onChange={onBidChange}
              onBlur={onBidBlur}
              min={highestBid * 1.05}
            />
            <button
              className={
                bidAmount < highestBid * 1.05
                  ? 'bid-popup__add-button bid-popup__add-button--disabled'
                  : 'bid-popup__add-button'
              }
              style={{ cursor: bidAmount < highestBid * 1.05 && 'auto' }}
              disabled={bidAmount < highestBid * 1.05}
              onClick={checkFunds}
            >
              Place Bid
            </button>
          </div>
        </>
      </div>
    </div>
  );
}

export default MintInfoPopup;
