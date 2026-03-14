// GET/POST/PUT /api/plaid/manual-accounts
// Manage manually-tracked accounts (not linked via Plaid)
// Used for: Human Interest 401k, TIAA 403b/457, student loans, etc.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  // GET: List all manual accounts
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .is('plaid_item_id', null)
        .eq('hidden', false)
        .order('type')
        .order('current_balance', { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      res.status(200).json({ accounts: data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }

  // POST: Create a new manual account
  } else if (req.method === 'POST') {
    try {
      const {
        name, official_name, type, subtype, mask,
        current_balance, available_balance, credit_limit,
        owner, nickname, institution, icon, color,
        // Growth projection fields (stored in metadata)
        annual_contribution, employer_match_pct, annual_appreciation,
      } = req.body;

      if (!name || !type) {
        return res.status(400).json({ error: 'name and type are required' });
      }

      // Generate a stable manual account ID
      const account_id = `manual_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;

      const { data, error } = await supabase
        .from('accounts')
        .insert({
          account_id,
          plaid_item_id: null, // marks it as manual
          name,
          official_name,
          type,
          subtype,
          mask,
          current_balance: current_balance || 0,
          available_balance,
          credit_limit,
          owner,
          nickname,
          institution,
          icon: icon || '📊',
          color: color || '#6B7280',
        })
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      res.status(201).json({ account: data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }

  // PUT: Update a manual account (balance, name, etc.)
  } else if (req.method === 'PUT') {
    try {
      const { account_id, ...updates } = req.body;

      if (!account_id) {
        return res.status(400).json({ error: 'account_id is required' });
      }

      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('account_id', account_id)
        .is('plaid_item_id', null) // safety: only update manual accounts
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      res.status(200).json({ account: data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
