import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

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


const UpdateTransaction = (props) => {
  const [formState, setFormState] = useState({
    note: ''
  });

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION_MUTATION, {
    variables: {
      noteDetail: formState.note,
      noteId: props.noteId,
      id: props.id
    }
  });

  return (
    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <form
        className="sm:mt-0 sm:col-span-2"
        onSubmit={(e) => {
          e.preventDefault();
          updateTransaction();
        }}
      >
        <div className="relative rounded-md shadow-sm">
          <input
            className="focus:ring-indigo-700 focus:border-indigo-700 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            value={formState.note}
            onChange={(e) =>
              setFormState({
                ...formState,
                note: e.target.value
              })
            }
            type="text"
            placeholder="A description for the transaction"
          />
        </div>
        <button type="submit" className="h-8 px-4 mt-1 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateTransaction;
