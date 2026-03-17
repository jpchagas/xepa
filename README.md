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

Date: March 16, 2026
Status: Stable collaborative shopping list with price intelligence + monetization foundations

Current maturity:

MVP v0.95

Major updates since last summary:

Shared lists with members

Member management (remove / leave)

User collection integration

Product search using Material UI Autocomplete

Firestore permission fixes

Avatar initials for members

Improved error diagnostics

Google AdSense integration (AdBanner component)

Privacy Policy page added

Contact page added

Mobile-style navigation with animated transitions

Back navigation UI for legal pages

AdSense React StrictMode compatibility fix

Improved mobile UX for settings navigation

🧱 Tech Stack
Frontend

React (Vite)

UI Framework

Material UI (MUI)

Backend

Firebase

Authentication

Firebase Authentication

Database

Cloud Firestore

Spreadsheet Parsing

SheetJS (XLSX)

Ads / Monetization

Google AdSense

Animations

Framer Motion

🧠 Main Application Architecture

Main Container

MainScreen.jsx

Responsibilities:

Global state management

Firestore realtime listeners

Firebase operations

Spreadsheet processing

List sharing logic

Member management

Passing props to UI components

Ad rendering

Mobile navigation control

Main State Variables
lists
selectedList
items
products
members
newItem
open
navValue
newPassword
passwordMessage
passwordError
alert
createDialogOpen
shareDialogOpen
newListName
shareEmail

members state loads user data for list participants.

📂 Component Structure
src

MainScreen.jsx

components
   AddItemFab.jsx
   AddItemModal.jsx
   MainBottomNavigation.jsx
   ShoppingList.jsx
   SettingsPanel.jsx
   ListSelector.jsx
   ListControls.jsx
   AdBanner.jsx

pages
   PrivacyPolicy.jsx
   Contact.jsx
Component Responsibilities
ListSelector

Handles switching between shopping lists.

ListControls

Handles list actions:

create list

delete list

clear items

share list

remove member

leave list

show member avatars

AddItemModal

Product search + add item modal.

Uses:

Material UI Autocomplete

Advantages:

search by typing

scalable to thousands of products

faster UX

better mobile usability

ShoppingList

Displays shopping items and handles:

quantity editing

item removal

price display

price comparison

SettingsPanel

Contains:

password change

logout

admin spreadsheet upload

privacy policy navigation

contact page navigation

Navigation uses React Router navigate() for SPA navigation.

AdBanner (NEW)

Reusable ad component responsible for rendering Google AdSense units.

Features:

Safe initialization using useEffect

React StrictMode compatibility

Prevents duplicate adsbygoogle.push() calls

Mobile-friendly responsive banner

Example structure:

<ins class="adsbygoogle">

Used inside:

MainScreen.jsx

Displayed under shopping list content.

PrivacyPolicy (NEW)

Legal page containing:

data collection explanation

Google AdSense disclosure

cookie policy

developer contact information

UI features:

Material UI layout

mobile AppBar

back button navigation

slide animation transitions

Contact Page (NEW)

Contains:

developer contact information

support message

email address

Also includes:

AppBar

back button

animated transitions

🔄 Real-Time Firestore Listeners
Lists

Query:

sharedLists
where members array-contains user.uid

Used for collaborative list access.

Products
onSnapshot(products)

Loads the product catalog used for item selection.

Items
sharedLists/{listId}/items

Realtime updates when items are added or modified.

🔄 Navigation System (NEW)

App navigation handled with:

React Router

Main routes:

/login
/register
/forgot-password
/main
/privacy
/contact

Animated transitions implemented with:

Framer Motion

Features:

slide transition between pages

mobile-style navigation

back arrow support

SPA navigation without reload

📊 Price Spreadsheet Import System

Admin-only feature.

Visible when:

auth.currentUser.email === 'jpchagas@gmail.com'

Upload Flow

Admin selects XLSX
↓
handlePriceUpload(event)
↓
Extract date from filename
↓
Parse spreadsheet
↓
Validate columns
↓
Normalize product IDs
↓
Create missing products
↓
Store price history
↓
Batch commit

Required Spreadsheet Columns

Produto
UND
MAX
MAIS FREQUENTE
MÍNIMO

File Name Format

Cotação DD_MM_AAAA.xlsx

Example:

Cotação 12_03_2026.xlsx

Converted to:

2026-03-12

Stored as fileDate.

🔧 Price Import Logic
Product ID Normalization
normalizeProductId(name)

Example:

Tomate (Italiano)
→ tomate_italiano

Removes:

accents

spaces

parentheses

slashes

Prevents duplicate products.

Batch Write System
writeBatch(db)

Benefits:

atomic writes

faster uploads

fewer Firestore operations

🎨 UI Improvements
Snackbar Alerts

Replaced blocking alerts with:

Material UI

Components:

Snackbar + Alert

Supported severities:

success
warning
error

Examples:

🟡 Planilha vazia
🟡 Colunas faltando
🟢 143 produtos atualizados
🔴 Erro ao processar planilha
Product Search

Uses:

Material UI Autocomplete

Advantages:

fast typing search

scalable

better mobile UX

Member Avatars

List members display as:

Avatar with initials

Example:

JP
MS

Derived from user email or name.

Mobile Navigation UX (NEW)

Settings → Privacy / Contact pages now behave like mobile app screens:

Features:

AppBar header

back button navigation

slide page transitions

smooth route animations

💰 Monetization (NEW)

Initial ad integration completed.

Using:

Google AdSense

Implementation:

AdBanner.jsx

Features:

responsive banner ads

safe React integration

development-mode compatibility

Current placement:

ShoppingList
↓
AdBanner

Future improvements:

sticky bottom ads

anchor ads

AdSense Auto Ads

🛠 Bugs Fixed Recently
1️⃣ File Upload Error

Error:

TypeError: n.indexOf is not a function

Cause:

File input incorrectly calling addItem.

Fix:

handlePriceUpload(event)
2️⃣ Missing Prop Error

Error:

handlePriceUpload is not defined

Fix:

Prop passed to SettingsPanel.

3️⃣ Firestore Permission Errors

Cause:

User not present in list members.

Fix:

Ensured correct UID membership.

4️⃣ Items Security Rule Edge Case

Added parent document existence check.

5️⃣ AdSense Duplicate Push Error (NEW)

Error:

adsbygoogle.push() error
All 'ins' elements already have ads

Cause:

React StrictMode double effect execution.

Fix:

Prevent duplicate push using DOM status check.

⚠️ Known Limitations
1️⃣ List Ownership Permissions

Currently any member can:

delete list

remove members

share list

Future improvement:

Only ownerId should manage members.

2️⃣ Importer Performance

Current importer:

await getDoc(productRef)

inside loop.

Optimization possible by:

loading products once

caching product map

3️⃣ SettingsPanel Growing Large

Future refactor:

SettingsPanel
   PasswordPanel
   PrivacyPanel
   AdminUploadPanel
🚀 Recommended Next Development Tasks
🥇 Owner Permissions

Restrict:

share list

remove members

delete list

to ownerId.

🥈 Product Import Optimization

Load product catalog once.

Avoid per-row getDoc.

🥉 Product Search UX

Improve Autocomplete:

autofocus input

press ENTER to add item

instant add without button

🏅 Mobile UX

Improve:

item editing

keyboard shortcuts

faster adding flow

💰 Monetization Improvements

Future steps:

sticky bottom ads

AdSense Auto Ads

anchor ads

improved ad viewability

⭐ Current Feature Status
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
Mobile page transitions	✅
📈 Project Stage
Prototype        ✅
Functional App   ✅
Collaboration    ✅
Price Data       ✅
Admin Tools      ✅
Multi-user Lists ✅
Monetization     ✅ (initial)

Current stage:

MVP v0.95

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