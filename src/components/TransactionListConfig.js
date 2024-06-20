import React from 'react';
import { ToggleSwitch } from 'flowbite-react';

const TransactionListConfig = (props) => {
  return (
    <section className="p-4 flex space-x-4">
      <div>
        Transactions without a note are highlighted
      </div>

      <ToggleSwitch
        checked={props.config.showAnnotated}
        label="Show Annotated"
        onChange={(checked) => props.onConfigChange({ showAnnotated: checked })}
      />

      <ToggleSwitch
        checked={props.config.showCredits}
        label="Show Credits"
        onChange={(checked) => props.onConfigChange({ showCredits: checked })}
      />
    </section>
  );
}

export default TransactionListConfig
