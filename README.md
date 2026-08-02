# <p align="center"><img src="public/xepa_logo.png" alt="Xepa Logo" width="140"></p>

<h1 align="center">🧾 Xepa</h1>

<p align="center">
  <strong>Smart collaborative shopping lists with price intelligence.</strong>
</p>

<p align="center">
  Plan grocery shopping together, compare prices, and make smarter purchasing decisions.
</p>

---

## 📖 Overview

Xepa is a collaborative grocery shopping application built with **React**, **Vite**, and **Firebase**.

The application allows multiple users to share shopping lists in real time while leveraging historical market prices to help identify better deals and monitor price variations.

Originally developed as a personal project, Xepa focuses on providing a simple, mobile-first experience while exploring practical applications of real-world pricing data.

---

# ✨ Features

### 🛒 Shopping Lists

* Create multiple shopping lists
* Real-time collaboration
* Inline editing
* Product quantities
* Manual product creation

### 👥 Collaboration

* Share lists with multiple users
* Member management
* Live synchronization using Cloud Firestore

### 💰 Price Intelligence

* Historical product prices
* Average, minimum and maximum prices
* Product autocomplete
* Price comparison against historical values

### 📥 Spreadsheet Import

* Import pricing spreadsheets
* Automatic product matching
* Batch product creation

### 📱 Mobile Experience

* Responsive interface
* Progressive Web App (PWA)
* iOS installation guidance
* Smooth page transitions

### 🎨 User Experience

* Snackbar notifications
* Motion-based navigation
* Optimized controlled inputs
* Mobile-first design

---

# 📊 Price Data

Xepa's price intelligence is based on public market data published by **CEASA/RS (Centrais de Abastecimento do Rio Grande do Sul)**.

The application imports pricing information from the official Google Sheets dataset and stores it in Cloud Firestore for historical comparison.

**Data source:**

https://drive.google.com/drive/folders/1H7amJHE6-sysxqZYLjEq9bArQ0K_EvxY

Each imported record contains:

| Field   | Description                                                |
| ------- | ---------------------------------------------------------- |
| Product | Product name                                               |
| Unit    | Unit of measurement (KG, DZ, UND, MOL, BDJ, CX, CXT, etc.) |
| Maximum | Highest recorded price                                     |
| Average | Most frequent / average market price                       |
| Minimum | Lowest recorded price                                      |

This information is used to provide historical price references within the application. Xepa is **not affiliated with CEASA/RS** and does not modify the original published pricing data.

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* React Router
* Material UI
* Framer Motion

## Backend

* Firebase Authentication
* Cloud Firestore
* Firebase Hosting

## Tooling

* ESLint
* npm

---

# 🏗 Architecture

The application is organized around four primary Firestore collections:

```text
users
products
prices
sharedLists
```

Each shopping list contains an `items` subcollection that stores its products and pricing information, allowing independent real-time synchronization for every shared list.

Key architectural decisions include:

* Separation between UI state and persisted database state
* Firestore realtime listeners
* Mobile-first responsive design
* Reusable platform detection utilities
* Component-based React architecture

---

# 📂 Project Structure

```text
.
├── public/
│   ├── xepa_logo.png
│   └── ...
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── firebase.js
│   ├── ShoppingList.jsx
│   ├── AddItemModal.jsx
│   ├── SettingsPanel.jsx
│   └── ...
│
├── README.md
├── LICENSE
└── package.json
```

---

# 🚀 Getting Started

## Prerequisites

* Node.js 20+
* npm
* Firebase project

## Clone the repository

```bash
git clone https://github.com/<your-username>/xepa.git

cd xepa
```

## Install dependencies

```bash
npm install
```

## Configure Firebase

Create a `.env` file in the project root.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Fill the variables using your Firebase project configuration.

---

# 💻 Running Locally

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🚀 Deployment

Deploy to Firebase Hosting:

```bash
firebase deploy --only hosting
```

---

# 📊 Current Status

**Version:** MVP v1.3

Implemented features:

* ✅ Authentication
* ✅ Collaborative shopping lists
* ✅ Realtime synchronization
* ✅ Price history
* ✅ Spreadsheet import
* ✅ Product autocomplete
* ✅ Inline editing
* ✅ Member management
* ✅ Responsive UI
* ✅ Motion system
* ✅ Progressive Web App
* ✅ iOS install guidance
* ✅ Privacy Policy
* ✅ Contact page
* ✅ Google AdSense integration

---

# 🗺 Roadmap

Planned improvements:

* Push notifications
* Price drop indicators
* Savings highlights
* Shopping insights
* Dark mode
* Owner/Admin permissions
* Import performance optimization
* Offline support
* Premium features

---

# 🤝 Contributing

Contributions, suggestions and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

See the **LICENSE** file for more information.

---

<p align="center">
Built with ❤️ using React, Firebase and Vite.
</p>
