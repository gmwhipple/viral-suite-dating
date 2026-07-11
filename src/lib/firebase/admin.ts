import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

type AdminCache = {
  adminApp?: App;
  adminAuth?: Auth;
  adminDb?: Firestore;
  firestoreSettingsApplied?: boolean;
};

const globalCache = globalThis as typeof globalThis & { __firebaseAdmin?: AdminCache };

function cache(): AdminCache {
  if (!globalCache.__firebaseAdmin) {
    globalCache.__firebaseAdmin = {};
  }
  return globalCache.__firebaseAdmin;
}

function getPrivateKey(): string {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) return "";
  return key.replace(/\\n/g, "\n");
}

export function getAdminApp(): App {
  const store = cache();
  if (store.adminApp) return store.adminApp;

  if (getApps().length) {
    store.adminApp = getApps()[0];
    return store.adminApp;
  }

  store.adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: getPrivateKey(),
    }),
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  return store.adminApp;
}

export function getAdminAuth(): Auth {
  const store = cache();
  if (!store.adminAuth) {
    store.adminAuth = getAuth(getAdminApp());
  }
  return store.adminAuth;
}

export function omitUndefined<T extends object>(data: T): Partial<T> {
  const result = {} as Partial<T>;
  for (const key of Object.keys(data) as (keyof T)[]) {
    const value = data[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

export function getAdminDb(): Firestore {
  const store = cache();
  if (store.adminDb) return store.adminDb;

  store.adminDb = getFirestore(getAdminApp());

  if (!store.firestoreSettingsApplied) {
    try {
      store.adminDb.settings({ ignoreUndefinedProperties: true });
    } catch {
      // Next.js dev HMR can re-import this module after Firestore is already in use.
    }
    store.firestoreSettingsApplied = true;
  }

  return store.adminDb;
}

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

export const COLLECTIONS = {
  users: "users",
  photos: "photos",
  generations: "generations",
  edits: "edits",
  activity: "activity_logs",
  abTests: "ab_test_events",
  referenceCatalog: "reference_catalog",
  characters: "characters",
  pendingPurchases: "pending_purchases",
} as const;
