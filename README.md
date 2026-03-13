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

🧾 Xepa App – Development Summary (March 12, 2026)
🧱 Tech Stack

Frontend: React (Vite)

UI: Material UI (MUI)

Backend: Firebase

Authentication: Firebase Auth

Database: Firestore

Data Processing: XLSX (for price spreadsheet uploads)

📂 Current App Architecture
Main Container

MainScreen.jsx

Responsibilities:

Global state

Firestore subscriptions

Firebase operations

Passing props to UI components

Main states:

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
🧩 UI Components
1️⃣ ShoppingList.jsx

Displays the current shopping list.

Features:

Shows products

Shows unit

Shows price

Shows total price

Shows price variation color

Functions received via props:

getProductName
getProductUnit
getDisplayUnit
getEffectivePrice
updateAmount
removeItem
getPriceColor
formatCurrency
totalPrice
2️⃣ AddItemModal.jsx

Modal for adding products to the list.

Features:

Product selector

Calls addItem(productId)

Uses:

products
newItem
setNewItem
addItem
3️⃣ AddItemFab.jsx

Floating Action Button

Purpose:

Opens AddItemModal

4️⃣ MainBottomNavigation.jsx

Controls main navigation.

Tabs:

0 → Lista
1 → Configurações
5️⃣ SettingsPanel.jsx

Settings screen.

Contains:

🔐 Password Change

Change Firebase Auth password

Displays success/error alerts

🚪 Logout

Calls signOut

👥 List Sharing

Uses:

ShareListPanel
📊 Admin Price Upload

Only visible if:

auth.currentUser.email === 'jpchagas@gmail.com'

Uploads spreadsheet.

6️⃣ ShareListPanel.jsx

Allows sharing a list with another user.

Flow:

1️⃣ Enter user email
2️⃣ Query /users collection
3️⃣ Get user UID
4️⃣ Update list members array

Firestore update:

updateDoc(doc(db,'sharedLists',listId), {
  members: [...selectedList.members, userId]
})
🔔 UI Improvement Implemented

Alerts replaced with Snackbar + Alert.

Example:

<Snackbar open={alert.open} autoHideDuration={4000}>
  <Alert severity={alert.severity}>
    {alert.message}
  </Alert>
</Snackbar>

Benefits:

floating notifications

auto-hide after 4s

cleaner UX

🗄 Firestore Data Model
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
prices
prices
   productId
      history
         fileDate
            max
            min
            average
            uploadedAt
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
🔄 List System

Users can belong to multiple lists.

Query used:

query(
  collection(db,'sharedLists'),
  where('members','array-contains',user.uid)
)
Automatic List Creation

If user has no lists:

addDoc(collection(db,'sharedLists'),{
  name:'Minha Lista',
  ownerId:user.uid,
  members:[user.uid],
  createdAt:serverTimestamp()
})
📡 Real-time Firestore Listeners
Lists
onSnapshot(sharedLists where members contain uid)
Products
onSnapshot(products)
Items (per selected list)
onSnapshot(sharedLists/{listId}/items)
🛠 Major Bugs Fixed Today
1️⃣ Firestore Permission Errors

Problem:

Missing or insufficient permissions

Cause:
Users couldn't read /users.

Fix:

match /users/{userId} {
  allow read: if signedIn();
  allow write: if request.auth.uid == userId;
}
2️⃣ Firestore Modular Import Errors

Examples:

ReferenceError: orderBy is not defined
ReferenceError: limit is not defined

Fix:

import { orderBy, limit } from 'firebase/firestore'
3️⃣ Add Item Not Appearing

Cause:
Missing listener for:

sharedLists/{listId}/items

Solution:
Add useEffect listening to selected list items.

4️⃣ Upload Button Bug

Wrong:

addItem(e.target.files[0])

Correct:

handlePriceUpload
🧠 Important Logic Implemented
Product price logic

Supports dozen conversion.

DZ → divide price by 12

Functions:

getDisplayUnit
getEffectivePrice
🎨 Price Comparison Color
if price increased → red
if price decreased → green
📊 Price Spreadsheet Import

Spreadsheet columns required:

Produto
UND
MAX
MAIS FREQUENTE
MÍNIMO

Processing steps:

1️⃣ Parse XLSX
2️⃣ Validate columns
3️⃣ Normalize product ID
4️⃣ Insert product if new
5️⃣ Store price history

📁 Current Component Structure
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
⚠️ Current Known Limitations

1️⃣ Race condition when sharing lists
(members array overwrite risk)

2️⃣ Anyone in the list can share
(no owner restriction)

3️⃣ User search requires users collection

4️⃣ SettingsPanel is getting large

🚀 Recommended Next Improvements
1️⃣ Split SettingsPanel
SettingsPanel
   PasswordPanel
   ShareListPanel
   AdminUploadPanel
2️⃣ Use arrayUnion for members

Safer sharing:

updateDoc(listRef,{
  members: arrayUnion(userId)
})

Prevents duplicates.

3️⃣ Create Lists

Add UI to:

Create new list
Rename list
Delete list
4️⃣ Invite System (better UX)

Instead of direct add:

invites
   inviteId
      listId
      email
      status

User accepts invite.

5️⃣ Improve ListSelector

Allow:

create list
switch list
📈 App Progress
Feature	Status
Auth	✅
Shopping List	✅
Price history	✅
Spreadsheet import	✅
Shared lists	✅
List auto-creation	✅
Snackbar notifications	✅
Multi-list support	✅
Price comparison	✅
🧠 Where to Resume Tomorrow

Best next task:

Refactor SettingsPanel

Then:

Add "Create New List"

Then:

Improve Firestore safety (arrayUnion)
⭐ Overall Progress

You have already built a fully working collaborative shopping list app with price intelligence.

This is already production-level architecture:

realtime collaboration

shared lists

price history

spreadsheet ingestion

price comparison logic

That’s a serious app.

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

- Show the users in this list
- Move Sharelist button from Setting Panel to ListPanel
- Add remove all items from List
- Create a button of create a new list
- Using list in the context of list page
- Advertising
- Replace Select for Autocomplete in the Add Item