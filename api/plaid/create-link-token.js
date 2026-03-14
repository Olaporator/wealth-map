// POST /api/plaid/create-link-token
// Creates a Plaid Link token for the frontend to open the Plaid Link modal
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { products, institution_id } = req.body || {};

    const request = {
      user: { client_user_id: 'ayoola-wealth-map' },
      client_name: 'Wealth Map',
      products: products || [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    };

    // If reconnecting a specific institution
    if (institution_id) {
      request.institution_id = institution_id;
    }

    // Add investment products for retirement/brokerage accounts
    if (products && products.includes('investments')) {
      request.products = [Products.Investments];
    }

    const response = await plaid.linkTokenCreate(request);

    res.status(200).json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
    });
  } catch (error) {
    console.error('Error creating link token:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create link token',
      details: error.response?.data?.error_message || error.message,
    });
  }
}
