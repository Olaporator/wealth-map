// GET /api/plaid/items — List all linked Plaid items with status
// PATCH /api/plaid/items — Mark an item as active after successful re-auth
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('plaid_items')
        .select('id, item_id, institution_name, status, error_code, access_token, updated_at')
        .order('updated_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch items' });
      }

      // Return items but mask access_token (only send first/last 4 chars for identification)
      const items = (data || []).map(item => ({
        id: item.id,
        item_id: item.item_id,
        institution_name: item.institution_name,
        status: item.status,
        error_code: item.error_code,
        needs_reauth: item.status === 'error' && item.error_code === 'ITEM_LOGIN_REQUIRED',
        has_access_token: !!item.access_token,
        updated_at: item.updated_at,
      }));

      return res.status(200).json({ items });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'PATCH') {
    // After successful re-auth via update mode, mark item active again
    try {
      const { item_id } = req.body || {};
      if (!item_id) {
        return res.status(400).json({ error: 'item_id required' });
      }

      const { error } = await supabase
        .from('plaid_items')
        .update({ status: 'active', error_code: null, updated_at: new Date().toISOString() })
        .eq('item_id', item_id);

      if (error) {
        return res.status(500).json({ error: 'Failed to update item' });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
