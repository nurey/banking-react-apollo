import React from 'react'
import UpdateTransaction from './UpdateTransaction'

const Transaction = (props) => {
  const { transaction } = props;
  return (
    <div>
      <div>date: {transaction.txDate}</div>
      <div>credit: {transaction.credit}</div>
      <div>debit: {transaction.debit}</div>
      <div>details: {transaction.details}</div>
      <div>note: {transaction.note?.detail}</div>
      <UpdateTransaction id={transaction.id} />
    </div>
  );
}

export default Transaction
