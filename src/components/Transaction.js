import React from 'react'
import UpdateTransaction from './UpdateTransaction'

const Transaction = (props) => {
  const { transaction } = props;
  var noteClasses = ['note'];
  if ( transaction.debit && ( !transaction.note || transaction.note?.detail === '' ) ) {
    noteClasses.push('empty');
  }

  return (
    <div>
      <div>date: {transaction.txDate}</div>
      <div>credit: {transaction.credit}</div>
      <div>debit: {transaction.debit}</div>
      <div>details: {transaction.details}</div>
      <div class={ noteClasses.join(' ') }>note: {transaction.note?.detail}</div>
      <UpdateTransaction id={transaction.id} noteId={transaction.note?.id} />
    </div>
  );
}

export default Transaction
