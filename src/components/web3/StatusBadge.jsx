import React from 'react';

export default function StatusBadge({ status = 'disconnected', label }) {
  const map = {
    connected: 'bg-success',
    disconnected: 'bg-secondary',
    warning: 'bg-warning text-dark',
    error: 'bg-danger',
    info: 'bg-info text-dark',
  };
  const cls = map[status] || 'bg-secondary';
  return (
    <span className={`badge ${cls}`} aria-live="polite">{label || status}</span>
  );
} 