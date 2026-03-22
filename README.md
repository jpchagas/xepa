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

🧾 Xepa App – Development Summary (Updated)

Date: March 20, 2026
Status: Collaborative shopping list with price intelligence + dynamic data system + inline editing + cross-platform UX optimization

🚀 Current Maturity

👉 MVP v1.3 (UX Stability + Platform Optimization Layer)

Evolution

v1.0 → functional + branded

v1.1 → branded + experience-driven

v1.2 → dynamic + user-extendable + reactive UI

v1.3 → UX-refined + platform-aware + input-stable

🔥 Major Updates Since Last Version
🆕 Input System Fix (Critical UX Upgrade)
Before:

Amount field (Qtd) forced fallback (|| 1)

Users could NOT delete value

Impossible to type 0.5, 2, etc.

Now:

👉 Fully controlled local input state

✨ Behavior:
Action	Result
Delete value	Field stays empty
Type new value	Works naturally
Leave field	Value saved correctly
🧠 Architecture Fix:

Separated UI state vs database state

Save happens on onBlur instead of every keystroke

👉 This is production-grade input handling

🆕 iOS Install Experience (Major Growth Unlock)
Before:

iPhone users had no install guidance

Lost installs (critical)

Now:

👉 Custom install banner for iOS users

✨ Behavior:

Detects iOS + Safari

Detects if app already installed

Shows non-intrusive install instruction

Can be dismissed (persisted in localStorage)

UX Copy:

📲 Install Xepa
Tap Share → “Add to Home Screen”

🧱 Platform Detection Layer (New System)

Created reusable utility layer:

utils/deviceUtils.js

Includes:

iOS detection

Safari detection

Standalone mode detection

👉 Enables:

install UX

future notification logic

platform-specific features

⚡ Animation System Fix (Stability Upgrade)
Before:

AnimatePresence misuse

Multiple children with mode="wait"

Console warnings

Potential broken transitions

Now:

👉 Clean separation:

AnimatePresence → handles routes only

Global UI (banner) → outside animation tree

Result:

No warnings

Stable transitions

Correct animation lifecycle

🧠 Input/Data Separation (Conceptual Upgrade)

You introduced a key principle:

👉 “Input is not data”

Now:

UI can be temporary, empty, flexible

Data is validated only when persisted

👉 This is a senior-level frontend pattern

🎨 UX Maturity Upgrade (Updated)
Area	Before	Now
Amount input	Rigid / broken	Fluid + natural
iOS experience	Missing	Guided install flow
Platform awareness	None	Structured detection layer
Animation stability	Fragile	Robust
Input handling	Coupled to DB	Decoupled
📊 Feature Status (Updated)
Feature	Status
Authentication	✅
Shopping list	✅
Realtime updates	✅
Price history	✅
Spreadsheet import	✅
Price comparison	✅
Collaborative lists	✅
Member management	✅
Snackbar notifications	✅
Product autocomplete	✅
Manual product creation	✅
Inline price editor	✅
Auto-open UX logic	✅
Realtime UI sync fix	✅
Amount input fix (NEW)	✅
iOS install experience (NEW)	✅
Platform detection layer (NEW)	✅
Animation system fix (NEW)	✅
Privacy policy	✅
Contact page	✅
AdSense integration	✅
Mobile transitions	✅
Design system	✅
Brand identity	✅
Motion system	✅
Splash experience	✅
⚠️ Known Limitations (Updated)
1️⃣ Permissions System

No owner-only controls yet

2️⃣ Import Performance

Still using getDoc in loop

3️⃣ Settings Panel

Needs modularization

4️⃣ Theme System

No dark mode

No dynamic switching

5️⃣ Data Duplication Strategy

Still needs reconciliation layer

🚀 Recommended Next Steps (Updated Priority)
🥇 System Notifications (NOW UNLOCKED)

👉 You are now ready

Why:

Input is reliable

Platform detection exists

UX timing can be controlled

🥈 Shopping List UI Upgrade (CRITICAL)

Still your biggest gap:

Add:

🟥 price drop badges

🟩 savings highlights

🟨 best deal indicators

🧾 item cards

🥉 Add Item UX Polish

auto-focus input

open keyboard (mobile)

smarter autocomplete

🏅 Product Import Optimization

batch reads

remove per-row queries

💰 Monetization Expansion

smarter ad placement

premium features

🌙 Dark Mode

👉 Easy win now

📈 Project Stage (Updated)
Stage	Status
Prototype	✅
Functional App	✅
Collaboration	✅
Price Intelligence	✅
Admin Tools	✅
Monetization	✅
Design System	✅
Brand Identity	✅
Motion System	✅
Dynamic Data System	✅
Inline Editing UX	✅
UX Stability Layer	✅
Platform Awareness Layer	✅
🏁 Current Stage

👉 MVP v1.3

CEASARS(Centrais de Abastecimento do Rio Grande do Sul) DB:

URL: https://drive.google.com/drive/folders/1H7amJHE6-sysxqZYLjEq9bArQ0K_EvxY

Format: Google Sheets

Produto
Unidade(KG, DZ, UND,MOL,BDJ, CX, CXT)
Max(Max price)
Mais Frequente(Average price)
Mínimo(Min price)