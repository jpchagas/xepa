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

Xepa – Development Summary (Session Log)
1. Project Overview

You are building Xepa, a grocery planning web app that:

imports price data from supermarket spreadsheets

calculates average product prices

lets users create a shopping list

estimates total grocery cost

Stack:

Frontend: React + Material UI

Backend: Firebase

Database: Firestore

Auth: Firebase Authentication

Spreadsheet parsing: XLSX

2. Current Features Implemented
Authentication

Users authenticate with Firebase Auth.

User profile document is created automatically:

users/{uid}
    email
    createdAt
Product Database

Products are stored globally:

products/{productId}
    name
    unit
    createdAt

Example:

products/ovo_branco
    name: "Ovo Branco"
    unit: "DZ"
Price History System

Prices are imported from Excel spreadsheets.

Structure:

prices/{productId}/history/{fileDate}
    max
    min
    average
    fileDate
    uploadedAt

Example:

prices/ovo_branco/history/2025-03-05
    max: 14
    min: 10
    average: 12

Spreadsheet validation includes:

Required columns:

Produto
UND
MAX
MAIS FREQUENTE
MÍNIMO

Validation rules:

values must be numbers

min ≤ average ≤ max

Upload is performed with Firestore batch writes.

Shopping List

Each user currently has their own list:

users/{uid}/shoppingList/{itemId}

Item structure:

productId
price
previousPrice
amount
fileDate
createdAt

When adding an item:

The system loads the two latest price records

Assigns:

price = latest average

previousPrice = previous average

Price Trend Highlight

List items visually show price changes.

Color logic:

if current > previous → red
if current < previous → green
if equal → white
Unit Conversion System

Special logic implemented for DZ (dozen) products.

Example:

Spreadsheet price:

Eggs (DZ) = R$12

Displayed in UI:

Preço médio: R$1.00 (un)

Implementation:

getEffectivePrice()
if unit === 'DZ'
price / 12

This allows users to input quantities per unit instead of per dozen.

Total Price Calculation

Estimated total cost:

sum(
 effectivePrice * amount
)

Displayed at bottom of list.

Product Name Normalization

Product IDs are normalized:

Example:

Arroz Branco (5kg)

becomes

arroz_branco_5kg

Rules:

lowercase

remove accents

spaces → _

remove () and /

Admin Features

Admin email:

jpchagas@gmail.com

Admin can:

upload new price spreadsheets

update price history

UI Components

Material UI layout includes:

AppBar

List

Floating add button

Quantity input

Delete item button

Total cost summary

Current Firestore Structure
users
   uid
      email
      createdAt

      shoppingList
         itemId
            productId
            price
            previousPrice
            amount

products
   productId
      name
      unit

prices
   productId
      history
         fileDate
            min
            max
            average
Features Built in This Session
1️⃣ DZ unit conversion

Correct price per unit calculation.

2️⃣ Effective price logic
getEffectivePrice(productId, price)

Used in:

item display

total calculation

3️⃣ Improved list item totals

Each item shows:

Preço médio
Total do item
4️⃣ Spreadsheet validation improvements

Checks:

correct column names

valid price relationships

non-empty data

Feature Discussed but NOT Implemented Yet
Shared Lists

Goal:

Allow multiple users to edit the same shopping list.

Proposed structure:

lists/{listId}
    name
    members[]

lists/{listId}/items/{itemId}

This would replace:

users/{uid}/shoppingList

Benefits:

couples sharing groceries

roommates

family planning

Not implemented yet.

Next Development Tasks
Priority 1

Implement shared lists.

Steps:

create lists collection

move items to:

lists/{listId}/items

store list members

load lists with:

array-contains user.uid
Priority 2

Invite users by email.

Flow:

enter email
lookup user
add UID to list members
Priority 3

Multiple lists support.

Example:

Casa
Churrasco
Festa
Priority 4

List sharing UI.

Possible UI:

Settings
Share list
Invite user
Nice Future Features

Ideas that would significantly improve the app:

Price history chart
Egg price trend over time
Cheapest store detection

Using the price data.

Price alerts
Eggs dropped 20%
Offline support

Firestore supports this easily.

Mobile install (PWA)

Turn the app into an installable phone app.

Current App Status

Development stage:

MVP+

Working features:

authentication

spreadsheet price ingestion

price history

smart unit conversion

shopping list

cost estimation

Remaining core feature:

shared lists

Quick Restart Instructions (Tomorrow)

1️⃣ Start dev server

npm run dev

or

npm start

2️⃣ Open project

src/MainScreen.jsx

3️⃣ Next work item:

Implement shared lists structure.


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

- Share List
- Advertising
- Replace Select for Autocomplete
- Creation of multiple lists