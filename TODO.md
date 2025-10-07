# Website Revamp to Groww-like UI

This TODO tracks the implementation of the approved plan.

## Plan Checklist

- [x] Theme and Design System
  - [x] Add Inter font in index.html
  - [x] Extend Tailwind theme (brand colors, fonts, container)
  - [x] Update global styles (light theme defaults, reusable components: card, buttons, chips, inputs, table)

- [x] App Architecture and Routing
  - [x] Wrap app in BrowserRouter (src/main.jsx)
  - [x] Refactor App.jsx to use Routes and AppLayout (TopNav + Sidebar + Outlet)

- [x] New/Updated Components
  - [x] Create src/components/layout/TopNav.jsx (logo, search, notifications, avatar)
  - [x] Create src/components/layout/Sidebar.jsx (navigation with active states)
  - [x] Create src/components/StatCard.jsx
  - [x] Create src/components/ChartCard.jsx
  - [ ] Optional: WatchlistRow.jsx (may render as table directly in Dashboard)

- [x] Pages Refactor
  - [x] Dashboard redesign: hero portfolio card, stat cards row, performance chart in ChartCard, clean watchlist table
  - [x] PortfolioPage style alignment (table stub + summary)
  - [x] Settings style alignment (preference cards + theme toggle stub)

- [ ] Polish and QA
  - [ ] Visual pass for spacing, shadows, and responsiveness
  - [ ] Verify navigation works for Dashboard, Portfolio, Settings

## Notes
- Primary color: brand-emerald/teal similar to Groww (using Tailwind emerald with slight extension).
- Default theme: Light (bg-gray-50, text-gray-900), white cards, subtle shadows.
- Keep mock data for now; may extract later to src/data if needed.

## Next
- Run the dev server and verify the UI: navigation, layout, responsiveness.
- Tweak micro-interactions and spacing if needed.
