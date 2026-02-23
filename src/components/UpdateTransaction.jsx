import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Button } from 'flowbite-react';

const UPDATE_TRANSACTION_MUTATION = gql`
  mutation TransactionMutation(
    $noteId: ID
    $noteDetail: String!
    $id: ID!
  ) {
    updateCreditCardTransaction (
      noteId: $noteId
      noteDetail: $noteDetail
      id: $id
    ) {
      creditCardTransaction {
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
  }
`;

const SuggestionsList = ({ inputRef, filtered, highlightedIndex, onSelect, onMouseEnter }) => {
  const [pos, setPos] = useState(null);

  const updatePos = useCallback(() => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, [inputRef]);

  useEffect(() => {
    updatePos();
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [updatePos]);

  if (!pos) return null;

  return ReactDOM.createPortal(
    <ul
      className="fixed z-[9999] rounded-lg border border-ledger-border bg-ledger-surface shadow-lg max-h-48 overflow-y-auto"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      {filtered.map((cat, i) => (
        <li
          key={cat}
          className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
            i === highlightedIndex
              ? 'bg-ledger-elevated text-ledger-amber'
              : 'text-ledger-text-primary hover:bg-ledger-elevated'
          }`}
          onMouseDown={() => onSelect(cat)}
          onMouseEnter={() => onMouseEnter(i)}
        >
          {cat}
        </li>
      ))}
    </ul>,
    document.body
  );
};

const UpdateTransaction = ({ id, noteId, categories = [] }) => {
  const [formState, setFormState] = useState({ note: '' });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION_MUTATION, {
    variables: {
      noteDetail: formState.note,
      noteId: noteId,
      id: id
    }
  });

  const filtered = formState.note
    ? categories.filter(c => c.toLowerCase().includes(formState.note.toLowerCase()))
    : categories;

  const handleSelect = (cat) => {
    setFormState({ note: cat });
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <form
      className="flex items-center gap-3 py-2"
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        updateTransaction();
      }}
    >
      <div className="flex-1">
        <input
          ref={inputRef}
          type="text"
          className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-sm text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
          value={formState.note}
          onChange={(e) => {
            setFormState({ note: e.target.value });
            setShowSuggestions(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Add a note for this transaction..."
        />
        {showSuggestions && filtered.length > 0 && (
          <SuggestionsList
            inputRef={inputRef}
            filtered={filtered}
            highlightedIndex={highlightedIndex}
            onSelect={handleSelect}
            onMouseEnter={setHighlightedIndex}
          />
        )}
      </div>
      <Button size="xs" type="submit" color="gray">
        Save
      </Button>
    </form>
  );
};

export default UpdateTransaction;
