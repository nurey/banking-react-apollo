import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import ImportStatus from './ImportStatus';
import { FLINKS_CONNECTIONS_QUERY, TRIGGER_IMPORT_MUTATION } from './ImportStatus';

function renderWithMocks(mocks) {
  const link = new MockLink(mocks, { addTypename: false });
  const client = new ApolloClient({ link, cache: new InMemoryCache() });
  return render(
    <ApolloProvider client={client}>
      <ImportStatus />
    </ApolloProvider>
  );
}

const mockConnections = [
  {
    id: '1',
    institution: 'CIBC',
    status: 'active',
    lastSyncedAt: '2026-04-14T06:00:00Z',
    createdAt: '2026-03-01T00:00:00Z',
  },
];

describe('ImportStatus', () => {
  it('renders connection and last sync time', async () => {
    renderWithMocks([
      {
        request: { query: FLINKS_CONNECTIONS_QUERY },
        result: { data: { flinksConnections: mockConnections } },
      },
    ]);

    await waitFor(() => {
      expect(screen.getByText(/CIBC/)).toBeInTheDocument();
      expect(screen.getByText(/Last sync/i)).toBeInTheDocument();
    });
  });

  it('renders "No connected accounts" when empty', async () => {
    renderWithMocks([
      {
        request: { query: FLINKS_CONNECTIONS_QUERY },
        result: { data: { flinksConnections: [] } },
      },
    ]);

    await waitFor(() => {
      expect(screen.getByText(/No connected accounts/i)).toBeInTheDocument();
    });
  });

  it('has a Sync Now button', async () => {
    renderWithMocks([
      {
        request: { query: FLINKS_CONNECTIONS_QUERY },
        result: { data: { flinksConnections: mockConnections } },
      },
    ]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sync now/i })).toBeInTheDocument();
    });
  });
});
