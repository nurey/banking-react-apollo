import React, { useState } from 'react';
import Transaction from './Transaction';
import UpdateTransaction from './UpdateTransaction';
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Spinner } from 'flowbite-react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

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

const ALL_TRANSACTIONS_QUERY = gql`
  query SummaryQuery {
    creditCardTransactions(sort: [txDateDesc], showAnnotated: true, showCredits: true) {
      id
      credit
      debit
      note {
        id
        detail
      }
    }
  }
`;

const TransactionList = ({ config, searchQuery }) => {
  const [expandedId, setExpandedId] = useState(null);
  const { data, loading, error } = useQuery(TRANSACTION_QUERY, {
    variables: { showAnnotated: config.showAnnotated, showCredits: config.showCredits }
  });
  const { data: allData } = useQuery(ALL_TRANSACTIONS_QUERY);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-ledger-text-secondary">
        Failed to load transactions.
      </div>
    );
  }

  const categories = [...new Set(
    (allData?.creditCardTransactions || []).map(tx => tx.note?.detail).filter(Boolean)
  )].sort();

  let transactions = data?.creditCardTransactions || [];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    transactions = transactions.filter(tx =>
      tx.details.toLowerCase().includes(q) ||
      tx.note?.detail?.toLowerCase().includes(q)
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-20 text-ledger-text-secondary">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-4 rounded-lg border border-ledger-border">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell className="!bg-ledger-surface !text-ledger-text-secondary text-xs uppercase tracking-wider">Date</TableHeadCell>
            <TableHeadCell className="!bg-ledger-surface !text-ledger-text-secondary text-xs uppercase tracking-wider">Details</TableHeadCell>
            <TableHeadCell className="!bg-ledger-surface !text-ledger-text-secondary text-xs uppercase tracking-wider">Category</TableHeadCell>
            <TableHeadCell className="!bg-ledger-surface !text-ledger-text-secondary text-xs uppercase tracking-wider text-right">Amount</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y divide-ledger-border">
          {transactions.map((tx, index) => (
            <React.Fragment key={tx.id}>
              <Transaction
                transaction={tx}
                index={index}
                isExpanded={expandedId === tx.id}
                onToggle={() => toggleExpand(tx.id)}
              />
              {expandedId === tx.id && (
                <TableRow className="edit-row animate-expand-down">
                  <TableCell colSpan={4} className="!bg-ledger-elevated">
                    <UpdateTransaction id={tx.id} noteId={tx.note?.id} categories={categories} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
