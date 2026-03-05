# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment
``` bash
npm run build
```

``` bash
npm run preview 
```

``` bash
firebase deploy --only hosting
```

## Current Context

Project Summary – Xepa Shopping App
1. Core Features Implemented

Firebase Integration

Authentication with auth.currentUser.

Firestore collections for users, shoppingList, products, and prices.

Profile initialization in users collection for new users.

Shopping List

Users can add products from a dropdown list populated from the products collection.

Remove products individually from the list.

Each item stores:

productId

price (average from last uploaded spreadsheet)

previousPrice

fileDate of the uploaded spreadsheet

createdAt timestamp

Total estimated price calculated and displayed at the bottom of the list.

Product Info

Products have a name, unit (UND), and price history.

Unit is displayed next to average price in the shopping list:
Preço médio: R$ XX,XX (kg) or (unit).

Price Upload (Admin Only)

Admin can upload CSV/XLSX spreadsheets for product prices.

Spreadsheet must include columns: Produto, UND, MAX, MAIS FREQUENTE, MÍNIMO.

Updates or creates products and their price history in Firestore.

Validates numeric ranges (MIN ≤ AVG ≤ MAX).

Settings

Users can change password.

Users can logout.

Admins see the file upload option.

2. UI / Material-UI

Main layout with AppBar, Container, and BottomNavigation:

Lista – shows shopping list with total.

Configurações – shows settings and upload (admin only).

Modal for adding new items.

FAB button for opening the modal to add items.

Paper / ListItem cards show individual items, with background color based on price comparison:

Red if price increased.

Green if price decreased.

White if unchanged or no previous price.

3. Animations

Previously used CSSTransition / TransitionGroup for item animations.

Removed for now due to React 18+ incompatibility (findDOMNode error on updates).

4. File Parsing & Data Handling

XLSX spreadsheets are parsed into JSON.

Data is validated for numeric fields and column names.

Firestore batch writes are used to commit updates efficiently.

Handles invalid filenames, empty sheets, or missing columns with alerts.

5. Calculations

Total price of items in the shopping list calculated in real-time.

Format currency in BRL using Intl.NumberFormat.

Average price is displayed with its corresponding unit from the product collection.

6. Remaining / Next Steps

Optional improvements to consider tomorrow:

Add unit-specific totals (e.g., total kg, total L) in the shopping list.

Implement sorting or filtering in the shopping list.

Add bulk delete or edit quantities for items.

Reintroduce animations safely (React 18 compatible) if desired.

UI/UX polishing: show price changes with arrows, better alerts, or modals.

Optionally handle multiple files and show last update date.

You’ve basically got a fully functional shopping list app with Firebase backend, admin price uploads, and total price calculations.


CEASARS(Centrais de Abastecimento do Rio Grande do Sul) DB:

URL: https://drive.google.com/drive/folders/1H7amJHE6-sysxqZYLjEq9bArQ0K_EvxY

Format: Google Sheets

Produto
Unidade(KG, DZ, UND,MOL,BDJ, CX, CXT)
Max(Max price)
Mais Frequente(Average price)
Mínimo(Min price)


## Features

🔐 Add user state selection

📊 Add % price variation indicator

🧠 Start substitution engine

• Admin dashboard
• Auto-refresh price change notifications