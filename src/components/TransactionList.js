import React from 'react'
import Transaction from './Transaction'
import { useQuery, gql } from '@apollo/client';

const TRANSACTION_QUERY = gql`
  query CreditCardTransactionQuery($showAnnotated: Boolean) {
    creditCardTransactions(sort: [txDateDesc], showAnnotated: $showAnnotated) {
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

const TransactionList = (props) => {
  const { data } = useQuery(TRANSACTION_QUERY, {
    variables: { showAnnotated: props.config.showAnnotated }
  });

  return (
    <div class={ props.config.showAnnotated ? 'show-annotated' : null }>
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
