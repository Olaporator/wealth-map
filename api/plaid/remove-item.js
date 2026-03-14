// POST /api/plaid/remove-item
// Unlinks a Plaid item and removes its accounts/transactions
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { item_id } = req.body;

    if (!item_id) {
      return res.status(400).json({ error: 'item_id is required' });
    }

    // Get the Plaid item
    const { data: item } = await supabase
      .from('plaid_items')
      .select('*')
      .eq('item_id', item_id)
      .single();

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Remove from Plaid
    try {
      await plaid.itemRemove({ access_token: item.access_token });
    } catch (err) {
      console.error('Plaid remove error (continuing anyway):', err.message);
    }

    // Cascade delete will handle accounts → transactions
    await supabase
      .from('plaid_items')
      .delete()
      .eq('item_id', item_id);

    res.status(200).json({ success: true, removed: item.institution_name });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
}
