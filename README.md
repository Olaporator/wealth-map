# Ayoola & Jamie's Wealth Map

Interactive financial planning dashboard for generational wealth building.

## Features

- **Age-based projections** from 31 to 85
- **Asset breakdown**: C-Corp, 401k, Seattle rental, Land, Jamie's investments, Ventures
- **Multiple chart views**: Net Worth, Assets Over Time, Free Cash Flow
- **Hover breakdowns** with monthly amortization
- **Adjustable assumptions** for returns, appreciation rates, margin trading

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Deploy to Vercel

### Option 1: Import from GitHub

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite - click Deploy

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

## Project Structure

```
wealth-map/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        # Main dashboard component
│   ├── main.jsx       # React entry point
│   └── index.css      # Tailwind styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

Built for generational wealth • Homestead Hub • Community Impact
