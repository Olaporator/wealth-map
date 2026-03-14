// POST /api/plaid/exchange-token
// Exchanges a Plaid public_token for an access_token, saves to Supabase,
// and fetches initial account data
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

// Map Plaid account types to our simplified owner/icon/color system
const ACCOUNT_METADATA = {
  // Known institution mappings based on institution_id
  'ins_3': { institution: 'Chase' },
  'ins_110266': { institution: 'Novo' },
  'ins_116530': { institution: 'TIAA' },
  'ins_117376': { institution: 'Robinhood' },
  'ins_6896': { institution: 'KeyBank' },
  'ins_128026': { institution: 'Capital One' },
};

const TYPE_ICONS = {
  depository: '🏦',
  investment: '📈',
  credit: '💳',
  loan: '🏠',
};

const TYPE_COLORS = {
  depository: '#3B82F6',
  investment: '#F59E0B',
  credit: '#F97316',
  loan: '#EF4444',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { public_token, metadata } = req.body;

    if (!public_token) {
      return res.status(400).json({ error: 'public_token is required' });
    }

    // Exchange public token for access token
    const exchangeResponse = await plaid.itemPublicTokenExchange({
      public_token,
    });

    const { access_token, item_id } = exchangeResponse.data;
    const institution_id = metadata?.institution?.institution_id || null;
    const institution_name = metadata?.institution?.name || null;

    // Save Plaid item to Supabase
    const { data: plaidItem, error: itemError } = await supabase
      .from('plaid_items')
      .upsert({
        item_id,
        access_token,
        institution_id,
        institution_name,
        status: 'active',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'item_id' })
      .select()
      .single();

    if (itemError) {
      console.error('Error saving plaid item:', itemError);
      return res.status(500).json({ error: 'Failed to save institution link' });
    }

    // Fetch accounts from Plaid
    const accountsResponse = await plaid.accountsGet({ access_token });
    const plaidAccounts = accountsResponse.data.accounts;

    // Save accounts to Supabase
    const accountRows = plaidAccounts.map(account => ({
      plaid_item_id: plaidItem.id,
      account_id: account.account_id,
      name: account.name,
      official_name: account.official_name,
      type: account.type,
      subtype: account.subtype,
      mask: account.mask,
      current_balance: account.balances.current,
      available_balance: account.balances.available,
      credit_limit: account.balances.limit,
      iso_currency: account.balances.iso_currency_code || 'USD',
      institution: institution_name || ACCOUNT_METADATA[institution_id]?.institution || 'Unknown',
      icon: TYPE_ICONS[account.type] || '🏦',
      color: TYPE_COLORS[account.type] || '#6B7280',
      updated_at: new Date().toISOString(),
    }));

    const { error: accountsError } = await supabase
      .from('accounts')
      .upsert(accountRows, { onConflict: 'account_id' });

    if (accountsError) {
      console.error('Error saving accounts:', accountsError);
    }

    res.status(200).json({
      success: true,
      item_id,
      institution: institution_name,
      accounts: plaidAccounts.length,
    });
  } catch (error) {
    console.error('Error exchanging token:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to exchange token',
      details: error.response?.data?.error_message || error.message,
    });
  }
}
