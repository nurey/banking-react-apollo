import React from 'react'
import Transaction from './Transaction'
import { useQuery, gql } from '@apollo/client';

const TRANSACTION_QUERY = gql`
  query CreditCardTransactionQuery($showAnnotated: Boolean, $showCredits: Boolean) {
    creditCardTransactions(sort: [txDateDesc], showAnnotated: $showAnnotated, showCredits: $showCredits) {
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
    variables: { showAnnotated: props.config.showAnnotated, showCredits: props.config.showCredits }
  });

  return (
    <div className={ props.config.showAnnotated ? 'show-annotated' : null }>
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
