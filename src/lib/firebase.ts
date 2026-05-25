// Firebase has been abandoned in favor of Supabase.
// Exporting dummy objects to prevent build crashes in legacy components that still import them.
export const app = {} as any;
export const auth = {
  onIdTokenChanged: () => () => {},
  onAuthStateChanged: () => () => {},
  currentUser: null,
} as any;
export const db = {} as any;
export const storage = {} as any;
