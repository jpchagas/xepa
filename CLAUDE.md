# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Xepa is a mobile-first PWA for collaborative grocery shopping lists with historical price data (sourced from CEASA/RS spreadsheets). Stack: React 19 + Vite 7, Material UI 7, React Router 7, Framer Motion, Firebase Auth + Firestore, deployed to Firebase Hosting. Plain JavaScript (JSX), no TypeScript. UI copy is in Portuguese (pt-BR).

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # production build to dist/
npm run lint       # ESLint (flat config, eslint.config.js)
npm run preview    # serve the production build
npm test           # node:test for src/**/*.test.js (recipe/swap data + helpers)
npm run nutrition  # re-download src/data/nutrition.js from TabNut (after editing swapGroups.js)
firebase deploy --only hosting   # deploys dist/ (SPA rewrite to index.html)

cd functions && npm test         # node:test suite for the CEASA import (runs before every functions deploy)
firebase deploy --only functions # needs the Blaze plan
```

Both the web app (`npm test`) and `functions/` have node:test suites. Web files imported by tests must use explicit `.js` extensions on their own imports (Node ESM), e.g. `recipeHelpers.js`.

## Architecture

Strict split: **components render UI, hooks own state and Firestore logic**.

- `src/main.jsx` — StrictMode → MUI ThemeProvider → CssBaseline → BrowserRouter → App.
- `src/theme.js` — design tokens (`brand`, `brandGradient`) and MUI overrides. Brand yellow `#FFD400` is a fill color only; non-filled primary buttons/labels use ink (`#16161A`) because yellow text is unreadable on white. Note: in `sx`, a numeric `borderRadius` is multiplied by `shape.borderRadius` (14), so use px strings (`'18px'`).
- `src/App.jsx` — composition only: `useAuth()` + `useSplashScreen()` gate a presentational `SplashScreen`, then render `IOSInstallBanner` (outside the animation tree) and `AppRoutes`.
- `src/routes/` — `AppRoutes` wraps `Routes` in `AnimatePresence mode="wait"` keyed by pathname (routes only — don't put other children inside it). Use `PublicRoute`/`PrivateRoute` guards rather than inline `user ? … : <Navigate>`.
- `src/features/<feature>/` — feature UI. In `auth/`, `Login`/`Register`/`ForgotPassword` are page composition only; `*Form` components are pure form UI; `AuthLayout`/`AuthCard` are shared shells; logic lives in `useLogin`/`useRegister`/`useForgotPassword`.
- `src/pages/MainScreen.jsx` — the main authenticated screen (receives `user` from `AppRoutes`); wires the hooks together and passes data/handlers to `features/shopping` and `features/settings`. The active tab lives in the URL (`/main?tab=settings`) so Back from Privacy/Contact returns to Settings. Destructive list actions go through one `ConfirmDialog`; item removals use an undo snackbar (`useAlert` + `AppSnackbar`).
- `src/components/` — shared UI: `feedback/` (splash, snackbar, confirm dialog, iOS install banner, ads), `navigation/`, `layout/` (`PageSlide`, `StaticPage`), `inputs/PasswordField`, `display/UserAvatar`.
- `src/hooks/` — all Firestore reads/writes and realtime `onSnapshot` listeners. `useShoppingItems` does **not** await writes: Firestore applies them to the local cache instantly and syncs later (works offline in the store); failures go to its `onError` option. Its state is keyed by list id so a previous list's items never flash after switching.
- `src/services/firebase.js` — the single Firebase init; exports `auth`, `db` (Firestore with `persistentLocalCache`). Import from `services/firebase`, never a local `./firebase`.
- `src/utils/shoppingHelpers.js` — pure price/format helpers. They take a product (or a `productsById` Map), not the products array. Use `parseDecimal` for user-typed numbers (pt-BR keyboards type `0,5`). `authErrors.js` maps Firebase error codes to pt-BR messages; `userHelpers.js` avatar initial/color; `deviceUtils.js` iOS/Safari/standalone detection.

### Firestore data model

- `users` — user docs (created on register; looked up by email when sharing).
- `products` — catalog: `name`, `unit` (CEASA codes: KG, UND, DZ, MOL, BDJ, CX…; `getDisplayUnit` maps them to labels), `category`, and the live price summary `latestPrice` {average, min, max, fileDate} / `previousPrice` {average, fileDate}. Users can create products manually.
- `prices/{productId}/history/{fileDate}` — one doc per quote day (`average`/`min`/`max`, `source: 'ceasa' | 'manual'`).
- `ceasaImports/{fileDate}` — server-only marker that a CEASA quote was imported (idempotency).
- `users/{uid}/notifications/{id}` — written only by Cloud Functions; the app reads them and sets `read`. Ids: `items-{listId}-{actorUid}` (grouped while unread, 30 min window) and `prices-{listId}-{fileDate}`.
- `users/{uid}/fcmTokens/{token}` — one doc per device with push enabled; written by the app, dead tokens deleted by the functions.
- `users/{uid}.notifications` — `{ itemsAdded, priceIncreases }` preferences (missing = on).
- `meta/ceasa` — import status (`lastRunAt`, `lastStatus`, `lastError`, `latestFileDate`), shown in Settings; clients need read access.
- `sharedLists` — `name`, `ownerId`, `members` (array of uids; queried with `array-contains`). A default "Minha Lista" is auto-created only after the **server** confirms the user has none (an empty cache snapshot is ignored). Only the owner sees "Excluir lista" (deleting also batch-deletes its items); other members get "Sair da lista". The selected list id is remembered in `localStorage`.
- `sharedLists/{listId}/items` — `productId`, `price`, `previousPrice`, `amount`, `fileDate`, `isCustom`, `checked`, `recipes` (names of recipes the item was added for, shown as "Para: …"), `addedBy` (uid; drives "item added" notifications), `restored` (set by undo so it doesn't notify again), `swappedFrom` ({ productId, name } after a cheaper swap), `swapDismissed` (product ids the user chose not to swap to). **Lists show the product's live `latestPrice`** via `getItemPricing(item, product)`; the item's own price fields are a snapshot taken when it was added and only used as a fallback. Adding a product already on the list increments `amount`. A manually entered price (products CEASA doesn't quote) updates the product's `latestPrice` too, so every user sees it.

### CEASA price import (`functions/`)

Prices come from CEASA/RS's public Google Drive folder (year → `MM/AAAA Mês` → one `Cotacao DD/MM/AAAA.pdf` per business day). A scheduled Cloud Function (`syncCeasaPricesDaily`, `southamerica-east1`, 9h/12h/16h Mon–Sat São Paulo time) and the admin-only callable `refreshCeasaPrices` ("Atualizar preços agora" in Settings) both run `syncCeasaPrices`:

- `ceasa/drive.js` lists folders via Drive's public embedded-folder page and downloads via the public link — no API key, but unofficial; it throws on an empty root listing or a non-PDF download rather than silently importing nothing. Swapping to the Drive API only touches this file.
- `ceasa/parseQuote.js` reads the PDF with `pdfjs-dist`: each table cell is one text item, so rows are rebuilt by y-coordinate; a price row has exactly 5 cells (`Produto, UND, MAX, MAIS FREQUENTE, MÍNIMO`) and a single uppercase cell is a category. Rows with R$ 0.00 (no trade that day) are skipped so a product keeps its last real price (the list then shows "cotação de dd/mm").
- `ceasa/syncPrices.js` — first run backfills 90 days, later runs look back 10 days and skip dates already in `ceasaImports`. History is written per file; product summaries (`mergeQuote`, order-independent) and import markers are written last, so an interrupted run is simply redone. Product ids come from `normalizeProductId` — keep it byte-for-byte stable or new imports will create duplicate products.
- The admin is a hardcoded email in both `functions/src/index.js` (enforced) and `MainScreen` (UI only).

### Notifications

Created server-side in `functions/src/notifications/` (texts in `messages.js` are pure and tested):
- `notifyListItemAdded` (Firestore trigger on new items): notifies the **other** members of a shared list; a transaction groups bursts (a recipe adds many items) into one notification per list + person.
- After a CEASA import, `notifyPriceIncreases` notifies members of lists with **unchecked** items whose price rose ≥ 5% (`PRICE_INCREASE_THRESHOLD`) in the newest quote; skipped for quotes older than 3 days (backfills).
- `deliver.js` stores the doc and sends a data-only FCM web push with a `tag` (same tag replaces the device notification instead of stacking).

Client: `useNotifications` (feed, unread badge, toast for news while open), `usePushNotifications` (permission + FCM token; needs `FCM_VAPID_KEY` in `services/firebase.js`, otherwise the Settings switch is hidden), `useNotificationPrefs`. `public/push-sw.js` is imported into the Workbox service worker (`vite.config.js` → `workbox.importScripts`): it skips the system notification when the app is in front (except iOS, which requires one per push) and routes taps via `postMessage` → `useServiceWorkerMessages`. Links are `/main?list={id}`; `MainScreen` selects the list and clears the param. iOS web push only works for the app installed on the home screen.

### Cheaper swaps

`utils/swapHelpers.findSwap` suggests, per unchecked item, a cheaper product with similar nutrition. Candidates come only from the curated groups in `src/data/swapGroups.js` (products that work alike in the kitchen; each has a TabNut id and a cooking note). Nutrition (`src/data/nutrition.js`, generated from TabNut/USDA SR25 by `scripts/build-nutrition.mjs` and committed — never fetched at runtime) is similar when every main nutrient per 100 g (kcal, protein, carbs, fat, fiber, with small-value floors) differs by ≤ 35%. The alternative must also share the CEASA unit, be ≥ 10% cheaper with fresh prices, and not already be on the list or dismissed. Items added for a recipe show a "Muda a receita" warning with the alternative's cooking note. Beef isn't covered: TabNut has no Brazilian cuts. `npm test` checks every group product exists in the CEASA quote (including R$ 0,00 rows, via `parseQuotePdf().skippedRows`), has nutrition data, and that each group has a single unit.

### Recipes

Curated, versioned in the repo: `src/data/recipes.js` (format documented at the top of the file); the app has a **Receitas** tab (`?tab=recipes`). Each ingredient maps to the list either as an exact CEASA product name (`list.ceasa`, live price, amount in the product's unit — kg, or units for DZ/UND/MOL/BDJ products) or as an off-CEASA product by name. `utils/recipeHelpers.js` scales servings and amounts (kg rounds to 50 g; only lata/caixinha/pacote quantities scale for off-CEASA products), estimates cost, and never name-matches an off-CEASA ingredient to a CEASA product (CEASA's "Mostarda" is mustard greens). Pantry (`pantry: true`) and "opcional" ingredients start unchecked. `useShoppingItems.addRecipeItems` writes everything in one batch, summing into existing items. `npm test` checks every `ceasa` name against the real quote in `functions/test/fixtures/` — add a recipe, run the tests.

`utils/productIds.js` is the client copy of the CEASA product-id rule; a test keeps it identical to `functions/src/ceasa/syncPrices.js`.

## Conventions

- Group imports under comment headers, in this order: `// React`, `// Third-party`, `// Firebase`, `// Components`, `// Hooks`, `// Services`, `// Utils`.
- Keep components readable; avoid unnecessary abstraction.
- Input fields keep local UI state separate from persisted data ("input is not data"): e.g. quantity is edited freely and saved on `onBlur`, validated only when persisted.
