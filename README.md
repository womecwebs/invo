# INVO

INVO is a production-ready static SaaS-style business toolkit built with HTML5, CSS3 and vanilla JavaScript.

## Pages

- Home
- Invoice Generator
- Quote Generator
- Receipt Generator
- Business Calculators
- Invoice Templates
- Business Guides
- Blog
- About
- Contact
- FAQ
- Privacy Policy
- Terms of Service
- 404

## Architecture

- `assets/css/style.css` contains design tokens, layout, components, document previews, dark mode styles, responsive behavior and print rules.
- `assets/css/utilities.css` contains small utility classes.
- `JS/app.js` renders global navigation and footer, manages sticky header, mobile navigation, counters, accordions, reveal states, forms, copy feedback and back-to-top behavior.
- `JS/theme.js` persists light and dark mode.
- `JS/invoice.js` powers invoice, quote and receipt builders through a reusable document engine.
- `JS/calculator.js`, `JS/templates.js`, `JS/blog.js` provide page-specific interactions.

## Future SaaS Extension Points

The frontend is ready for accounts, authentication, cloud drafts, AI document generation, recurring invoices, online payments, tax APIs, premium templates, customer management, analytics, affiliate content and AdSense without a major redesign.

## Run Locally

Open `Pages/index.html` in a browser, or serve the folder with any static server.
