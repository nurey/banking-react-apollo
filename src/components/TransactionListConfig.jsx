import React from 'react';
import { Tabs, TabItem, TextInput } from 'flowbite-react';

const TransactionListConfig = ({ activeTab, onTabChange, searchQuery, onSearchChange }) => {
  return (
    <div className="space-y-4">
      <Tabs
        variant="pills"
        onActiveTabChange={onTabChange}
      >
        <TabItem active={activeTab === 0} title="Needs Attention">
          <></>
        </TabItem>
        <TabItem active={activeTab === 1} title="All Debits">
          <></>
        </TabItem>
        <TabItem active={activeTab === 2} title="Everything">
          <></>
        </TabItem>
      </Tabs>

      <TextInput
        sizing="sm"
        placeholder="Search transactions..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default TransactionListConfig;
