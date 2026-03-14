// GET /api/plaid/transactions?start=2026-03-01&end=2026-03-31&account=xxx&category=yyy&search=zzz
// Returns transactions from Supabase with filtering
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      start,
      end,
      account,
      category,
      search,
      limit = 100,
      offset = 0,
    } = req.query;

    let query = supabase
      .from('transactions')
      .select('*, accounts(name, institution, icon, color, type, owner)')
      .order('date', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (start) query = query.gte('date', start);
    if (end) query = query.lte('date', end);
    if (account) query = query.eq('account_id', account);
    if (category) query = query.eq('primary_category', category);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data: transactions, error, count } = await query;

    if (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    // Also compute spending by category for the date range
    let categoryQuery = supabase
      .from('transactions')
      .select('primary_category, amount');

    if (start) categoryQuery = categoryQuery.gte('date', start);
    if (end) categoryQuery = categoryQuery.lte('date', end);

    const { data: allTxns } = await categoryQuery;

    const spendingByCategory = {};
    const totalIncome = { amount: 0 };
    const totalExpenses = { amount: 0 };

    (allTxns || []).forEach(txn => {
      // Plaid: positive = money out (debit), negative = money in (credit)
      if (txn.amount > 0) {
        totalExpenses.amount += txn.amount;
        const cat = txn.primary_category || 'Uncategorized';
        if (!spendingByCategory[cat]) spendingByCategory[cat] = 0;
        spendingByCategory[cat] += txn.amount;
      } else {
        totalIncome.amount += Math.abs(txn.amount);
      }
    });

    res.status(200).json({
      transactions,
      summary: {
        totalIncome: totalIncome.amount,
        totalExpenses: totalExpenses.amount,
        netCashFlow: totalIncome.amount - totalExpenses.amount,
        spendingByCategory,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
