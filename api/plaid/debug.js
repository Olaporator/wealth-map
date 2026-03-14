// GET /api/plaid/debug
// Lightweight diagnostic — just queries Supabase, no Plaid calls
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const action = req.query.action || 'accounts';

  try {
    // Check env vars
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(500).json({
        error: 'Missing env vars',
        has_supabase_url: !!process.env.SUPABASE_URL,
        has_supabase_key: !!process.env.SUPABASE_SERVICE_KEY,
        has_plaid_client: !!process.env.PLAID_CLIENT_ID,
        has_plaid_secret: !!process.env.PLAID_SECRET,
        plaid_env: process.env.PLAID_ENV || 'not set',
      });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    if (action === 'accounts') {
      const { data, error } = await supabase
        .from('accounts')
        .select('account_id, name, institution, type, subtype, current_balance, available_balance, credit_limit, owner, mask, plaid_item_id, created_at')
        .order('institution')
        .order('current_balance', { ascending: false });

      if (error) return res.status(500).json({ error: error.message, hint: error.hint });
      return res.status(200).json({ count: data.length, accounts: data });
    }

    if (action === 'interest') {
      // Find interest/finance charges on credit cards
      const { data, error } = await supabase
        .from('transactions')
        .select('transaction_id, account_id, name, amount, date, primary_category')
        .or('name.ilike.%interest%,name.ilike.%finance charge%,name.ilike.%fee%')
        .order('date', { ascending: false })
        .limit(50);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ count: data.length, transactions: data });
    }

    if (action === 'transactions') {
      const { data, error } = await supabase
        .from('transactions')
        .select('transaction_id, account_id, name, amount, date, primary_category')
        .order('date', { ascending: false })
        .limit(30);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ count: data.length, transactions: data });
    }

    if (action === 'delete_account') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'id param required' });

      const { data, error } = await supabase
        .from('accounts')
        .delete()
        .eq('account_id', id)
        .select();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ deleted: data });
    }

    if (action === 'env') {
      return res.status(200).json({
        has_supabase_url: !!process.env.SUPABASE_URL,
        has_supabase_key: !!process.env.SUPABASE_SERVICE_KEY,
        has_plaid_client: !!process.env.PLAID_CLIENT_ID,
        has_plaid_secret: !!process.env.PLAID_SECRET,
        plaid_env: process.env.PLAID_ENV || 'not set',
      });
    }

    res.status(400).json({ error: 'Unknown action', valid: ['accounts', 'interest', 'transactions', 'delete_account', 'env'] });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack?.split('\n').slice(0, 3) });
  }
}
