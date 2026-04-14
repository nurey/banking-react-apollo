import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

export const FLINKS_CONNECTIONS_QUERY = gql`
  query FlinksConnections {
    flinksConnections {
      id
      institution
      status
      lastSyncedAt
      createdAt
    }
  }
`;

export const TRIGGER_IMPORT_MUTATION = gql`
  mutation TriggerFlinksImport($daysBack: Int) {
    triggerFlinksImport(daysBack: $daysBack) {
      success
      errors
    }
  }
`;

const ImportStatus = () => {
  const { data, loading, refetch } = useQuery(FLINKS_CONNECTIONS_QUERY);
  const [triggerImport, { loading: syncing }] = useMutation(TRIGGER_IMPORT_MUTATION);
  const [syncResult, setSyncResult] = useState(null);

  const connections = data?.flinksConnections || [];

  const handleSync = async () => {
    setSyncResult(null);
    try {
      const { data } = await triggerImport({ variables: { daysBack: 7 } });
      if (data.triggerFlinksImport.success) {
        setSyncResult({ type: 'success', message: 'Import complete' });
        refetch();
      } else {
        setSyncResult({ type: 'error', message: data.triggerFlinksImport.errors.join(', ') });
      }
    } catch (e) {
      setSyncResult({ type: 'error', message: e.message });
    }
  };

  if (loading) return null;

  if (connections.length === 0) {
    return (
      <div className="bg-ledger-surface border border-ledger-border rounded-lg p-4 mb-4">
        <p className="text-ledger-text-2 text-sm">No connected accounts</p>
      </div>
    );
  }

  return (
    <div className="bg-ledger-surface border border-ledger-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          {connections.map(conn => (
            <div key={conn.id} className="flex items-center gap-3 mb-1 last:mb-0">
              <span className="text-ledger-text-1 text-sm font-medium">{conn.institution}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${conn.status === 'active' ? 'bg-ledger-green/10 text-ledger-green' : 'bg-ledger-amber/10 text-ledger-amber'}`}>
                {conn.status}
              </span>
              {conn.lastSyncedAt && (
                <span className="text-ledger-text-2 text-xs">
                  Last sync: {new Date(conn.lastSyncedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="text-sm px-3 py-1.5 rounded bg-ledger-elevated border border-ledger-border text-ledger-text-1 hover:border-ledger-amber disabled:opacity-50"
        >
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
      {syncResult && (
        <p className={`text-xs mt-2 ${syncResult.type === 'success' ? 'text-ledger-green' : 'text-red-400'}`}>
          {syncResult.message}
        </p>
      )}
    </div>
  );
};

export default ImportStatus;
