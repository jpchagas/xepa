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

🧾 Xepa App – Development Summary

Date: March 12, 2026
Status: Stable build with working price importer + improved UX

🧱 Tech Stack

Frontend

React (Vite)

UI Framework

Material UI

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

Passing props to UI components

Main state variables:

lists
selectedList
items
products
newItem
open
navValue
newPassword
passwordMessage
passwordError
alert

alert was added today to support Snackbar notifications.

📂 Component Structure
src

MainScreen.jsx

components
   AddItemFab.jsx
   AddItemModal.jsx
   MainBottomNavigation.jsx
   ShoppingList.jsx
   SettingsPanel.jsx
   ShareListPanel.jsx
   ListSelector.jsx
🔄 Firestore Data Model
users
users
   userId
      email
      createdAt
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
sharedLists
where members array-contains user.uid

Used for collaborative lists.

Products
onSnapshot(products)

Loads product catalog.

Items
sharedLists/{listId}/items

Updates automatically when items change.

🧠 Shopping List Logic

When a product is added:

addItem(productId)

Process:

1 Query latest price history
2 Get newest fileDate
3 Get previous price
4 Insert item in sharedLists/{listId}/items

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

Used as fileDate.

🔧 Price Import Logic

Important functions.

Product ID normalization
normalizeProductId(name)

Converts:

Tomate (Italiano)

to:

tomate_italiano

Removes:

accents

spaces

parentheses

slashes

Prevents duplicate products.

Batch write system
writeBatch(db)

All updates committed together.

Benefits:

faster writes

atomic operation

fewer Firestore requests

🎨 UI Improvements Implemented
Snackbar Alerts

Replaced all blocking:

alert()

with Material UI Snackbar + Alert.

Supported severities:

success
warning
error

Examples:

🟡 Planilha vazia
🟡 Colunas faltando
🟢 143 produtos atualizados
🔴 Erro ao processar planilha

Alert state added to MainScreen.

🧩 Settings Panel Features
Password Change

Uses:

updatePassword(auth.currentUser)

Shows success/error alerts.

Logout
signOut(auth)
List Sharing

Handled by ShareListPanel.

Flow:

Enter user email
↓
Query users collection
↓
Get userId
↓
Add to members array

Firestore update:

sharedLists/{listId}.members
Admin Price Upload

New upload system implemented.

Uses:

handlePriceUpload(event)

Spreadsheet parsing via SheetJS (XLSX).

🛠 Bugs Fixed Today
1️⃣ File Upload Error

Error:

TypeError: n.indexOf is not a function

Cause:

file input → addItem(file)

Fix:

file input → handlePriceUpload(event)
2️⃣ Missing Prop Error

Error:

handlePriceUpload is not defined

Cause:

SettingsPanel was not receiving the prop.

Fix:

function SettingsPanel({... , handlePriceUpload})
3️⃣ Missing Imports

Added:

getDoc
writeBatch
XLSX
⚠️ Known Limitations
1️⃣ Share List Race Condition

Current code:

members: [...selectedList.members, userId]

Should become:

arrayUnion(userId)

To prevent overwrite.

2️⃣ Anyone Can Share Lists

No owner restriction yet.

Possible improvement:

only ownerId can share
3️⃣ Upload Reads Products One by One

Current code:

await getDoc(productRef)

Inside loop.

Works but slower for large files.

Future optimization possible.

🚀 Next Recommended Development Tasks

Priority order.

🥇 List Management

Currently lists are auto-created.

Add UI for:

Create list
Rename list
Delete list

Component candidate:

ListSelector
🥈 Firestore Safety

Use:

arrayUnion(userId)

When sharing lists.

🥉 Refactor SettingsPanel

Current component getting large.

Split into:

SettingsPanel
   PasswordPanel
   ShareListPanel
   AdminUploadPanel
🏅 Performance Improvement

Optimize importer:

load all products once
instead of getDoc per row

Speeds up large uploads.

⭐ Current Product State
Feature	Status
Authentication	✅
Shopping list	✅
Realtime updates	✅
Price history	✅
Spreadsheet import	✅
Price comparison	✅
Collaborative lists	✅
Snackbar notifications	✅
📈 Development Stage

The project is now a functional collaborative shopping platform with price intelligence.

Current maturity:

Prototype        ✅
Functional App   ✅
Collaboration    ✅
Price Data       ✅
Admin Tools      ✅

Estimated stage:

MVP v0.8

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

- Using list in the context of list page
- Advertising
- Replace Select for Autocomplete in the Add Item

- Leave list button
- Remove member
- Better mobile UX