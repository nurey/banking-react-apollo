import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import TransactionList from './TransactionList';
import TransactionListConfig from './TransactionListConfig';
import SummaryHeader from './SummaryHeader';
import AppNavbar from './AppNavbar';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ImportStatus from './ImportStatus';

const TAB_CONFIG = [
  { showAnnotated: false, showCredits: false },  // Needs Attention
  { showAnnotated: true, showCredits: false },    // All Debits
  { showAnnotated: true, showCredits: true },     // Everything
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const config = TAB_CONFIG[activeTab];

  return (
    <div className="min-h-screen bg-ledger-base">
      <AppNavbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ImportStatus />
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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
