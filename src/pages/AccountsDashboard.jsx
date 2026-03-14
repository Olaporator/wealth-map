import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { api } from '../lib/api';
import { usePlaidLink } from '../lib/usePlaidLink';

// ─── Account Definitions (Plaid-ready) ─────────────────────────────────────
// Each account has an institutionId placeholder for Plaid linking
const ACCOUNTS = [
  {
    id: 'chase',
    name: 'Chase Checking',
    institution: 'Chase',
    type: 'checking',
    owner: 'Ayoola',
    icon: '🏦',
    color: '#3B82F6',
    plaidInstitutionId: 'ins_3',
    balance: 689.25,
    available: 689.25,
  },
  {
    id: 'novo_nimbus',
    name: 'Novo Checking',
    institution: 'Novo',
    type: 'checking',
    owner: 'NimbusTech',
    icon: '💼',
    color: '#10B981',
    plaidInstitutionId: 'ins_110266',
    balance: 2486.58,
    available: 2486.58,
  },
  {
    id: 'human_interest',
    name: 'Ayoola 401k',
    institution: 'Human Interest',
    type: 'investment',
    owner: 'Ayoola',
    icon: '📈',
    color: '#F59E0B',
    plaidInstitutionId: null,
    balance: 14818.55,
    available: null,
  },
  {
    id: 'chase_credit',
    name: 'Chase Credit Card',
    institution: 'Chase',
    type: 'credit',
    owner: 'Ayoola',
    icon: '💳',
    color: '#1D4ED8',
    plaidInstitutionId: 'ins_3',
    balance: 2129.67,
    available: 0,
    limit: 2100,
  },
  {
    id: 'capitalone',
    name: 'Capital One Venture',
    institution: 'Capital One',
    type: 'credit',
    owner: 'Joint',
    icon: '💳',
    color: '#F97316',
    plaidInstitutionId: 'ins_128026',
    balance: 13416.78,
    available: null,
  },
  {
    id: 'tiaa_403b',
    name: 'Jamie 403b',
    institution: 'TIAA',
    type: 'investment',
    owner: 'Jamie',
    icon: '🏥',
    color: '#EC4899',
    plaidInstitutionId: 'ins_116530',
    balance: 58357.98,
    available: null,
  },
  {
    id: 'tiaa_457',
    name: 'Jamie 457 Deferred Comp',
    institution: 'TIAA',
    type: 'investment',
    owner: 'Jamie',
    icon: '🏛️',
    color: '#D946EF',
    plaidInstitutionId: 'ins_116530',
    balance: 17000.00,
    available: null,
  },
  {
    id: 'robinhood_ira',
    name: 'Robinhood Traditional IRA',
    institution: 'Robinhood',
    type: 'investment',
    owner: 'Ayoola',
    icon: '🪶',
    color: '#84CC16',
    plaidInstitutionId: 'ins_117376',
    balance: 4588.22,
    available: null,
  },
  {
    id: 'robinhood_individual',
    name: 'Robinhood Individual',
    institution: 'Robinhood',
    type: 'investment',
    owner: 'Ayoola',
    icon: '📊',
    color: '#65A30D',
    plaidInstitutionId: 'ins_117376',
    balance: 82167.79,
    available: null,
  },
  {
    id: 'keybank_checking',
    name: 'Key Smart Checking',
    institution: 'KeyBank',
    type: 'checking',
    owner: 'Jamie',
    icon: '🔑',
    color: '#06B6D4',
    plaidInstitutionId: 'ins_6896',
    balance: 3659.18,
    available: 3659.18,
  },
  {
    id: 'keybank_savings',
    name: 'Key Active Saver',
    institution: 'KeyBank',
    type: 'savings',
    owner: 'Jamie',
    icon: '🏦',
    color: '#0891B2',
    plaidInstitutionId: 'ins_6896',
    balance: 492.10,
    available: 492.10,
  },
  {
    id: 'keybank_mortgage',
    name: 'Home Mortgage',
    institution: 'KeyBank',
    type: 'loan',
    owner: 'Jamie',
    icon: '🏠',
    color: '#EF4444',
    plaidInstitutionId: 'ins_6896',
    balance: 965367.21,
    available: null,
    limit: 970000,
  },
  {
    id: 'student_loans',
    name: 'Jamie Student Loans',
    institution: 'Federal / Servicer',
    type: 'loan',
    owner: 'Jamie',
    icon: '🎓',
    color: '#A855F7',
    plaidInstitutionId: null,
    balance: 200000.00,
    available: null,
    limit: 200000,
  },
  {
    id: 'venmo',
    name: 'Venmo Personal',
    institution: 'Venmo',
    type: 'checking',
    owner: 'Ayoola',
    icon: '📱',
    color: '#3D95CE',
    plaidInstitutionId: null,
    balance: 0.00,
    available: 0.00,
  },
];

// ─── Mock Transaction Data ──────────────────────────────────────────────────
const generateMockTransactions = () => {
  const categories = {
    'Housing': { icon: '🏠', color: '#3B82F6', subcats: ['Mortgage Payment', 'Home Insurance', 'Property Tax', 'Maintenance'] },
    'Food & Dining': { icon: '🍽️', color: '#F59E0B', subcats: ['Groceries', 'Restaurants', 'Coffee Shops', 'Fast Food'] },
    'Transportation': { icon: '🚗', color: '#8B5CF6', subcats: ['Gas', 'Car Insurance', 'Parking', 'Uber/Lyft'] },
    'Utilities': { icon: '⚡', color: '#06B6D4', subcats: ['Electric', 'Water', 'Internet', 'Phone'] },
    'Healthcare': { icon: '🏥', color: '#EC4899', subcats: ['Doctor Visit', 'Pharmacy', 'Insurance Premium', 'Lab Tests'] },
    'Shopping': { icon: '🛍️', color: '#10B981', subcats: ['Amazon', 'Target', 'Clothing', 'Electronics'] },
    'Entertainment': { icon: '🎬', color: '#F97316', subcats: ['Streaming', 'Movies', 'Games', 'Books'] },
    'Business': { icon: '💼', color: '#84CC16', subcats: ['Software', 'Contractors', 'Cloud Services', 'Office Supplies'] },
    'Transfer': { icon: '↔️', color: '#9CA3AF', subcats: ['401k Contribution', 'Savings Transfer', 'Investment Transfer'] },
    'Income': { icon: '💰', color: '#10B981', subcats: ['NimbusTech Invoice', 'Jamie Paycheck', 'Rental Income', 'Investment Dividend'] },
  };

  const merchants = {
    'Groceries': ['Whole Foods', 'Trader Joe\'s', 'QFC', 'Costco'],
    'Restaurants': ['Chipotle', 'Sushi Kashiba', 'Din Tai Fung', 'Local Bistro'],
    'Coffee Shops': ['Starbucks', 'Elm Coffee Roasters', 'Victrola Coffee'],
    'Gas': ['Shell', 'Costco Gas', 'Chevron'],
    'Streaming': ['Netflix', 'Spotify', 'YouTube Premium', 'Disney+'],
    'Software': ['AWS', 'Vercel', 'GitHub', 'Figma', 'Slack'],
    'Cloud Services': ['Google Cloud', 'Cloudflare', 'DigitalOcean'],
    'Amazon': ['Amazon.com', 'Amazon Fresh'],
  };

  const txns = [];
  const now = new Date(2026, 2, 13); // March 13, 2026

  // Income transactions
  txns.push({ id: 't001', date: '2026-03-01', description: 'NimbusTech Consulting Invoice', amount: 16666.67, category: 'Income', account: 'chase', type: 'income' });
  txns.push({ id: 't002', date: '2026-03-01', description: 'Jamie - University of Washington Medical', amount: 4166.67, category: 'Income', account: 'keybank_checking', type: 'income' });
  txns.push({ id: 't003', date: '2026-03-01', description: 'NT → Olaporations Mgmt Fee', amount: 15000.00, category: 'Transfer', account: 'novo_olaporations', type: 'income' });
  txns.push({ id: 't004', date: '2026-02-28', description: 'Seattle Rental Income - Tenant', amount: 6000.00, category: 'Income', account: 'chase', type: 'income' });

  // Housing
  txns.push({ id: 't010', date: '2026-03-01', description: 'KeyBank Mortgage Payment', amount: -5600.00, category: 'Housing', account: 'keybank_checking', type: 'expense' });
  txns.push({ id: 't011', date: '2026-03-05', description: 'State Farm - Home Insurance', amount: -200.00, category: 'Housing', account: 'chase', type: 'expense' });

  // Food & Dining
  txns.push({ id: 't020', date: '2026-03-12', description: 'Whole Foods Market', amount: -187.42, category: 'Food & Dining', account: 'capitalone', type: 'expense' });
  txns.push({ id: 't021', date: '2026-03-11', description: 'Din Tai Fung', amount: -78.50, category: 'Food & Dining', account: 'capitalone', type: 'expense' });
  txns.push({ id: 't022', date: '2026-03-10', description: 'Trader Joe\'s', amount: -95.20, category: 'Food & Dining', account: 'capitalone', type: 'expense' });
  txns.push({ id: 't023', date: '2026-03-08', description: 'Starbucks', amount: -12.45, category: 'Food & Dining', account: 'capitalone', type: 'expense' });
  txns.push({ id: 't024', date: '2026-03-06', description: 'Costco', amount: -342.18, category: 'Food & Dining', account: 'capitalone', type: 'expense' });
  txns.push({ id: 't025', date: '2026-03-03', description: 'Sushi Kashiba', amount: -124.00, category: 'Food & Dining', account: 'chase', type: 'expense' });

  // Transportation
  txns.push({ id: 't030', date: '2026-03-09', description: 'Costco Gas', amount: -62.40, category: 'Transportation', account: 'capitalone', type: 'expense' });
  txns.push({ id: 't031', date: '2026-03-04', description: 'GEICO Auto Insurance', amount: -145.00, category: 'Transportation', account: 'chase', type: 'expense' });

  // Utilities
  txns.push({ id: 't040', date: '2026-03-02', description: 'Puget Sound Energy', amount: -185.00, category: 'Utilities', account: 'chase', type: 'expense' });
  txns.push({ id: 't041', date: '2026-03-02', description: 'Xfinity Internet', amount: -89.99, category: 'Utilities', account: 'chase', type: 'expense' });
  txns.push({ id: 't042', date: '2026-03-02', description: 'T-Mobile Family Plan', amount: -140.00, category: 'Utilities', account: 'chase', type: 'expense' });

  // Business expenses
  txns.push({ id: 't050', date: '2026-03-07', description: 'Vercel Pro', amount: -20.00, category: 'Business', account: 'novo_nimbus', type: 'expense' });
  txns.push({ id: 't051', date: '2026-03-01', description: 'AWS - Cloud Services', amount: -245.60, category: 'Business', account: 'novo_nimbus', type: 'expense' });
  txns.push({ id: 't052', date: '2026-03-01', description: 'GitHub Team', amount: -25.00, category: 'Business', account: 'novo_nimbus', type: 'expense' });
  txns.push({ id: 't053', date: '2026-03-01', description: 'Figma Professional', amount: -15.00, category: 'Business', account: 'novo_nimbus', type: 'expense' });
  txns.push({ id: 't054', date: '2026-03-01', description: 'Slack Pro', amount: -12.50, category: 'Business', account: 'novo_nimbus', type: 'expense' });

  // Healthcare
  txns.push({ id: 't060', date: '2026-03-06', description: 'Kaiser Permanente', amount: -450.00, category: 'Healthcare', account: 'chase', type: 'expense' });

  // Entertainment
  txns.push({ id: 't070', date: '2026-03-01', description: 'Netflix', amount: -22.99, category: 'Entertainment', account: 'capitalone', type: 'expense' });
  txns.push({ id: 't071', date: '2026-03-01', description: 'Spotify Family', amount: -16.99, category: 'Entertainment', account: 'capitalone', type: 'expense' });
  txns.push({ id: 't072', date: '2026-03-01', description: 'YouTube Premium', amount: -13.99, category: 'Entertainment', account: 'capitalone', type: 'expense' });

  // Shopping
  txns.push({ id: 't080', date: '2026-03-09', description: 'Amazon.com', amount: -67.42, category: 'Shopping', account: 'capitalone', type: 'expense' });
  txns.push({ id: 't081', date: '2026-03-05', description: 'Target', amount: -45.88, category: 'Shopping', account: 'capitalone', type: 'expense' });

  // Chase credit card charges
  txns.push({ id: 't083', date: '2026-03-10', description: 'Home Depot', amount: -127.45, category: 'Shopping', account: 'chase_credit', type: 'expense' });
  txns.push({ id: 't084', date: '2026-03-07', description: 'Safeway', amount: -68.30, category: 'Food & Dining', account: 'chase_credit', type: 'expense' });
  txns.push({ id: 't085', date: '2026-03-03', description: 'Shell Gas', amount: -54.20, category: 'Transportation', account: 'chase_credit', type: 'expense' });

  // Student loan payment
  txns.push({ id: 't086', date: '2026-03-05', description: 'Federal Student Loan Payment', amount: -1800.00, category: 'Housing', account: 'keybank_checking', type: 'expense' });

  // Retirement contributions
  txns.push({ id: 't090', date: '2026-03-01', description: '401k Contribution - Human Interest', amount: -1000.00, category: 'Transfer', account: 'chase', type: 'transfer' });
  txns.push({ id: 't091', date: '2026-03-01', description: '403b Contribution - TIAA', amount: -833.33, category: 'Transfer', account: 'keybank_checking', type: 'transfer' });
  txns.push({ id: 't093', date: '2026-03-01', description: '457 Contribution - TIAA (reduced)', amount: -200.00, category: 'Transfer', account: 'keybank_checking', type: 'transfer' });
  txns.push({ id: 't092', date: '2026-03-01', description: 'Robinhood Transfer', amount: -500.00, category: 'Transfer', account: 'chase', type: 'transfer' });

  // February transactions for trend data
  txns.push({ id: 't100', date: '2026-02-01', description: 'NimbusTech Consulting Invoice', amount: 16666.67, category: 'Income', account: 'chase', type: 'income' });
  txns.push({ id: 't101', date: '2026-02-01', description: 'Jamie - UW Medical', amount: 4166.67, category: 'Income', account: 'keybank_checking', type: 'income' });
  txns.push({ id: 't102', date: '2026-02-15', description: 'Whole Foods Market', amount: -165.30, category: 'Food & Dining', account: 'capitalone', type: 'expense' });
  txns.push({ id: 't103', date: '2026-02-10', description: 'Shell Gas', amount: -58.20, category: 'Transportation', account: 'capitalone', type: 'expense' });
  txns.push({ id: 't104', date: '2026-02-01', description: 'KeyBank Mortgage', amount: -5600.00, category: 'Housing', account: 'keybank_checking', type: 'expense' });
  txns.push({ id: 't105', date: '2026-02-01', description: 'AWS', amount: -232.40, category: 'Business', account: 'novo_nimbus', type: 'expense' });

  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// ─── Budget Definitions ─────────────────────────────────────────────────────
const BUDGETS = [
  { category: 'Housing', monthly: 5500, icon: '🏠', color: '#3B82F6' },
  { category: 'Groceries', monthly: 1000, icon: '🛒', color: '#22C55E' },
  { category: 'Dining & Delivery', monthly: 500, icon: '🍽️', color: '#F59E0B' },
  { category: 'Shopping', monthly: 500, icon: '🛍️', color: '#10B981' },
  { category: 'Spillover', monthly: 500, icon: '✈️', color: '#38BDF8' },
  { category: 'Auto / Transport', monthly: 950, icon: '🚗', color: '#8B5CF6' },
  { category: 'Utilities', monthly: 550, icon: '⚡', color: '#06B6D4' },
  { category: 'Lifestyle & Subs', monthly: 250, icon: '🎬', color: '#F97316' },
  { category: 'Other', monthly: 250, icon: '📦', color: '#6B7280' },
  { category: 'Loans & Interest', monthly: 500, icon: '🎓', color: '#A855F7' },
];

// Monthly spending history for trend chart
const MONTHLY_TRENDS = [
  { month: 'Oct', income: 11000, spending: 10800, savings: 200 },
  { month: 'Nov', income: 11000, spending: 11600, savings: -600 },
  { month: 'Dec', income: 11000, spending: 14920, savings: -3920 },
  { month: 'Jan', income: 11000, spending: 12400, savings: -1400 },
  { month: 'Feb', income: 11000, spending: 13400, savings: -2400 },
  { month: 'Mar', income: 11800, spending: 10550, savings: 1250 },
];

// ─── Net Worth History (for real-time tracking) ─────────────────────────────
const NET_WORTH_HISTORY = [
  { month: 'Oct', assets: 285000, liabilities: 1181000, netWorth: -896000 },
  { month: 'Nov', assets: 287000, liabilities: 1180500, netWorth: -893500 },
  { month: 'Dec', assets: 289000, liabilities: 1180000, netWorth: -891000 },
  { month: 'Jan', assets: 291000, liabilities: 1181000, netWorth: -890000 },
  { month: 'Feb', assets: 293000, liabilities: 1181500, netWorth: -888500 },
  { month: 'Mar', assets: 295000, liabilities: 1180900, netWorth: -885900 },
];

const CATEGORY_COLORS = {
  'Housing': '#3B82F6',
  'Groceries': '#22C55E',
  'Dining & Delivery': '#F59E0B',
  'Shopping': '#10B981',
  'Spillover': '#38BDF8',
  'Auto / Transport': '#8B5CF6',
  'Utilities': '#06B6D4',
  'Lifestyle & Subs': '#F97316',
  'Healthcare': '#EC4899',
  'Other': '#6B7280',
  'Transfer': '#9CA3AF',
  'Income': '#10B981',
  'Business': '#84CC16',
  'Loans & Interest': '#A855F7',
  'Uncategorized': '#6B7280',
};

// ─── View Modes Configuration ────────────────────────────────────────
const VIEW_MODES = {
  household: {
    label: 'Household',
    icon: '🏠',
    description: 'All personal accounts for both Ayoola & Jamie',
    accountFilter: (a) => a.institution !== 'Novo',
  },
  ayoola: {
    label: 'Ayoola',
    icon: '👤',
    description: 'Ayoola\'s accounts',
    accountFilter: (a) => ['Chase', 'Robinhood', 'Human Interest', 'Venmo'].includes(a.institution) || a.owner === 'Ayoola' || a.owner === 'Joint',
  },
  jamie: {
    label: 'Jamie',
    icon: '👥',
    description: 'Jamie\'s accounts',
    accountFilter: (a) => ['KeyBank', 'TIAA', 'Federal / Servicer'].includes(a.institution) || a.owner === 'Jamie' || a.owner === 'Joint',
  },
  business: {
    label: 'Business',
    icon: '💼',
    description: 'All business accounts',
    accountFilter: (a) => a.institution === 'Novo' || ['NimbusTech', 'Olaporations'].includes(a.owner),
  },
  nimbus: {
    label: 'NimbusTech',
    icon: '🚀',
    description: 'NimbusTech accounts',
    accountFilter: (a) => a.institution === 'Novo',
  },
  olaporations: {
    label: 'Olaporations',
    icon: '🎯',
    description: 'Olaporations accounts',
    accountFilter: (a) => a.owner === 'Olaporations',
  },
  investments: {
    label: 'Investments',
    icon: '📈',
    description: 'All investment & retirement accounts',
    accountFilter: (a) => a.type === 'investment',
  },
};

export default function AccountsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('household');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Live vs Demo Mode ────────────────────────────────────────────────
  const [isLive, setIsLive] = useState(false);
  const [liveAccounts, setLiveAccounts] = useState([]);
  const [liveTransactions, setLiveTransactions] = useState([]);
  const [liveBudgets, setLiveBudgets] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Try to load live data on mount
  const fetchLiveData = useCallback(async (refresh = false) => {
    try {
      setApiError(null);
      const [accountsData, txnData, budgetData] = await Promise.all([
        api.getAccounts(refresh),
        api.getTransactions({ limit: 200 }),
        api.getBudgets(),
      ]);

      if (accountsData.accounts && accountsData.accounts.length > 0) {
        setLiveAccounts(accountsData.accounts);
        setLiveTransactions(txnData.transactions || []);
        setLiveBudgets(budgetData.budgets || []);
        setIsLive(true);
        setLastSync(new Date());
      }
    } catch (err) {
      console.log('Live API not available, using demo data:', err.message);
      setApiError(err.message);
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // Plaid Link hook
  const { openLink, loading: plaidLoading, error: plaidError } = usePlaidLink({
    onSuccess: async () => {
      // After linking, refresh everything
      await fetchLiveData(true);
    },
  });

  // Manual sync
  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.syncTransactions();
      await fetchLiveData(true);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  // Connect Account button handler — uses real Plaid Link if API is available, else shows info
  const handleConnectAccount = async () => {
    try {
      await openLink();
    } catch (err) {
      alert('Plaid Link will be connected once API keys are configured in Vercel Environment Variables.\n\nNeeded:\n• PLAID_CLIENT_ID\n• PLAID_SECRET\n• PLAID_ENV (sandbox)\n• SUPABASE_URL\n• SUPABASE_SERVICE_KEY');
    }
  };

  // ─── Edit manual account balance ────────────────────────────────────
  const [editingAccount, setEditingAccount] = useState(null);
  const [editBalance, setEditBalance] = useState('');
  const [expandedBudget, setExpandedBudget] = useState(null);

  const handleUpdateBalance = async (accountId) => {
    const newBalance = parseFloat(editBalance);
    if (isNaN(newBalance)) return;
    try {
      await api.updateManualAccount(accountId, { current_balance: newBalance });
      await fetchLiveData(false);
      setEditingAccount(null);
      setEditBalance('');
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  };

  // ─── Choose data source ───────────────────────────────────────────────
  const allAccounts = isLive ? liveAccounts.map(a => ({
    id: a.account_id,
    name: a.nickname || a.name,
    institution: a.institution || a.plaid_items?.institution_name || 'Unknown',
    type: a.type === 'depository' ? 'checking' : a.type,
    subtype: a.subtype || '',
    owner: a.owner || 'Unknown',
    icon: a.icon || '🏦',
    color: a.color || '#6B7280',
    balance: Math.abs(a.current_balance || 0),
    available: a.available_balance,
    limit: a.credit_limit,
    isManual: !a.plaid_item_id,
  })) : ACCOUNTS;

  // ─── Grocery store names for splitting Food & Dining ───────────────
  const GROCERY_NAMES = [
    'WHOLE FOODS', 'TRADER JOE', 'SAFEWAY', 'COSTCO', 'WALMART', 'QFC',
    'FRED MEYER', 'AMAZON FRESH', 'TARGET', 'INSTACART', 'PCC', 'NEW ROOTS',
    'AZURE STANDARD', 'SPROUTS', 'GROCERY', 'KROGER', 'PIGGLY', 'PICK N SAVE',
    'CENTRAL CO-OP', 'TABLE22', 'FLORA BAKE', 'PRIMO',
  ];

  const DELIVERY_DINING_NAMES = [
    'DOORDASH', 'UBER EATS', 'UBEREATS', 'GRUBHUB', 'POSTMATES',
    'STARBUCKS', 'COFFEE', 'CAFE', 'RESTAURANT', 'BURGER', 'PIZZA',
    'INSOMNIA', 'SALT AND STRAW', 'SALT & STRAW', 'TACO', 'SUSHI',
    'CHIPOTLE', 'BAKERY', 'GRILL', 'KITCHEN', 'BAR ', 'PUB',
    'VEGGIE GRILL', 'DIN TAI FUNG', 'DIVA ESPRESSO', 'FIREHOUSE COFFEE',
    'NEXTLEVELBURGER', 'ICE CREAM', 'COOKIE', 'BOBA', 'JUICE', 'SMOOTHIE',
    'WINGSTOP', 'PANDA EXPRESS', 'CHICK-FIL', 'DREAMLAND', 'MATADOR',
    'FLATSTICK', 'NAUTICAL BOWLS', 'MIGHTY-O', 'DONUTS', 'EMME',
  ];

  const SUBSCRIPTION_NAMES = [
    'NETFLIX', 'SPOTIFY', 'YOUTUBE PREMIUM', 'DISNEY+', 'HULU',
    'AMAZON PRIME', 'APPLE.COM/BILL', 'OPENAI', 'ADOBE', 'GOOGLE ONE',
    'AUTOPILOT', 'ROCKET MONEY', 'YMCA', 'CLIFF KEEN',
  ];

  const GAS_AUTO_NAMES = [
    'GREENWOOD 76', '76 ', 'SHELL', 'CHEVRON', 'ARCO', 'BP ', 'EXXON',
    'MOBIL', 'TEXACO', 'CITGO', 'VALERO', 'SPEEDWAY', 'CIRCLE K',
    'WAWA', 'KWIK', 'GAS', 'FUEL', 'PETRO', 'SUNOCO', 'MARATHON',
    'PHILLIPS 66', 'CONOCO', 'SINCLAIR', 'AM PM', 'AMPM',
  ];

  const allTransactions = isLive ? liveTransactions.map(t => {
    const name = (t.name || '').toUpperCase();
    const merchant = (t.merchant_name || '').toUpperCase();
    let category = t.primary_category || 'Uncategorized';
    let type = t.amount > 0 ? 'expense' : t.amount < 0 ? 'income' : 'transfer';

    // ─── Fix Plaid miscategorizations ────────────────────────────────
    // CC payments are transfers between accounts, not spending
    if (name.includes('CAPITAL ONE') && (name.includes('PMT') || name.includes('PAYMENT'))
      || name.includes('PAYMENT TO CHASE CARD')
      || name.includes('CHASE CARD') && name.includes('PAYMENT')
      || (merchant.includes('CAPITAL ONE') && name.includes('PMT'))) {
      category = 'Transfer';
      type = 'transfer';
    }
    // Student loan payments
    else if (name.includes('UAS EPAYMENT') || name.includes('STUDENT LOAN')
      || name.includes('MOHELA') || name.includes('NELNET') || name.includes('AIDVANTAGE')
      || name.includes('FEDLOAN') || name.includes('GREAT LAKES')) {
      category = 'Loans & Interest';
      type = 'expense';
    }
    // Interest/finance charges
    else if (name.includes('INTEREST CHARGE') || name.includes('FINANCE CHARGE')
      || name.includes('PURCHASE INTEREST') || name.includes('CASH ADVANCE INTEREST')) {
      category = 'Loans & Interest';
      type = 'expense';
    }
    // Bank fees
    else if (name.includes('OVERDRAFT FEE') || name.includes('NON-CHASE ATM FEE')
      || name.includes('FOREIGN TRANSACTION FEE') || name.includes('CASH ADVANCE FEE')
      || name.includes('TRANSACTION FEE') || name.includes('PLAN FEE')) {
      category = 'Loans & Interest';
      type = 'expense';
    }
    // Plaid miscategorized merchants
    else if (name.includes('HAPPY GARDEN DECOR')) {
      category = 'Shopping';
      type = 'expense';
    }
    // Inter-business transfers
    else if (name.includes('OLAPORATIONS') || name.includes('NIMBUS')
      || (name.includes('AAYO TECH') && type === 'expense')) {
      category = 'Transfer';
      type = 'transfer';
    }
    // Gas stations & auto → Auto / Transport
    else if (GAS_AUTO_NAMES.some(g => name.includes(g) || merchant.includes(g))) {
      category = 'Auto / Transport';
    }
    // ─── Split Food & Dining into Groceries vs Dining & Delivery ─────
    else if (category === 'Food & Dining' || category === 'Food and Drink' || category === 'FOOD_AND_DRINK') {
      if (GROCERY_NAMES.some(g => name.includes(g) || merchant.includes(g))) {
        category = 'Groceries';
      } else {
        category = 'Dining & Delivery';
      }
    }
    // ─── Remap Plaid categories to budget categories ─────────────────
    else if (category === 'Transportation') {
      category = 'Auto / Transport';
    }
    else if (category === 'Entertainment') {
      // Check if it's a subscription
      if (SUBSCRIPTION_NAMES.some(s => name.includes(s) || merchant.includes(s))) {
        category = 'Lifestyle & Subs';
      } else {
        category = 'Lifestyle & Subs';
      }
    }
    else if (category === 'Healthcare') {
      category = 'Other';
    }
    // Subscriptions that Plaid categorizes as Business or Shopping
    else if (SUBSCRIPTION_NAMES.some(s => name.includes(s) || merchant.includes(s))
      && category !== 'Transfer' && category !== 'Income') {
      category = 'Lifestyle & Subs';
    }
    // Shopping stays Shopping, but some items might be Spillover (travel etc.)
    else if (category === 'Shopping') {
      // Check for travel-related
      if (name.includes('AIRLINE') || name.includes('HOTEL') || name.includes('AIRBNB')
        || name.includes('FLIGHT') || name.includes('BOOKING') || name.includes('EXPEDIA')
        || name.includes('VRBO') || name.includes('TRAVEL')) {
        category = 'Spillover';
      }
      // Otherwise stays Shopping
    }

    return {
      id: t.transaction_id,
      date: t.date,
      description: t.name || t.merchant_name || 'Unknown',
      amount: -t.amount,
      category,
      account: t.account_id,
      type,
    };
  }) : generateMockTransactions();

  // Filter by active view
  const accounts = useMemo(() => {
    const filter = VIEW_MODES[viewMode]?.accountFilter;
    return filter ? allAccounts.filter(filter) : allAccounts;
  }, [allAccounts, viewMode]);

  const transactions = useMemo(() => {
    const accountIds = new Set(accounts.map(a => a.id));
    return allTransactions.filter(t => accountIds.has(t.account));
  }, [allTransactions, accounts]);

  // ─── Computed Data ──────────────────────────────────────────────────────
  const totalAssets = useMemo(() => {
    return accounts
      .filter(a => a.type !== 'loan' && a.type !== 'credit')
      .reduce((sum, a) => sum + a.balance, 0);
  }, [accounts]);

  const totalLiabilities = useMemo(() => {
    return accounts
      .filter(a => a.type === 'loan' || a.type === 'credit')
      .reduce((sum, a) => sum + a.balance, 0);
  }, [accounts]);

  const netWorth = totalAssets - totalLiabilities;

  const marchExpenses = useMemo(() => {
    return transactions
      .filter(t => t.date.startsWith('2026-03') && t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [transactions]);

  const marchIncome = useMemo(() => {
    return transactions
      .filter(t => t.date.startsWith('2026-03') && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // ─── Spillover logic: overflow from Dining, Shopping, Other → Spillover ──
  const SPILLABLE_CATEGORIES = ['Dining & Delivery', 'Shopping', 'Other'];
  const spilloverBudgetMap = useMemo(() => {
    const budgetLimits = {};
    BUDGETS.forEach(b => { budgetLimits[b.category] = b.monthly; });
    return budgetLimits;
  }, []);

  // Compute effective categories with spillover applied
  const effectiveTransactions = useMemo(() => {
    const monthTxns = transactions.filter(t => t.date.startsWith('2026-03') && t.type === 'expense');
    // Sort by date so earlier-in-month transactions stay in their category
    const sorted = [...monthTxns].sort((a, b) => a.date.localeCompare(b.date));
    const running = {};
    return sorted.map(t => {
      const cat = t.category;
      const amt = Math.abs(t.amount);
      if (SPILLABLE_CATEGORIES.includes(cat)) {
        if (!running[cat]) running[cat] = 0;
        running[cat] += amt;
        if (running[cat] > spilloverBudgetMap[cat]) {
          return { ...t, category: 'Spillover' };
        }
      }
      return t;
    });
  }, [transactions, spilloverBudgetMap]);

  const spendingByCategory = useMemo(() => {
    const cats = {};
    effectiveTransactions.forEach(t => {
      if (!cats[t.category]) cats[t.category] = 0;
      cats[t.category] += Math.abs(t.amount);
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100, color: CATEGORY_COLORS[name] }))
      .sort((a, b) => b.value - a.value);
  }, [effectiveTransactions]);

  const budgetProgress = useMemo(() => {
    const spent = {};
    effectiveTransactions.forEach(t => {
      if (!spent[t.category]) spent[t.category] = 0;
      spent[t.category] += Math.abs(t.amount);
    });
    return BUDGETS.map(b => ({
      ...b,
      spent: Math.round((spent[b.category] || 0) * 100) / 100,
      pct: b.monthly > 0 ? Math.round(((spent[b.category] || 0) / b.monthly) * 100) : (spent[b.category] > 0 ? 100 : 0),
    }));
  }, [effectiveTransactions]);

  // Group transactions by budget category for drill-down
  const budgetTransactions = useMemo(() => {
    const grouped = {};
    effectiveTransactions.forEach(t => {
      const cat = t.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(t);
    });
    // Sort each category's transactions by amount (largest first)
    Object.values(grouped).forEach(arr => arr.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)));
    return grouped;
  }, [effectiveTransactions]);

  const filteredTransactions = useMemo(() => {
    let txns = transactions;
    if (selectedAccount) {
      txns = txns.filter(t => t.account === selectedAccount);
    }
    if (searchQuery) {
      txns = txns.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return txns;
  }, [transactions, selectedAccount, searchQuery]);

  const formatCurrency = (value) => {
    if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatFull = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const dayOfMonth = 13;
  const daysInMonth = 31;
  const monthProgress = Math.round((dayOfMonth / daysInMonth) * 100);

  // ─── Plaid Link Handler (see handleConnectAccount above) ──────────────

  // ─── Tab Navigation ───────────────────────────────────────────────────
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'accounts', label: 'Accounts', icon: '🏦' },
    { id: 'transactions', label: 'Transactions', icon: '📋' },
    { id: 'budgets', label: 'Budgets', icon: '🎯' },
    { id: 'trends', label: 'Trends', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Page Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Accounts & Budget</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-500 text-sm">March 2026</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isLive
                  ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700'
                  : 'bg-amber-900/50 text-amber-400 border border-amber-700'
              }`}>
                {isLive ? '● Live' : '● Demo'}
              </span>
              {lastSync && (
                <span className="text-gray-600 text-xs">
                  Synced {lastSync.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isLive && (
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 rounded-lg text-sm text-gray-300 transition flex items-center gap-1"
              >
                <span className={syncing ? 'animate-spin' : ''}>⟳</span>
                {syncing ? 'Syncing...' : 'Sync'}
              </button>
            )}
            <button
              onClick={handleConnectAccount}
              disabled={plaidLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              {plaidLoading ? (
                <><span className="animate-spin">⟳</span> Connecting...</>
              ) : (
                <><span>🔗</span> Connect Account</>
              )}
            </button>
          </div>
        </div>
        {plaidError && (
          <div className="mb-3 p-2 bg-red-900/20 border border-red-800 rounded-lg text-xs text-red-400">
            Plaid error: {plaidError}
          </div>
        )}

        {/* View Toggle */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2" style={{ scrollbarWidth: 'none' }}>
          {Object.entries(VIEW_MODES).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition ${
                viewMode === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {mode.icon} {mode.label}
            </button>
          ))}
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-1">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ═══════════════ OVERVIEW TAB ═══════════════ */}
        {activeTab === 'overview' && (
          <>
            {/* Top-level summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="text-gray-500 text-xs">Net Worth</div>
                <div className={`text-xl font-bold ${netWorth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatFull(netWorth)}
                </div>
                <div className="text-gray-600 text-xs mt-1">Assets: {formatCurrency(totalAssets)}</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="text-gray-500 text-xs">March Income</div>
                <div className="text-xl font-bold text-emerald-400">{formatFull(marchIncome)}</div>
                <div className="text-gray-600 text-xs mt-1">On track for ~{formatCurrency(marchIncome)}</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="text-gray-500 text-xs">March Spending</div>
                <div className="text-xl font-bold text-red-400">{formatFull(marchExpenses)}</div>
                <div className="text-gray-600 text-xs mt-1">{monthProgress}% through month</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="text-gray-500 text-xs">March Savings</div>
                <div className="text-xl font-bold text-blue-400">{formatFull(marchIncome - marchExpenses)}</div>
                <div className="text-emerald-500 text-xs mt-1">
                  {Math.round(((marchIncome - marchExpenses) / marchIncome) * 100)}% savings rate
                </div>
              </div>
            </div>

            {/* Spending by Category Donut + Cash Flow Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Spending Donut */}
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Spending by Category</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={spendingByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {spendingByCategory.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs">
                            <div className="text-white font-bold">{payload[0].payload.name}</div>
                            <div className="text-gray-300">{formatFull(payload[0].value)}</div>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center text-gray-400 text-xs">Total: {formatFull(marchExpenses)}</div>
              </div>

              {/* Cash Flow Trend */}
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Monthly Cash Flow</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={MONTHLY_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs">
                            <div className="text-white font-bold mb-1">{label}</div>
                            {payload.map((p, i) => (
                              <div key={i} style={{ color: p.color }}>{p.name}: {formatFull(p.value)}</div>
                            ))}
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spending" fill="#EF4444" name="Spending" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 text-xs mt-1">
                  <span className="text-emerald-400">● Income</span>
                  <span className="text-red-400">● Spending</span>
                </div>
              </div>
            </div>

            {/* Quick Account Balances */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Account Balances</h3>
              <div className="space-y-2">
                {accounts.map(account => (
                  <div
                    key={account.id}
                    onClick={() => {
                      if (account.isManual) {
                        setEditingAccount(editingAccount === account.id ? null : account.id);
                        setEditBalance(account.balance.toString());
                      } else {
                        setSelectedAccount(account.id); setActiveTab('transactions');
                      }
                    }}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer transition hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{account.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{account.name}</span>
                          {account.isManual && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">Manual</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {account.institution} · {account.owner}
                          {account.subtype && ` · ${account.subtype}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {editingAccount === account.id ? (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <span className="text-gray-500 text-sm">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editBalance}
                            onChange={e => setEditBalance(e.target.value)}
                            className="w-28 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-emerald-500"
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter') handleUpdateBalance(account.id); }}
                          />
                          <button
                            onClick={() => handleUpdateBalance(account.id)}
                            className="text-xs px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className={`text-sm font-bold ${
                            account.type === 'loan' || account.type === 'credit' ? 'text-red-400' : 'text-white'
                          }`}>
                            {account.type === 'loan' || account.type === 'credit' ? '-' : ''}{formatFull(account.balance)}
                          </div>
                          {account.isManual && (
                            <div className="text-xs text-gray-600">click to edit</div>
                          )}
                        </>
                      )}
                      {!editingAccount && account.type === 'credit' && (
                        <div className="text-xs text-gray-500">{formatFull(account.available)} available</div>
                      )}
                      {!editingAccount && account.type === 'checking' && account.available && (
                        <div className="text-xs text-gray-500">{formatFull(account.available)} available</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions Preview */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-300">Recent Transactions</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-1">
                {transactions.slice(0, 8).map(txn => {
                  const account = accounts.find(a => a.id === txn.account);
                  return (
                    <div key={txn.id} className="flex items-center justify-between py-2 px-2 hover:bg-gray-800 rounded transition">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                          style={{ backgroundColor: `${CATEGORY_COLORS[txn.category]}20`, color: CATEGORY_COLORS[txn.category] }}>
                          {txn.category === 'Income' ? '💰' : txn.category === 'Transfer' ? '↔️' : '•'}
                        </div>
                        <div>
                          <div className="text-sm text-white">{txn.description}</div>
                          <div className="text-xs text-gray-500">{txn.date} · {account?.name}</div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${txn.amount >= 0 ? 'text-emerald-400' : 'text-white'}`}>
                        {txn.amount >= 0 ? '+' : ''}{formatFull(txn.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════ ACCOUNTS TAB ═══════════════ */}
        {activeTab === 'accounts' && (
          <>
            {/* Account Groups */}
            {[
              { label: 'Cash & Checking', types: ['checking'], icon: '💵' },
              { label: 'Investments & Retirement', types: ['investment'], icon: '📈' },
              { label: 'Loans & Credit', types: ['loan', 'credit'], icon: '💳' },
            ].map(group => {
              const groupAccounts = accounts.filter(a => group.types.includes(a.type));
              const groupTotal = groupAccounts.reduce((sum, a) => sum + a.balance, 0);
              return (
                <div key={group.label} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-300">
                      {group.icon} {group.label}
                    </h3>
                    <span className={`text-sm font-bold ${
                      group.types.includes('loan') || group.types.includes('credit') ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {group.types.includes('loan') || group.types.includes('credit') ? '-' : ''}{formatFull(groupTotal)}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {groupAccounts.map(account => (
                      <div
                        key={account.id}
                        onClick={() => { setSelectedAccount(account.id); setActiveTab('transactions'); }}
                        className="flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                            style={{ backgroundColor: `${account.color}20` }}>
                            {account.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{account.name}</div>
                            <div className="text-xs text-gray-500">{account.institution} · {account.owner}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            account.type === 'loan' || account.type === 'credit' ? 'text-red-400' : 'text-white'
                          }`}>
                            {formatFull(account.balance)}
                          </div>
                          {account.limit && (
                            <div className="text-xs text-gray-500">
                              {formatFull(account.limit)} limit
                            </div>
                          )}
                          {account.available != null && account.type !== 'loan' && (
                            <div className="text-xs text-gray-500">
                              {formatFull(account.available)} available
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Net Worth Summary */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Net Worth Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Assets</span>
                  <span className="text-emerald-400 font-bold">{formatFull(totalAssets)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Liabilities</span>
                  <span className="text-red-400 font-bold">-{formatFull(totalLiabilities)}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
                  <span className="text-white font-semibold">Net Worth</span>
                  <span className={`text-xl font-bold ${netWorth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatFull(netWorth)}
                  </span>
                </div>
              </div>

              {/* Net Worth Trend Chart */}
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={NET_WORTH_HISTORY}>
                    <defs>
                      <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs">
                            <div className="text-white font-bold mb-1">{label}</div>
                            <div className="text-emerald-400">Assets: {formatFull(payload[0]?.payload?.assets)}</div>
                            <div className="text-red-400">Liabilities: {formatFull(payload[0]?.payload?.liabilities)}</div>
                            <div className="text-white font-bold">Net Worth: {formatFull(payload[0]?.value)}</div>
                          </div>
                        );
                      }}
                    />
                    <Area type="monotone" dataKey="netWorth" stroke="#EF4444" fill="url(#nwGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="text-center text-xs text-gray-500 mt-1">
                  Net worth improving as debt pays down — currently negative due to $970K mortgage + $200K student loans
                </div>
              </div>
            </div>

            {/* Plaid Connection Status */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">🔗 Connected Institutions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(() => {
                  // Group accounts by institution
                  const institutions = {};
                  accounts.forEach(a => {
                    const inst = a.institution || 'Unknown';
                    if (!institutions[inst]) institutions[inst] = { name: inst, accounts: 0 };
                    institutions[inst].accounts++;
                  });
                  return Object.values(institutions).map(inst => (
                    <div key={inst.name} className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-xs font-medium text-white">{inst.name}</div>
                      <div className={`text-xs mt-1 ${isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {isLive ? '● Connected' : '● Demo Mode'}
                      </div>
                      <div className="text-xs text-gray-500">{inst.accounts} account{inst.accounts > 1 ? 's' : ''}</div>
                    </div>
                  ));
                })()}
              </div>
              <div className={`mt-3 p-3 rounded-lg ${
                isLive
                  ? 'bg-emerald-900/20 border border-emerald-800'
                  : 'bg-amber-900/20 border border-amber-800'
              }`}>
                <div className={`text-xs ${isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isLive
                    ? '✓ Live data — accounts synced via Plaid. Click "Connect Account" to add more institutions.'
                    : '⚠️ Demo mode — configure Plaid & Supabase env vars in Vercel, then click "Connect Account" to link real accounts.'
                  }
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════ TRANSACTIONS TAB ═══════════════ */}
        {activeTab === 'transactions' && (
          <>
            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500"
                />
              </div>
              <select
                value={selectedAccount || ''}
                onChange={(e) => setSelectedAccount(e.target.value || null)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
              >
                <option value="">All Accounts</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {/* Transaction List */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                <span className="text-sm text-gray-400">{filteredTransactions.length} transactions</span>
                <span className="text-xs text-gray-500">
                  {selectedAccount ? accounts.find(a => a.id === selectedAccount)?.name : 'All Accounts'}
                </span>
              </div>
              <div className="divide-y divide-gray-800/50">
                {filteredTransactions.map(txn => {
                  const account = accounts.find(a => a.id === txn.account);
                  return (
                    <div key={txn.id} className="flex items-center justify-between p-3 hover:bg-gray-800 transition">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: `${CATEGORY_COLORS[txn.category]}15`, color: CATEGORY_COLORS[txn.category] }}
                        >
                          {txn.category[0]}
                        </div>
                        <div>
                          <div className="text-sm text-white">{txn.description}</div>
                          <div className="text-xs text-gray-500">
                            {txn.date} · {account?.icon} {account?.name} ·
                            <span style={{ color: CATEGORY_COLORS[txn.category] }}> {txn.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${
                        txn.amount >= 0 ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {txn.amount >= 0 ? '+' : ''}{formatFull(txn.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════ BUDGETS TAB ═══════════════ */}
        {activeTab === 'budgets' && (
          <>
            {/* Budget Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                <div className="text-xs text-gray-500">Total Budget</div>
                <div className="text-lg font-bold text-white">{formatFull(BUDGETS.reduce((s, b) => s + b.monthly, 0))}</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                <div className="text-xs text-gray-500">Spent So Far</div>
                <div className="text-lg font-bold text-red-400">{formatFull(marchExpenses)}</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                <div className="text-xs text-gray-500">Remaining</div>
                <div className={`text-lg font-bold ${
                  BUDGETS.reduce((s, b) => s + b.monthly, 0) - marchExpenses >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {formatFull(BUDGETS.reduce((s, b) => s + b.monthly, 0) - marchExpenses)}
                </div>
              </div>
            </div>

            {/* Month Progress Indicator */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400">March Progress</span>
                <span className="text-gray-400">{monthProgress}% through month</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${monthProgress}%` }}
                />
              </div>
            </div>

            {/* Category Budgets */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-gray-300">Category Budgets</h3>
              </div>
              <div className="divide-y divide-gray-800/50">
                {budgetProgress.map(budget => {
                  const isExpanded = expandedBudget === budget.category;
                  const catTxns = budgetTransactions[budget.category] || [];
                  return (
                    <div key={budget.category}>
                      <div
                        className="p-4 cursor-pointer hover:bg-gray-800/50 transition"
                        onClick={() => setExpandedBudget(isExpanded ? null : budget.category)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span>{budget.icon}</span>
                            <span className="text-sm text-white">{budget.category}</span>
                            <span className="text-xs text-gray-600">
                              {catTxns.length} txn{catTxns.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <span className="text-sm text-white">{formatFull(budget.spent)}</span>
                              <span className="text-gray-500 text-sm"> / {formatFull(budget.monthly)}</span>
                            </div>
                            <span className={`text-gray-500 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              budget.pct > 100 ? 'bg-red-500' : budget.pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(budget.pct, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className={`text-xs ${
                            budget.pct > 100 ? 'text-red-400' : budget.pct > 80 ? 'text-amber-400' : 'text-gray-500'
                          }`}>
                            {budget.pct}% used
                          </span>
                          <span className="text-xs text-gray-500">
                            {budget.pct <= 100
                              ? `${formatFull(budget.monthly - budget.spent)} remaining`
                              : `${formatFull(budget.spent - budget.monthly)} over budget`
                            }
                          </span>
                        </div>
                      </div>

                      {/* Expanded transaction list */}
                      {isExpanded && catTxns.length > 0 && (
                        <div className="bg-gray-950/50 border-t border-gray-800/50 px-4 pb-3">
                          <div className="max-h-64 overflow-y-auto divide-y divide-gray-800/30">
                            {catTxns.map((t, i) => (
                              <div key={t.id || i} className="flex items-center justify-between py-2 text-xs">
                                <div className="flex-1 min-w-0">
                                  <div className="text-gray-300 truncate">{t.description}</div>
                                  <div className="text-gray-600">{t.date}</div>
                                </div>
                                <div className="text-red-400 font-medium ml-3 whitespace-nowrap">
                                  {formatFull(Math.abs(t.amount))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-800/50 flex justify-between text-xs">
                            <span className="text-gray-500">{catTxns.length} transaction{catTxns.length !== 1 ? 's' : ''}</span>
                            <span className="text-white font-medium">{formatFull(catTxns.reduce((s, t) => s + Math.abs(t.amount), 0))}</span>
                          </div>
                        </div>
                      )}
                      {isExpanded && catTxns.length === 0 && (
                        <div className="bg-gray-950/50 border-t border-gray-800/50 px-4 py-3">
                          <div className="text-xs text-gray-600 text-center">No transactions this month</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Budget vs Actual Chart */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Budget vs Actual</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={budgetProgress} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                  <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(1)}K`} />
                  <YAxis type="category" dataKey="category" stroke="#9CA3AF" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs">
                          <div className="text-white font-bold">{d?.category}</div>
                          <div className="text-gray-300">Budget: {formatFull(d?.monthly)}</div>
                          <div className="text-red-400">Spent: {formatFull(d?.spent)}</div>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="monthly" fill="#374151" name="Budget" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="spent" name="Spent" radius={[0, 4, 4, 0]}>
                    {budgetProgress.map((entry, i) => (
                      <Cell key={i} fill={entry.pct > 100 ? '#EF4444' : entry.pct > 80 ? '#F59E0B' : '#10B981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ═══════════════ TRENDS TAB ═══════════════ */}
        {activeTab === 'trends' && (
          <>
            {/* Savings Rate Trend */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Savings Rate (6-Month Trend)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={MONTHLY_TRENDS.map(m => ({ ...m, savingsRate: Math.round((m.savings / m.income) * 100) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs">
                          <div className="text-white font-bold">{label}</div>
                          <div className="text-emerald-400">Savings Rate: {payload[0].value}%</div>
                        </div>
                      );
                    }}
                  />
                  <Line type="monotone" dataKey="savingsRate" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} name="Savings Rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Income vs Spending Trend */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Income vs Spending</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={MONTHLY_TRENDS}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs">
                          <div className="text-white font-bold mb-1">{label}</div>
                          {payload.map((p, i) => (
                            <div key={i} style={{ color: p.color }}>{p.name}: {formatFull(p.value)}</div>
                          ))}
                          <div className="text-blue-400 mt-1">
                            Saved: {formatFull(payload[0]?.value - payload[1]?.value)}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10B981" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
                  <Area type="monotone" dataKey="spending" stroke="#EF4444" fill="url(#spendGrad)" strokeWidth={2} name="Spending" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Net Worth Over Time */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Net Worth Trend (Real Accounts)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={NET_WORTH_HISTORY}>
                  <defs>
                    <linearGradient id="assetsG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs">
                          <div className="text-white font-bold mb-1">{label}</div>
                          <div className="text-emerald-400">Assets: {formatFull(d?.assets)}</div>
                          <div className="text-red-400">Liabilities: -{formatFull(d?.liabilities)}</div>
                          <div className="text-white font-bold border-t border-gray-600 pt-1 mt-1">
                            Net Worth: {formatFull(d?.netWorth)}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area type="monotone" dataKey="assets" stroke="#10B981" fill="url(#assetsG)" strokeWidth={2} name="Assets" />
                  <Line type="monotone" dataKey="liabilities" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" name="Liabilities" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 text-xs mt-1">
                <span className="text-emerald-400">━ Assets</span>
                <span className="text-red-400">╌ Liabilities</span>
              </div>
            </div>

            {/* Monthly Spending Breakdown */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Top Spending Categories (March)</h3>
              <div className="space-y-3">
                {spendingByCategory.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="w-6 text-right text-xs text-gray-500">{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white">{cat.name}</span>
                        <span className="text-sm font-medium" style={{ color: cat.color }}>{formatFull(cat.value)}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${(cat.value / spendingByCategory[0].value) * 100}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
