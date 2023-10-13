import React from 'react';
import { ToggleSwitch } from 'flowbite-react';

const TransactionListConfig = (props) => {
  return (
    <section className="pt-2 pb-4">
      { props.config.showAnnotated ? (

        <span className="cursor-pointer underline px-4" onClick={() => props.onConfigChange({ showAnnotated: false })}>
          Hide Annotated
        </span>
      ) : (
        <span className="cursor-pointer underline px-4" onClick={() => props.onConfigChange({ showAnnotated: true })}>
          Show Annotated
        </span>
      )}

      { props.config.showCredits ? (
        <span className="cursor-pointer underline px-4" onClick={() => props.onConfigChange({ showCredits: false })}>
          Hide Credits
        </span>
      ) : (
        <span className="cursor-pointer underline px-4" onClick={() => props.onConfigChange({ showCredits: true })}>
          Show Credits
        </span>
      )}

      {/* <label className="inline-flex relative items-center mb-4 cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" checked={props.config.showAnnotated} onChange={() => props.onConfigChange({ showAnnotated: true })}/>
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show Annotated</span>
      </label> */}

      <ToggleSwitch
        checked={props.config.showAnnotated}
        label="Show Annotated"
        onChange={() => props.onConfigChange({ showAnnotated: true })}
      />
    </section>
  );
}

export default TransactionListConfig
