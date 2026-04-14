import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ledger-base flex items-center justify-center">
      <div className="bg-ledger-surface border border-ledger-border rounded-lg p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-ledger-text-1 mb-6 text-center">
          <span className="text-ledger-amber mr-2">&#9670;</span>
          Budgetr
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded p-3">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm text-ledger-text-2 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-ledger-elevated border border-ledger-border rounded px-3 py-2 text-ledger-text-1 focus:outline-none focus:border-ledger-amber"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-ledger-text-2 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-ledger-elevated border border-ledger-border rounded px-3 py-2 text-ledger-text-1 focus:outline-none focus:border-ledger-amber"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ledger-amber text-ledger-base font-medium rounded px-3 py-2 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-ledger-text-2 text-sm text-center mt-4">
          No account? <Link to="/register" className="text-ledger-amber hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
