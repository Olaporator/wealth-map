// GET /api/plaid/accounts
// Returns all accounts with fresh balances from Plaid
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { createClient } from '@supabase/supabase-js';

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaid = new PlaidApi(config);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const refresh = req.query.refresh === 'true';

    // Get all active Plaid items
    const { data: plaidItems, error: itemsError } = await supabase
      .from('plaid_items')
      .select('*')
      .eq('status', 'active');

    if (itemsError) {
      return res.status(500).json({ error: 'Failed to fetch plaid items' });
    }

    // If refresh requested, pull fresh balances from Plaid
    if (refresh && plaidItems.length > 0) {
      for (const item of plaidItems) {
        try {
          const balancesResponse = await plaid.accountsBalanceGet({
            access_token: item.access_token,
          });

          const updates = balancesResponse.data.accounts.map(account => ({
            account_id: account.account_id,
            current_balance: account.balances.current,
            available_balance: account.balances.available,
            credit_limit: account.balances.limit,
            updated_at: new Date().toISOString(),
          }));

          for (const update of updates) {
            await supabase
              .from('accounts')
              .update(update)
              .eq('account_id', update.account_id);
          }
        } catch (err) {
          console.error(`Error refreshing balances for item ${item.item_id}:`, err.response?.data || err.message);
          // Mark item as errored if auth is stale
          if (err.response?.data?.error_code === 'ITEM_LOGIN_REQUIRED') {
            await supabase
              .from('plaid_items')
              .update({ status: 'error', error_code: 'ITEM_LOGIN_REQUIRED' })
              .eq('id', item.id);
          }
        }
      }
    }

    // Fetch all accounts from Supabase
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*, plaid_items(institution_name, status, error_code)')
      .eq('hidden', false)
      .order('type')
      .order('current_balance', { ascending: false });

    if (accountsError) {
      return res.status(500).json({ error: 'Failed to fetch accounts' });
    }

    // Compute totals
    const totals = {
      assets: 0,
      liabilities: 0,
      netWorth: 0,
    };

    accounts.forEach(account => {
      const bal = account.current_balance || 0;
      if (account.type === 'loan' || account.type === 'credit') {
        totals.liabilities += Math.abs(bal);
      } else {
        totals.assets += bal;
      }
    });
    totals.netWorth = totals.assets - totals.liabilities;

    res.status(200).json({ accounts, totals });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
}
