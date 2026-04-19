// src/lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app:  FirebaseApp | null = null
let db:   Firestore   | null = null

export function initFirebase(): { app: FirebaseApp; db: Firestore } | null {
  // Only init if all required env vars are present
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.projectId ||
    firebaseConfig.apiKey === 'demo'
  ) return null

  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  db = getFirestore(app)
  return { app, db }
}

export { db }
export const isFirebaseConfigured = (): boolean =>
  Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'demo'
  )
