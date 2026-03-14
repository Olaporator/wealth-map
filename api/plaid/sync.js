// POST /api/plaid/sync
// Syncs transactions from all linked Plaid items using the Transactions Sync API
// This is the main "refresh" endpoint — call it periodically or on-demand
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

// Simplified category mapping from Plaid's detailed categories
const CATEGORY_MAP = {
  'FOOD_AND_DRINK': 'Food & Dining',
  'TRANSPORTATION': 'Transportation',
  'RENT_AND_UTILITIES': 'Utilities',
  'MEDICAL': 'Healthcare',
  'GENERAL_MERCHANDISE': 'Shopping',
  'ENTERTAINMENT': 'Entertainment',
  'PERSONAL_CARE': 'Shopping',
  'GENERAL_SERVICES': 'Business',
  'GOVERNMENT_AND_NON_PROFIT': 'Business',
  'HOME_IMPROVEMENT': 'Housing',
  'LOAN_PAYMENTS': 'Housing',
  'TRANSFER_IN': 'Transfer',
  'TRANSFER_OUT': 'Transfer',
  'INCOME': 'Income',
  'BANK_FEES': 'Utilities',
  'TRAVEL': 'Transportation',
};

function mapCategory(personalFinanceCategory) {
  if (!personalFinanceCategory) return 'Uncategorized';
  const primary = personalFinanceCategory.primary || '';
  return CATEGORY_MAP[primary] || 'Uncategorized';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all active Plaid items
    const { data: plaidItems, error: itemsError } = await supabase
      .from('plaid_items')
      .select('*')
      .eq('status', 'active');

    if (itemsError || !plaidItems) {
      return res.status(500).json({ error: 'Failed to fetch plaid items' });
    }

    if (plaidItems.length === 0) {
      return res.status(200).json({ message: 'No linked accounts to sync', synced: 0 });
    }

    let totalAdded = 0;
    let totalModified = 0;
    let totalRemoved = 0;
    const errors = [];

    for (const item of plaidItems) {
      try {
        let hasMore = true;
        let cursor = item.cursor || undefined;

        while (hasMore) {
          const syncResponse = await plaid.transactionsSync({
            access_token: item.access_token,
            cursor: cursor || undefined,
            count: 500,
          });

          const { added, modified, removed, has_more, next_cursor } = syncResponse.data;

          // Process added transactions
          if (added.length > 0) {
            const rows = added.map(txn => ({
              account_id: txn.account_id,
              transaction_id: txn.transaction_id,
              amount: txn.amount,
              date: txn.date,
              name: txn.name || txn.merchant_name || 'Unknown',
              merchant_name: txn.merchant_name,
              category: txn.category,
              primary_category: mapCategory(txn.personal_finance_category),
              pending: txn.pending,
              payment_channel: txn.payment_channel,
              iso_currency: txn.iso_currency_code || 'USD',
            }));

            const { error } = await supabase
              .from('transactions')
              .upsert(rows, { onConflict: 'transaction_id' });

            if (error) console.error('Error upserting added transactions:', error);
            totalAdded += added.length;
          }

          // Process modified transactions
          if (modified.length > 0) {
            const rows = modified.map(txn => ({
              transaction_id: txn.transaction_id,
              amount: txn.amount,
              date: txn.date,
              name: txn.name || txn.merchant_name || 'Unknown',
              merchant_name: txn.merchant_name,
              category: txn.category,
              primary_category: mapCategory(txn.personal_finance_category),
              pending: txn.pending,
            }));

            for (const row of rows) {
              await supabase
                .from('transactions')
                .update(row)
                .eq('transaction_id', row.transaction_id);
            }
            totalModified += modified.length;
          }

          // Process removed transactions
          if (removed.length > 0) {
            const ids = removed.map(r => r.transaction_id);
            await supabase
              .from('transactions')
              .delete()
              .in('transaction_id', ids);
            totalRemoved += removed.length;
          }

          cursor = next_cursor;
          hasMore = has_more;
        }

        // Save cursor for next sync
        await supabase
          .from('plaid_items')
          .update({ cursor, updated_at: new Date().toISOString() })
          .eq('id', item.id);

      } catch (err) {
        const errMsg = err.response?.data?.error_message || err.message;
        console.error(`Error syncing item ${item.item_id}:`, errMsg);
        errors.push({ item_id: item.item_id, institution: item.institution_name, error: errMsg });

        // Handle auth errors
        if (err.response?.data?.error_code === 'ITEM_LOGIN_REQUIRED') {
          await supabase
            .from('plaid_items')
            .update({ status: 'error', error_code: 'ITEM_LOGIN_REQUIRED' })
            .eq('id', item.id);
        }
      }
    }

    res.status(200).json({
      success: true,
      added: totalAdded,
      modified: totalModified,
      removed: totalRemoved,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync transactions' });
  }
}
