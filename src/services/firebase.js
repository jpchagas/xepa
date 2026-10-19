// Firebase
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
} from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: "AIzaSyDJhM3gSCTi9fqjWUD7Qe2DlSskifqvdUY",
  authDomain: "xepa-6fa32.firebaseapp.com",
  projectId: "xepa-6fa32",
  storageBucket: "xepa-6fa32.firebasestorage.app",
  messagingSenderId: "676820100070",
  appId: "1:676820100070:web:014db0f1f7fda130ff2c27",
  measurementId: "G-Z87YD1B5VB"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
})

// Same region as functions/src/index.js.
export const functions = getFunctions(app, 'southamerica-east1')

export default app


// Good
//import { auth, db } from '../../services/firebase'


// Old
//import { auth } from './firebase'