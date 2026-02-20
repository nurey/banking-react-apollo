import React from 'react';
import { Badge } from 'flowbite-react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

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

const SummaryHeader = () => {
  const { data } = useQuery(ALL_TRANSACTIONS_QUERY);

  if (!data) return null;

  const transactions = data.creditCardTransactions;

  const totalDebits = transactions.reduce((sum, tx) => sum + (parseFloat(tx.debit) || 0), 0);
  const totalCredits = transactions.reduce((sum, tx) => sum + (parseFloat(tx.credit) || 0), 0);
  const uncategorizedCount = transactions.filter(
    tx => tx.debit && (!tx.note || !tx.note.detail)
  ).length;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="rounded-lg border border-ledger-border bg-ledger-surface px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-ledger-text-secondary mb-1">Total Spent</p>
        <p className="text-xl font-mono font-semibold">${totalDebits.toFixed(2)}</p>
      </div>

      <div className="rounded-lg border border-ledger-border bg-ledger-surface px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-ledger-text-secondary mb-1">Credits</p>
        <p className="text-xl font-mono font-semibold text-ledger-green">+${totalCredits.toFixed(2)}</p>
      </div>

      <div className="rounded-lg border border-ledger-border bg-ledger-surface px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-ledger-text-secondary mb-1">Uncategorized</p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-mono font-semibold">{uncategorizedCount}</p>
          {uncategorizedCount > 0 && (
            <Badge color="warning" size="xs">needs attention</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryHeader;
