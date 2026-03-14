// GET/POST /api/plaid/budgets
// GET: Fetch all budget categories with current month spending
// POST: Update a budget limit
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get budgets
      const { data: budgets, error } = await supabase
        .from('budgets')
        .select('*')
        .order('monthly_limit', { ascending: false });

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch budgets' });
      }

      // Get current month spending by category
      const now = new Date();
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-31`;

      const { data: transactions } = await supabase
        .from('transactions')
        .select('primary_category, amount')
        .gte('date', monthStart)
        .lte('date', monthEnd)
        .gt('amount', 0); // Only debits (money out)

      const spending = {};
      (transactions || []).forEach(txn => {
        const cat = txn.primary_category || 'Uncategorized';
        spending[cat] = (spending[cat] || 0) + txn.amount;
      });

      // Merge spending into budgets
      const result = budgets.map(b => ({
        ...b,
        spent: Math.round((spending[b.category] || 0) * 100) / 100,
        pct: Math.round(((spending[b.category] || 0) / b.monthly_limit) * 100),
      }));

      res.status(200).json({ budgets: result });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }

  } else if (req.method === 'POST') {
    try {
      const { category, monthly_limit } = req.body;

      if (!category || monthly_limit == null) {
        return res.status(400).json({ error: 'category and monthly_limit required' });
      }

      const { data, error } = await supabase
        .from('budgets')
        .upsert({
          user_id: 'ayoola',
          category,
          monthly_limit,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,category' })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to update budget' });
      }

      res.status(200).json({ budget: data });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
