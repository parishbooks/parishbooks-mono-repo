# @parishbooks/site-ui

Shared UI for parish-facing Next.js apps (`parishbooks-web-ui`, `parishbooks-client-ui`).

- **Components:** `Container`, `SiteBrand`, `LinkButton`, `MarketingCard`, `MarketingBadge` (built on `@parishbooks/design-system`)
- **Styles:** `styles/marketing-bridge.css` maps legacy marketing `var(--color-*)` tokens to design-system CSS variables; `styles/site-shell.css` adds smooth scrolling.

Import design-system globals in the app root layout first, then the site-ui styles.
