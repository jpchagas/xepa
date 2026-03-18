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

Date: March 17, 2026
Status: Stable collaborative shopping list with price intelligence + branded UI system + polished entry experience

🚀 Current Maturity
👉 MVP v1.1 (Branded UX + Transition System)
Evolution:

v1.0 → functional + branded

v1.1 → branded + experience-driven

🔥 Major Updates Since Last Version
🎬 NEW — Splash → Login Transition System
✅ Splash Screen Enhancements

Logo-only layout (removed text)

Increased logo size (visual dominance)

Added pulse animation (subtle life/feedback)

Implemented:

fade-out

zoom-out transition before navigation

✅ Login Screen Enhancements

Added entry animation:

fade-in

slight upward motion (translateY)

Synced timing with splash exit

🔗 Cross-Screen Continuity (NEW)

Logo appears in both:

Splash (large)

Login (smaller)

👉 Creates visual continuity between screens

🎯 Result

Instead of:

hard page switch

User experiences:

smooth screen transition (native-app feel)

🧠 NEW — Motion System (Micro-Interactions Layer)

You now have a consistent animation language:

Interaction	Behavior
Splash	Pulse + fade/zoom out
Screen entry	Fade + rise
FAB	Hover gradient
Buttons	Gradient hover
Navigation	Smooth transitions

👉 This is a major UX maturity jump

🎨 Design System & Brand Identity (Recap)
✅ Custom MUI Theme (Fully Adopted)

Eliminated default MUI blue

Centralized styling system

Consistent component behavior

🎯 Brand Color Mapping
Role	Color
Primary Action	Yellow #FFD400
Danger / Deals	Red #E53935
Accent	Orange #FF6F00
Success	Green #4CAF50 (restricted)
Background	White / Light Gray
Text	Black / Dark Gray
🌈 Gradient System

Hot Deal: #FFD400 → #FF6F00

Urgency: #E53935 → #FF6F00

Used in:

AppBar

FAB

Buttons

Splash

🧱 MUI Component Overrides (Global)

Customized:

AppBar

Button

FAB

BottomNavigation

Alerts

👉 No default styling leaks

📱 Navigation UI

Bottom navigation:

Active = red

Inactive = gray

Matches “deal urgency” mental model

➕ FAB (Primary Action Anchor)

Gradient styling

Elevated prominence

Key interaction driver

🔝 AppBar

Gradient background

Strong typography

No elevation (modern look)

💬 Feedback System

Snackbar + Alert:

Success → green

Error → red

Clear semantic feedback

🧠 Styling Architecture
Dual-layer system:
1. MUI Theme

Component styling

Interaction consistency

2. CSS Variables

Layout

Surfaces

Custom UI

👉 Scalable + maintainable

🧱 Updated Tech Stack
Frontend

React (Vite)

UI

Material UI (MUI) + Custom Theme

Styling

Theme + CSS Variables

Backend

Firebase

Database

Firestore

Auth

Firebase Auth

Data Processing

SheetJS (XLSX)

Ads

Google AdSense

Animations

Framer Motion + Custom micro-interactions (NEW)

🎨 UX Maturity Upgrade
Area	Before	Now
Navigation feel	Web-like	App-like
Transitions	Basic	Smooth & intentional
First impression	OK	Strong
Branding	Strong	Immersive
Motion	Minimal	System-driven
📊 Feature Status
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
Product search autocomplete	✅
Privacy policy	✅
Contact page	✅
AdSense integration	✅
Mobile transitions	✅
Design system	✅
Brand identity	✅
Motion system (NEW)	✅
Splash experience (NEW)	✅
⚠️ Known Limitations
1️⃣ Permissions System

Still missing owner-only control

2️⃣ Import Performance

Uses getDoc inside loop

3️⃣ SettingsPanel

Needs modularization

4️⃣ Theme

No dark mode yet

No dynamic switching

🚀 Recommended Next Steps
🥇 Owner Permissions

(unchanged priority)

🥈 Shopping List UI Upgrade (NOW EVEN MORE IMPORTANT)

👉 Because your UX is now polished, this becomes the weakest link

Upgrade to:

promo cards

price drop indicators

savings highlights

🥉 Product Import Optimization
🏅 Add Item UX
💰 Monetization Expansion
🌙 Dark Mode

Now very easy due to theme system

📈 Project Stage
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
🏁 Current Stage
👉 MVP v1.1

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

- Advertising
- User add product if not exist on database

- Better mobile UX

1️⃣ How to reduce Firestore costs by 90%
2️⃣ How to make your importer 20x faster
3️⃣ How to transform Xepa into a real startup product

- Auto Ads from AdSense
- safer AdSense integration for React PWAs that prevents all future adsbygoogle errors and memory leaks.
- System Notifications (Real Push Notifications)
- apply new visual identify: color palette:
🎨 Xepa — Color Palette (Promo Identity)
🔥 1. Core Brand Colors (your foundation)
🟡 Primary Yellow (energy / attention)

#FFD400

Use for: highlights, key actions, main brand moments

🔴 Primary Red (urgency / deals)

#E53935

Use for: discounts, alerts, “OFERTA”

⚫ Black (authority / contrast)

#121212

Use for: backgrounds (Option C), text, premium feel

⚖️ 2. Supporting Colors (for balance)
⚪ White

#FFFFFF

Clean UI, readability

⚫ Dark Gray

#2C2C2E

Secondary backgrounds

⚪ Light Gray

#F2F2F2

Cards, surfaces

🎯 3. Accent Colors (this is where it gets powerful)
🟠 Promo Orange (heat / transition)

#FF6F00

Use for gradients or hover states

🟢 Success Green (ONLY for confirmation)

#4CAF50

Example: “you saved R$12”

👉 Important:
You avoided green as a brand color — good.
But using it sparingly = UX clarity

🌈 4. Gradients (to modernize the “promo” look)

Flat yellow/red can look outdated if overused.

Gradient 1 — “Hot Deal”
#FFD400 → #FF6F00
Gradient 2 — “Urgency”
#E53935 → #FF6F00

👉 Use for:

banners

CTA buttons

promo highlights

📱 5. UI Color Roles (this is what makes it professional)

Instead of random usage, define roles:

Role	Color
Primary Action	Yellow
Danger / Discount	Red
Background	White / Black
Text Primary	Black
Text Secondary	Gray
Success	Green
Highlight	Orange