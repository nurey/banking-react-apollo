import React from 'react';
import { Badge } from 'flowbite-react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { formatCents } from '../utils/currency';

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

const StatCard = ({ label, children }) => (
  <div className="rounded-lg border border-ledger-border bg-ledger-surface px-4 py-3">
    <p className="text-xs uppercase tracking-wider text-ledger-text-secondary mb-1">{label}</p>
    {children}
  </div>
);

// Stands in for a value while the query loads. h-7 is text-xl's line height, so the
// cards are already full size when the numbers arrive and the list below doesn't shift.
const ValuePlaceholder = () => (
  <div className="h-7 w-20 max-w-full rounded bg-ledger-elevated animate-pulse" />
);

const SummaryHeader = () => {
  const { data, loading } = useQuery(ALL_TRANSACTIONS_QUERY);

  if (!data) {
    if (!loading) return null;

    return (
      <div className="grid grid-cols-3 gap-4 mb-6" role="status">
        <StatCard label="Total Spent"><ValuePlaceholder /></StatCard>
        <StatCard label="Credits"><ValuePlaceholder /></StatCard>
        <StatCard label="Uncategorized"><ValuePlaceholder /></StatCard>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  const transactions = data.creditCardTransactions;

  const totalDebits = transactions.reduce((sum, tx) => sum + (tx.debit || 0), 0);
  const totalCredits = transactions.reduce((sum, tx) => sum + (tx.credit || 0), 0);
  const uncategorizedCount = transactions.filter(
    tx => tx.debit && (!tx.note || !tx.note.detail)
  ).length;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <StatCard label="Total Spent">
        <p className="text-xl font-mono font-semibold">${formatCents(totalDebits)}</p>
      </StatCard>

      <StatCard label="Credits">
        <p className="text-xl font-mono font-semibold text-ledger-green">+${formatCents(totalCredits)}</p>
      </StatCard>

      <StatCard label="Uncategorized">
        <div className="flex items-center gap-2">
          <p className="text-xl font-mono font-semibold">{uncategorizedCount}</p>
          {uncategorizedCount > 0 && (
            <Badge color="warning" size="xs">needs attention</Badge>
          )}
        </div>
      </StatCard>
    </div>
  );
};

export default SummaryHeader;
