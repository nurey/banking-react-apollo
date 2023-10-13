import React from 'react'
import UpdateTransaction from './UpdateTransaction'

const Transaction = (props) => {
  const { transaction } = props;
  var noteClasses = ['note'];
  if ( transaction.debit && ( !transaction.note || transaction.note?.detail === '' ) ) {
    noteClasses.push('empty');
  }

  return (
    <div id={transaction.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.txDate}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Credit</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.credit}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Debit</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.debit}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Details</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.details}</dd>
          </div>
          <div className={`bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${noteClasses.join(' ')}`}>
            <dt className="text-sm font-medium text-gray-500">Note</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{transaction.note?.detail}</dd>
          </div>
        </dl>
        <UpdateTransaction id={transaction.id} noteId={transaction.note?.id} />
      </div>
    </div>
  );
}

export default Transaction
