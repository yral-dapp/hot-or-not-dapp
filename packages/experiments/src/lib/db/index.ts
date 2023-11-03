import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: 'AIzaSyAHcokofuHkZaLy2MvMpEjTwYXLzJ0R__M',
  authDomain: 'experiments-hon.firebaseapp.com',
  projectId: 'experiments-hon',
  storageBucket: 'experiments-hon.appspot.com',
  messagingSenderId: '118796490968',
  appId: '1:118796490968:web:67233c5861e0140dae5fad',
  measurementId: 'G-WLVV7NBKTG',
}

// Initialize Firebase
let app: FirebaseApp
let db: Firestore

export function getApp() {
  if (!app) {
    initDb()
  }
  return app
}

export function getDb() {
  if (!db) {
    initDb()
  }
  return db
}

export function initDb() {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } catch (e) {
    console.error('Something went wrong while intializing DB')
  }
}
