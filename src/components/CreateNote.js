import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_NOTE_MUTATION = gql`
  mutation NoteMutation(
    $detail: String!
    $creditCardTransactionId: ID!
  ) {
    createNote(
      detail: $detail
      creditCardTransactionId: $creditCardTransactionId
    ) {
      note {
        detail
        creditCardTransactionId
      }
    }
  }
`;


const CreateNote = (props) => {
  const [formState, setFormState] = useState({
    detail: ''
  });

  const [createNote] = useMutation(CREATE_NOTE_MUTATION, {
    variables: {
      detail: formState.detail,
      creditCardTransactionId: props.transactionId
    }
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createNote();
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.detail}
            onChange={(e) =>
              setFormState({
                ...formState,
                detail: e.target.value
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

export default CreateNote;
