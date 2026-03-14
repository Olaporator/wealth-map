# Wealth Map — Plaid Integration Setup

## Quick Start (3 steps)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your **Project URL** and **Service Role Key** from Settings → API
3. Open **SQL Editor** and paste the contents of `supabase/schema.sql` → Run

### 2. Get Plaid API Keys
1. Go to [dashboard.plaid.com](https://dashboard.plaid.com) → Sign up / Log in
2. Copy your **Client ID** and **Sandbox Secret** from Keys page
3. (Sandbox keys work immediately — no approval needed)

### 3. Set Vercel Environment Variables
In your Vercel project dashboard → Settings → Environment Variables, add:

| Variable | Value | Example |
|----------|-------|---------|
| `PLAID_CLIENT_ID` | From Plaid Dashboard | `abc123def456...` |
| `PLAID_SECRET` | Sandbox secret from Plaid | `xyz789...` |
| `PLAID_ENV` | `sandbox` (or `production` later) | `sandbox` |
| `SUPABASE_URL` | From Supabase Settings → API | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Service Role key from Supabase | `eyJhbGci...` |

Then **redeploy** from the Vercel dashboard (or push a new commit).

---

## How It Works

### Architecture
```
Browser (React)
  ↓ Plaid Link opens bank login
  ↓ Returns public_token
  ↓
Vercel Serverless (/api/plaid/*)
  ↓ Exchanges token with Plaid API
  ↓ Stores access_token in Supabase
  ↓ Syncs transactions via Plaid Sync API
  ↓
Supabase (Postgres)
  ↓ plaid_items → access tokens per institution
  ↓ accounts → balances per account
  ↓ transactions → categorized transaction history
  ↓ budgets → monthly budget limits
```

### API Routes
| Route | Method | Description |
|-------|--------|-------------|
| `/api/plaid/create-link-token` | POST | Creates Plaid Link token |
| `/api/plaid/exchange-token` | POST | Exchanges public token → access token |
| `/api/plaid/accounts` | GET | Fetches all accounts (+ refresh balances) |
| `/api/plaid/transactions` | GET | Fetches transactions with filters |
| `/api/plaid/sync` | POST | Syncs new transactions from Plaid |
| `/api/plaid/budgets` | GET/POST | Get/update budget categories |
| `/api/plaid/remove-item` | POST | Unlinks an institution |

### Sandbox Testing
In Plaid Sandbox mode, use these test credentials when Plaid Link opens:
- **Username:** `user_good`
- **Password:** `pass_good`

This will create a fake bank account with sample transactions.

---

## Switching to Production

1. Apply for Plaid Production access at [dashboard.plaid.com](https://dashboard.plaid.com)
2. Submit your compliance documents (already done ✓)
3. Once approved, update Vercel env vars:
   - Change `PLAID_SECRET` to your Production secret
   - Change `PLAID_ENV` to `production`
4. Redeploy

### Institution-Specific Notes
| Institution | Plaid Support | Notes |
|-------------|--------------|-------|
| Chase | ✅ Full | Checking + credit card |
| Novo | ✅ Full | Both NimbusTech + Olaporations accounts |
| Human Interest | ⚠️ Limited | May need to check if supported; could require manual entry |
| TIAA | ✅ Supported | 403b + 457 accounts |
| Robinhood | ✅ Full | Investment holdings + transactions |
| KeyBank | ✅ Full | Checking + mortgage |
| Capital One | ✅ Full | Credit card |
| Student Loans | ⚠️ Varies | Depends on servicer (Mohela, Aidvantage, etc.) |

---

## Local Development

```bash
# Create .env.local in project root (not committed to git)
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_sandbox_secret
PLAID_ENV=sandbox
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
```

To test API routes locally, install the Vercel CLI:
```bash
npm i -g vercel
vercel dev
```
This runs both Vite (frontend) and the serverless functions locally.
