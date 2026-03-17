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

Date: March 15, 2026
Status: Stable collaborative shopping list with price intelligence

Current maturity:

MVP v0.9

Major updates since last summary:

Shared lists with members

Member management (remove / leave)

User collection integration

Product search using Material UI Autocomplete

Firestore permission fixes

Avatar initials for members

Improved error diagnostics

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

Now uses Material UI Autocomplete instead of Select.

ShoppingList

Displays shopping items and handles:

quantity

remove item

price display

price comparison

SettingsPanel

Contains:

password change

logout

admin spreadsheet upload

🔄 Firestore Data Model
users
users
   userId
      email
      createdAt

Document ID = Firebase Auth UID.

products
products
   productId
      name
      unit
      createdAt

Product IDs are normalized.

Example:

Tomate Italiano → tomate_italiano
prices
prices
   productId
      history
         fileDate
            max
            min
            average
            fileDate
            uploadedAt

Example:

prices
   tomate
      history
         2026-03-12
sharedLists
sharedLists
   listId
      name
      ownerId
      members [uid]
      createdAt

      items
         itemId
            productId
            price
            previousPrice
            amount
            fileDate
            createdAt
🔁 Real-Time Firestore Listeners
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

Realtime updates when items are added/modified.

🧠 Shopping List Logic

When a product is added:

addItem(productId)

Process:

1 Query latest price history
2 Get newest fileDate
3 Get previous price
4 Insert item in list

Stored fields:

productId
price
previousPrice
amount
fileDate
createdAt
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
Product Search (NEW)

AddItemModal now uses:

Material UI Autocomplete

Advantages:

search by typing

scalable to thousands of products

faster UX

better mobile usability

Member Avatars (NEW)

List members now display as:

Avatar with initials

Example:

JP
MS

Derived from user email or name.

👥 List Collaboration System
Sharing Lists

Flow:

Enter user email
↓
Query users collection
↓
Get userId
↓
Add userId to members array

Firestore update:

sharedLists/{listId}.members

Uses:

arrayUnion(userId)

to prevent overwrites.

Member Management

Supported actions:

Owner can:

removeMember(userId)

Members can:

leaveList()
🔐 Firestore Security Rules

Main protections:

Users
users/{userId}

read  → any signed-in user
write → only the owner
Shared Lists
create → signed in users
read   → only members
update → only members
delete → only members
List Items
sharedLists/{listId}/items

Allowed only if user is in parent list members.

Products & Prices

Currently readable by any signed-in user.

Admin writes used for spreadsheet importer.

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

⚠️ Known Limitations
1️⃣ List Ownership Permissions

Currently any member can:

delete list
remove members
share list

Future improvement:

only ownerId can manage members
2️⃣ Importer Performance

Current importer:

await getDoc(productRef)

inside loop.

Optimization possible by:

loading all products once
3️⃣ SettingsPanel Growing Large

Future refactor:

SettingsPanel
   PasswordPanel
   SharePanel
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

auto focus

press ENTER to add item

instant add without button

🏅 Mobile UX

Improve:

item editing

keyboard shortcuts

faster adding flow

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
📈 Project Stage
Prototype        ✅
Functional App   ✅
Collaboration    ✅
Price Data       ✅
Admin Tools      ✅
Multi-user Lists ✅

Current stage:

MVP v0.9

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

- Better mobile UX

1️⃣ How to reduce Firestore costs by 90%
2️⃣ How to make your importer 20x faster
3️⃣ How to transform Xepa into a real startup product

- Auto Ads from AdSense
- safer AdSense integration for React PWAs that prevents all future adsbygoogle errors and memory leaks.