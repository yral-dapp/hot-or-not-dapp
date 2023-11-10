import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import { generateRandomName, generateUniqueId } from '$lib/utils/randomUsername'
import { anonUser, authState } from '$stores/auth'
import userProfile from '$stores/userProfile'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth as _getAuth, type Auth, type User } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { get } from 'svelte/store'
import { registerUser } from './auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAHcokofuHkZaLy2MvMpEjTwYXLzJ0R__M',
  authDomain: 'experiments-hon.firebaseapp.com',
  projectId: 'experiments-hon',
  storageBucket: 'experiments-hon.appspot.com',
  messagingSenderId: '118796490968',
  appId: '1:118796490968:web:67233c5861e0140dae5fad',
  measurementId: 'G-WLVV7NBKTG',
}

export const BACKEND_HOST = 'https://experiments-hon.uc.r.appspot.com/ud'
// export const BACKEND_HOST = 'http://localhost:7887/ud'

// Initialize Firebase
let app: FirebaseApp
let db: Firestore
let auth: Auth

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

export function getAuth() {
  if (!auth) {
    initDb()
  }
  return db
}

async function onAuthStateChanged(user: User | null) {
  if (user) {
    authState.set({
      isLoggedIn: true,
      showLogin: false,
      userId: user.uid,
      accessToken: await user.getIdToken(),
    })
    userProfile.set({
      id: user.uid,
      email: user.email || undefined,
      name: user.displayName || generateRandomName('name', user.uid),
      photoUrl: user.photoURL || getDefaultImageUrl(user.uid),
    })
    registerUser({
      email: user.email || 'private',
      name: user.displayName || 'private',
      photoUrl: user.photoURL || getDefaultImageUrl(user.uid),
    })
  } else {
    authState.set({
      isLoggedIn: false,
      showLogin: false,
    })

    userProfile.set({
      name: generateRandomName('name'),
      photoUrl: getDefaultImageUrl(),
    })
  }
}

async function setupAnon() {
  const _anonUser = get(anonUser)
  if (!_anonUser.id) {
    console.log('settings anon user id')
    anonUser.set({
      id: `${await generateUniqueId()}`,
      experimentsBalance: 1000,
    })
  }
}

export function initDb() {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = _getAuth(app)
    auth.onAuthStateChanged(onAuthStateChanged)
    setupAnon()
  } catch (e) {
    console.error('Something went wrong while intializing DB')
  }
}
