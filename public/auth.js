import { supabase } from './supabase.js'

let currentUser = null
let accessStatus = {
  signedIn: false,
  paid: false
}

/* =========================
   SIGN IN (Magic Link)
========================= */
export async function signInWithMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin
    }
  })

  if (error) {
    console.error('Magic link error:', error)
    throw error
  }

  return true
}

/* =========================
   AUTH STATE LISTENER
========================= */
supabase.auth.onAuthStateChange(async (_event, session) => {
  if (!session?.user) {
    currentUser = null
    accessStatus = { signedIn: false, paid: false }
    return
  }

  currentUser = session.user
  accessStatus.signedIn = true

  await checkPaidStatus()
})

/* =========================
   CHECK PAID STATUS
========================= */
async function checkPaidStatus() {
  const { data, error } = await supabase
    .from('user_access')
    .select('paid')
    .eq('id', currentUser.id)
    .single()

  if (error) {
    // User exists in auth but not yet in access table
    accessStatus.paid = false
    return
  }

  accessStatus.paid = data.paid === true
}

/* =========================
   HELPERS
========================= */
export function isSignedIn() {
  return accessStatus.signedIn
}

export function canSaveSessions() {
  return accessStatus.signedIn && accessStatus.paid
}

export function getCurrentUser() {
  return currentUser
}

export async function signOut() {
  await supabase.auth.signOut()
}
/* =========================
   INIT AUTH (UI BRIDGE)
========================= */
export function initAuth({
  onUserChange,
  loginOverlayEl,
  confirmationEl,
  authStatusEl
}) {
  // Initial user load
  supabase.auth.getUser().then(({ data }) => {
    onUserChange(data?.user ?? null)
  })

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user ?? null
    onUserChange(user)
  })
}
