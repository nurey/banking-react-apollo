import React from 'react'
import Transaction from './Transaction'
import { useQuery, gql } from '@apollo/client';

const TRANSACTION_QUERY = gql`
  {
    creditCardTransactions(sort: [txDateDesc]) {
      id
      txDate
      credit
      debit
      details
      note {
        id
        detail
      }
    }
  }
`;

const TransactionList = () => {
  const { data } = useQuery(TRANSACTION_QUERY);

  return (
    <div>
      {data && (
        <>
          {data.creditCardTransactions.map((tx) => (
            <Transaction key={tx.id} transaction={tx} />
          ))}
        </>
      )}
    </div>
  )
}

export default TransactionList
