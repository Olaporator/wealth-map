// ─── API Client for Plaid Backend ─────────────────────────────────────────
// All calls go to /api/plaid/* which Vercel routes to serverless functions

const API_BASE = '/api/plaid';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.details || `API error ${res.status}`);
  }

  return data;
}

export const api = {
  // Plaid Link
  createLinkToken: (products) =>
    request('/create-link-token', {
      method: 'POST',
      body: { products },
    }),

  exchangeToken: (public_token, metadata) =>
    request('/exchange-token', {
      method: 'POST',
      body: { public_token, metadata },
    }),

  // Accounts
  getAccounts: (refresh = false) =>
    request(`/accounts?refresh=${refresh}`),

  // Transactions
  getTransactions: ({ start, end, account, category, search, limit, offset } = {}) => {
    const params = new URLSearchParams();
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    if (account) params.set('account', account);
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (limit) params.set('limit', limit);
    if (offset) params.set('offset', offset);
    return request(`/transactions?${params.toString()}`);
  },

  // Sync
  syncTransactions: () =>
    request('/sync', { method: 'POST' }),

  // Budgets
  getBudgets: () =>
    request('/budgets'),

  updateBudget: (category, monthly_limit) =>
    request('/budgets', {
      method: 'POST',
      body: { category, monthly_limit },
    }),

  // Remove institution
  removeItem: (item_id) =>
    request('/remove-item', {
      method: 'POST',
      body: { item_id },
    }),
};
