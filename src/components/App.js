import React, { useState } from 'react';
import TransactionList from './TransactionList';
import TransactionListConfig from './TransactionListConfig';
import SummaryHeader from './SummaryHeader';
import AppNavbar from './AppNavbar';

const TAB_CONFIG = [
  { showAnnotated: false, showCredits: false },  // Needs Attention
  { showAnnotated: true, showCredits: false },    // All Debits
  { showAnnotated: true, showCredits: true },     // Everything
];

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const config = TAB_CONFIG[activeTab];

  return (
    <div className="min-h-screen bg-ledger-base">
      <AppNavbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SummaryHeader />
        <TransactionListConfig
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <TransactionList config={config} searchQuery={searchQuery} />
      </main>
    </div>
  );
};

export default App;
