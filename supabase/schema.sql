-- ═══════════════════════════════════════════════════════════════════════
-- Wealth Map — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════════

-- Plaid Items: one row per institution link (e.g., Chase, Novo, TIAA)
CREATE TABLE IF NOT EXISTS plaid_items (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       TEXT NOT NULL DEFAULT 'ayoola',  -- single-user for now
  institution_id TEXT,
  institution_name TEXT,
  access_token  TEXT NOT NULL,                    -- encrypted Plaid access token
  item_id       TEXT NOT NULL UNIQUE,             -- Plaid item_id
  cursor        TEXT,                             -- transaction sync cursor
  status        TEXT DEFAULT 'active',            -- active | error | removed
  error_code    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Accounts: individual accounts within each Plaid item
CREATE TABLE IF NOT EXISTS accounts (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plaid_item_id   UUID REFERENCES plaid_items(id) ON DELETE CASCADE,
  account_id      TEXT NOT NULL UNIQUE,           -- Plaid account_id
  name            TEXT NOT NULL,
  official_name   TEXT,
  type            TEXT NOT NULL,                  -- depository, investment, credit, loan
  subtype         TEXT,                           -- checking, savings, 401k, credit card, mortgage, student
  mask            TEXT,                           -- last 4 digits
  current_balance NUMERIC(14,2),
  available_balance NUMERIC(14,2),
  credit_limit    NUMERIC(14,2),
  iso_currency    TEXT DEFAULT 'USD',
  owner           TEXT,                           -- Ayoola, Jamie, Joint, NimbusTech, Olaporations
  nickname        TEXT,                           -- custom display name
  institution     TEXT,                           -- Chase, Novo, TIAA, etc.
  icon            TEXT,                           -- emoji icon
  color           TEXT,                           -- hex color for UI
  hidden          BOOLEAN DEFAULT FALSE,          -- user can hide accounts
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions: individual transactions synced from Plaid
CREATE TABLE IF NOT EXISTS transactions (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id        TEXT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
  transaction_id    TEXT NOT NULL UNIQUE,          -- Plaid transaction_id
  amount            NUMERIC(14,2) NOT NULL,        -- positive = debit, negative = credit (Plaid convention)
  date              DATE NOT NULL,
  name              TEXT NOT NULL,                 -- merchant name
  merchant_name     TEXT,
  category          TEXT[],                        -- Plaid category array
  primary_category  TEXT,                          -- our simplified category
  pending           BOOLEAN DEFAULT FALSE,
  payment_channel   TEXT,                          -- online, in store, other
  iso_currency      TEXT DEFAULT 'USD',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Budgets: monthly budget per category
CREATE TABLE IF NOT EXISTS budgets (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       TEXT NOT NULL DEFAULT 'ayoola',
  category      TEXT NOT NULL,
  monthly_limit NUMERIC(14,2) NOT NULL,
  icon          TEXT,
  color         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category)
);

-- ─── Indexes ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(primary_category);
CREATE INDEX IF NOT EXISTS idx_accounts_plaid_item ON accounts(plaid_item_id);

-- ─── Row Level Security ─────────────────────────────────────────────────
-- For now, RLS is disabled since this is a single-user app.
-- When you add auth, enable RLS and add policies:
-- ALTER TABLE plaid_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- ─── Seed default budgets ───────────────────────────────────────────────
INSERT INTO budgets (category, monthly_limit, icon, color) VALUES
  ('Housing',        7800, '🏠', '#3B82F6'),
  ('Food & Dining',  1200, '🍽️', '#F59E0B'),
  ('Transportation',  400, '🚗', '#8B5CF6'),
  ('Utilities',       500, '⚡', '#06B6D4'),
  ('Healthcare',      500, '🏥', '#EC4899'),
  ('Shopping',        400, '🛍️', '#10B981'),
  ('Entertainment',   100, '🎬', '#F97316'),
  ('Business',        500, '💼', '#84CC16')
ON CONFLICT (user_id, category) DO NOTHING;
