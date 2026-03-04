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

XEPA – Current Application State (V1 Simplified Architecture)
✅ Core Concept

A simple grocery list app that:

Allows users to create a shopping list

Shows average product price

Highlights price changes (increase/decrease)

Allows admin to upload price spreadsheets

Auto-creates products from uploaded files

No regional/state complexity anymore.

🧱 Current Firestore Structure
1️⃣ users
users/{userId}
  email
  createdAt

Each authenticated user has a document.

2️⃣ users/{userId}/shoppingList
shoppingList/{itemId}
  productId
  price              // current average at time of adding
  previousPrice      // previous average snapshot
  createdAt

Important:

Price is SNAPSHOT at time of adding

Does NOT auto-update when price table updates (intentional V1 simplicity)

3️⃣ products
products/{productId}
  name
  unit
  createdAt

Auto-created during spreadsheet upload

productId is normalized from product name:

lowercase

accents removed

spaces → underscore

special chars removed

Example:

Arroz Tipo 1 (5kg)
→ arroz_tipo_1_5kg
4️⃣ prices
prices/{productId}
  max
  min
  average
  previousAverage
  updatedAt

Single global price per product.

No states.
No regions.
No nesting.

📊 Spreadsheet Upload Logic
Required Columns
Produto
UND
MAX
MAIS FREQUENTE
MÍNIMO

Validation includes:

Required columns must exist

Numeric validation for max/min/average

Ensures:
min ≤ average ≤ max

Upload Behavior

For each row:

Normalize productId

If product doesn't exist → create it

Fetch existing price

Move current average → previousAverage

Write new price

Batch commit

Result:

Atomic update

Safe overwrite

Price history (1-step memory)

🎨 UI Behavior
🧾 List Screen

Displays user shopping list

Shows:

Product name

“Preço médio: R$ X”

Background color logic:

🔴 Light red → price increased

🟢 Light green → price decreased

⚪ White → unchanged or no previous

⚙️ Settings Screen

Contains:

Change password

Logout

Admin-only:

Price spreadsheet upload button

Admin defined as:

auth.currentUser?.email === 'jpchagas@gmail.com'
🔐 Security Rules (Current State)

Users can only access their own user document

Users can only access their own shoppingList

Authenticated users can read/write:

products

prices

Working correctly.

🧠 Architectural Philosophy (Now)

We intentionally removed:

❌ State selection
❌ Regional prices
❌ Category parsing
❌ Complex ingestion logic
❌ Multi-layer price nesting

Current system is:

Simple
Deterministic
Easy to reason about
Easy to scale later

This is a strong V1 foundation.

⚠️ Known Limitations (Intentional)

Shopping list prices don’t auto-update after upload

Only 1-step price history (previousAverage)

No price trend %

No multi-list support yet

No admin role system (email hardcoded)

All acceptable for V1.

📈 What Is Solid Right Now

Firestore configuration

Security rules

Upload pipeline

Product auto-creation

Clean data normalization

Stable UI

Real-time list updates

Batch price writes

You now have:

A functioning grocery price intelligence MVP.

That’s real progress.

🚀 Tomorrow – Possible Next Steps

We can work on:

🔥 % price variation indicator

📅 “Last updated” badge

📊 Price trend arrows

🧠 Automatic list price refresh

🏗 Multi-list architecture (users_lists + lists)

🔐 Proper admin role system

📈 Historical price tracking (priceHistory collection)

💰 Total cart estimation at bottom

🎨 UX polish & formatting

🚀 Prepare for production deploy

🏁 Final Status

You now have:

✔ Working Firestore
✔ Working security rules
✔ Clean simplified schema
✔ Stable ingestion pipeline
✔ Auto product creation
✔ Visual price comparison
✔ Admin upload working

This is a very healthy V1 state.


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