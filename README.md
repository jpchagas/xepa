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

📱 Xepa – Project Context Summary

I am building Xepa, a mobile-first shopping list PWA using:

React (Vite)

Material UI

React Router

Firebase (Auth + future Firestore)

vite-plugin-pwa

The goal is to create a native-like, offline-first shopping list app.

🏗 Current Architecture
Routing

/ → SplashScreen

/login → Login

/register → Register

/forgot-password → ForgotPassword

/main → MainScreen (protected route via Firebase Auth)

App.jsx uses Firebase onAuthStateChanged to control protected access.

🔐 Authentication (Firebase)

Firebase is fully integrated.

Implemented:

Email/password registration

Login

Forgot password (email reset)

Change password (inside Settings tab)

Logout

Auth state persistence

Firebase config is loaded via .env using VITE_ variables.

🛒 Main Features
Shopping List (MainScreen)

Add items (FAB + modal)

Delete items

Smooth animations (react-transition-group)

Bottom Navigation:

Lista

Configurações

Settings Tab

Change password

Logout

📦 Persistence

Currently:

Shopping list stored in localStorage

Next planned step:

Move shopping list to Firestore

Per-user list storage

Real-time sync

Offline-first Firestore caching

📲 PWA Setup

Using vite-plugin-pwa:

Manifest configured

Service worker enabled

Theme color configured

Static assets cached

App installable

🎨 Native App Feel Improvements Done

Removed Vite default layout constraints

Fixed full-screen rendering

Removed centered layout

Replaced 100vh with 100dvh

Ensured html, body, #root are 100% height

Removed max-width limitation on #root

Edge-to-edge mobile layout

The app now fills the full mobile screen correctly.

🚀 Next Planned Improvements

Replace localStorage with Firestore (per-user data)

Enable Firestore offline persistence

Add checkboxes (mark item as purchased)

Add categories

Add priority levels

Improve native UX (swipe to delete, haptics, etc.)

Improve PWA caching strategy for dynamic content

Add profile management

Add reauthentication for secure password changes

Optimize for production Firebase deployment

🎯 Current Status

Authentication works.
UI is mobile-native.
App fills entire screen.
Settings tab works.
Logout works.
Password change works.
PWA installs properly.

Ready to move to Firestore integration and full offline-first architecture.

Tomorrow, just say:


CEASARS(Centrais de Abastecimento do Rio Grande do Sul) DB:

URL: https://drive.google.com/drive/folders/1H7amJHE6-sysxqZYLjEq9bArQ0K_EvxY

Format: Google Sheets

Produto
Unidade(KG, DZ, UND,MOL,BDJ, CX, CXT)
Max(Max price)
Mais Frequente(Average price)
Mínimo(Min price)