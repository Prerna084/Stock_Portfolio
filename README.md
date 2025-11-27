# Stock Dashboard (SnapInvest)

This project is a React + Vite dashboard for tracking a stock portfolio.

## Firebase Authentication

To enable Firebase authentication, create a `.env` or `.env.local` file at the project root with the following keys (or copy `.env.example`):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then enable Email/Password and Google sign-in providers in the Firebase Console (Authentication → Sign-in method).

Quick setup checklist:

- Create `.env.local` next to `package.json` (do NOT commit this file).
- Copy values from your Firebase project settings → SDK setup and configuration.
- In Firebase Console → Authentication → Sign-in method, enable:
	- Email/Password
	- Google (if you want Google sign-in)
- Restart the dev server after creating `.env.local`.

Example `.env.local` (replace placeholders):

```env
VITE_FIREBASE_API_KEY=AIza...REPLACE_ME
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdefg
```

## Real-time provider API keys

If you want the Analytics page to call real market-data providers from the browser (not recommended for production because it exposes keys and can hit CORS/rate limits), add the following environment variables to `.env.local`:

```env
VITE_ALPHAVANTAGE_KEY=your_alpha_vantage_api_key
VITE_FINNHUB_KEY=your_finnhub_api_key
```

Notes:
- Alpha Vantage: free tier exists but has strict rate limits. The adapter uses the `GLOBAL_QUOTE` endpoint and maps `price` and `change` from the response.
- Finnhub: provides a quote endpoint; the adapter maps `c` (current price) and `dp` (percent change).
- It's better to proxy requests through a small server to keep API keys secret, aggregate providers, and avoid CORS. See the top-level Analytics docs for details.
 - It's better to proxy requests through a small server to keep API keys secret, aggregate providers, and avoid CORS. See the top-level Analytics docs for details.

Server proxy (optional)

I added a minimal Express proxy at `server/index.js` with two endpoints:

- `/api/alpha/quote?symbol=SYM` — forwards requests to Alpha Vantage `GLOBAL_QUOTE`.
- `/api/finnhub/quote?symbol=SYM` — forwards requests to Finnhub `quote`.

To run the proxy locally:

```bash
cd server
npm install
cp ../.env.server.example .env
# edit .env and add your keys
npm start
```

Then point your client/provider adapters to `http://localhost:4000/api/...` instead of calling the provider directly. I can update the client adapters to use the proxy automatically (switch behavior when `import.meta.env.VITE_USE_PROXY === 'true'`) — tell me if you want that.
If you'd like to enable the proxy for local dev, set the following in your client `.env.local`:

```env
VITE_USE_PROXY=true
# optional: if your proxy runs on a different host/port
VITE_PROXY_URL=http://localhost:4000
```

With `VITE_USE_PROXY=true` the Analytics page will prefer the proxy endpoints instead of calling external providers directly. This is safer for API keys and avoids CORS issues.

### Dashboard gainers/losers feed

The Dashboard calls `/api/gainers` and `/api/losers`, which the proxy now serves by forwarding to the Financial Modeling Prep stock-market endpoints. Set one of the following environment variables in `server/.env`:

```
FMP_KEY=your_fmp_api_key
# or
FMP_API_KEY=your_fmp_api_key
```

If the key is missing or FMP rejects the request (401/403 legacy plan), the proxy automatically returns high-quality mock movers instead so the Dashboard never shows an empty state. Once you add a valid key, real data will flow again. Prices coming from either source are converted to INR on the server by reusing the cached USD→INR rate.


## Run locally

```bash
cd /Volumes/Devlopment/Minorproj/Stock_Portfolio
npm install
npm run dev
```

Open http://localhost:5173/login to sign in.

## Analytics Page

This project includes a simple Analytics UI that compares quoted metrics from multiple sources for a list of symbols. By default the project ships with mock adapters (Google/Yahoo/Bloomberg) located at `src/services/dataProviders/*`.

How to use:

- Open `http://localhost:5173/analytics` (you must be signed in).
- Add symbols (e.g. `AAPL`, `MSFT`) and click `Refresh`.

Pluggable providers:

- Each provider adapter should export a `name` string and an async function `fetchForSymbol(symbol)` that returns an object with `price`, `change`, and `timestamp` (or throws on error).
- Real provider notes: most major financial sites don't offer free, CORS-friendly public APIs. For production you should implement a server-side proxy or use a paid market-data API (IEX, AlphaVantage, Finnhub, Polygon, etc.) and adapt their responses inside `src/services/dataProviders`.

Security & CORS:

- Do not embed private API keys in client-side code. Use a server component to call providers that require credentials.
- The mock adapters are a starting point — they make the UI usable during development without external dependencies.

