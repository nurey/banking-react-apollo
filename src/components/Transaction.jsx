import React from 'react';
import { TableRow, TableCell, Badge } from 'flowbite-react';

const CATEGORY_COLORS = {
  'Groceries': 'green',
  'Fun Money': 'purple',
  'Monthly Expenses': 'blue',
  'Cat Expenses': 'pink',
  'Additional Medical': 'cyan',
};

const FALLBACK_COLORS = ['indigo', 'purple', 'pink', 'blue', 'cyan', 'teal', 'green', 'lime'];

function getCategoryColor(category) {
  if (!category) return 'warning';
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatAmount(credit, debit) {
  if (credit) return `+$${parseFloat(credit).toFixed(2)}`;
  if (debit) return `-$${parseFloat(debit).toFixed(2)}`;
  return '\u2014';
}

const Transaction = ({ transaction, index, isExpanded, onToggle }) => {
  const isCredit = !!transaction.credit;
  const isUncategorized = transaction.debit && (!transaction.note || !transaction.note.detail);
  const category = transaction.note?.detail;

  return (
    <TableRow
      className={`cursor-pointer animate-fade-slide-in transition-colors ${isUncategorized ? 'needs-attention' : ''} ${isExpanded ? '!bg-ledger-elevated' : ''}`}
      style={{ animationDelay: `${Math.min(index, 20) * 30}ms` }}
      onClick={onToggle}
    >
      <TableCell className="whitespace-nowrap !text-ledger-text-secondary text-sm !py-3">
        {formatDate(transaction.txDate)}
      </TableCell>
      <TableCell className="text-sm max-w-xs truncate !py-3">
        {transaction.details}
      </TableCell>
      <TableCell className="!py-3">
        {category ? (
          <Badge color={getCategoryColor(category)} size="xs">{category}</Badge>
        ) : isUncategorized ? (
          <Badge color="warning" size="xs">Uncategorized</Badge>
        ) : null}
      </TableCell>
      <TableCell className="text-right font-mono text-sm whitespace-nowrap !py-3">
        <span className={isCredit ? 'text-ledger-green font-medium' : ''}>
          {formatAmount(transaction.credit, transaction.debit)}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default Transaction;
