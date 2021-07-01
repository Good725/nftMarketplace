import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTransactionsOpen } from '../../../../_actions/in_view_actions';
import { getUserTransactions } from '../../../../_actions/transaction_actions';
import moment from 'moment';
function TransactionHistory(props) {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state) => state.transactions.transactionList
  );
  const { _id } = useSelector((state) => state.user.userData);
  const transactionsOpen = useSelector((state) => state.view.transactions);

  useEffect(() => {
    dispatch(getUserTransactions());
  }, [_id]);
  return (
    <div
      className={
        transactionsOpen
          ? 'transaction-popup transaction-popup--visible'
          : 'transaction-popup'
      }
    >
      <div className='transaction-popup__window'>
        <h2 className='transaction-popup__title'>Transaction History</h2>
        <button
          className='transaction-popup__close'
          onClick={() => dispatch(setTransactionsOpen(false))}
        >
          &times;
        </button>

        <div className='transaction-popup__table-section'>
          <table className='transaction-popup__table'>
            <thead>
              <th>Date</th>
              <th>Description</th>
              <th>Withdrawals</th>
              <th>Deposit</th>
              <th>Balance</th>
            </thead>
            <tbody>
              {transactions &&
                transactions.map((item, index) => (
                  <tr>
                    <td>{moment(item.date).format('MMM Do YYYY')}</td>
                    <td>
                      {item.transactionType === 'resale'
                        ? `Resale: "${item.nftTitle}" edition ${item.edition} resold`
                        : item.transactionType === 'sale'
                        ? `Sale: "${item.nftTitle}" edition ${item.edition} sold`
                        : item.transactionType === 'buy'
                        ? `Buy: "${item.nftTitle}" edition ${item.edition} bought`
                        : item.transactionType === 'royalty'
                        ? `Royalty (${item.royalty}%): "${
                            item.nftTitle
                          }" edition ${
                            item.edition
                          } resold for ${new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(item.transactionBalance)}`
                        : item.transactionType === 'won'
                        ? `Auction: "Item ${item.nftTitle}" edition ${item.edition} won`
                        : item.transactionType === 'bid'
                        ? `Bid: Bid placed for "${item.nftTitle}"`
                        : item.transactionType === 'refund'
                        ? `Refund: Outbid for "${item.nftTitle}"`
                        : item.transactionType === 'deposit'
                        ? `Deposit from Paypal`
                        : 'Withdrawal from Paypal'}
                    </td>

                    <td>
                      {(item.transactionType === 'buy' ||
                        item.transactionType === 'withdrawal' ||
                        item.transactionType === 'bid') &&
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(item.transactionBalance)}
                    </td>
                    <td>
                      {(item.transactionType === 'deposit' ||
                        item.transactionType === 'royalty' ||
                        item.transactionType === 'resale' ||
                        item.transactionType === 'sale' ||
                        item.transactionType === 'refund') &&
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(item.transactionBalance)}
                    </td>
                    <td>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(item.usdBalance)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
