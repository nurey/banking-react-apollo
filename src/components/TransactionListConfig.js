import React from 'react';

const TransactionListConfig = (props) => {
  return (
    <section>
      { props.config.showAnnotated ? (
        <div id="toggle-annotate" onClick={() => props.onConfigChange({ showAnnotated: false })}>
          Hide Annotated
        </div>
      ) : (
        <div id="toggle-annotate" onClick={() => props.onConfigChange({ showAnnotated: true })}>
          Show Annotated
        </div>
      )}
    </section>
  );
}

export default TransactionListConfig
