// POST /api/plaid/reauth
// Gets a link token in "update mode" for re-authenticating an existing item
// This allows the user to fix login issues without re-linking from scratch
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
    const { item_id } = req.body || {};

    if (!item_id) {
      return res.status(400).json({ error: 'item_id is required' });
    }

    // Get the access token for this item
    const { data: item, error: dbError } = await supabase
      .from('plaid_items')
      .select('access_token, institution_name')
      .eq('item_id', item_id)
      .single();

    if (dbError || !item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Create link token in update mode using existing access_token
    const response = await plaid.linkTokenCreate({
      user: { client_user_id: 'ayoola-wealth-map' },
      client_name: 'Wealth Map',
      country_codes: ['US'],
      language: 'en',
      access_token: item.access_token,
    });

    res.status(200).json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
      institution_name: item.institution_name,
    });
  } catch (error) {
    console.error('Error creating reauth link token:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create reauth link token',
      details: error.response?.data?.error_message || error.message,
    });
  }
}
