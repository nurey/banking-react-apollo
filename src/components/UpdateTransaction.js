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
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateTransaction();
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UpdateTransaction;
