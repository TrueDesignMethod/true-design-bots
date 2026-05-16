// public/auth.js
// TRUE AI — Authentication Layer
// Supabase + Discovery Session Auth

import { supabase } from "/js/supabase.js";


// --------------------------------------------------
// Internal State
// --------------------------------------------------

let currentUser = null;

let authState = {

  signedIn: false,

  initialized: false
};


// --------------------------------------------------
// Send Magic Link
// --------------------------------------------------

export async function signInWithMagicLink(email) {

  const { error } =
    await supabase.auth.signInWithOtp({

      email,

      options: {

        emailRedirectTo:
          window.location.origin
      }
    });

  if (error) {

    console.error(
      "TRUE AI auth error:",
      error
    );

    throw error;
  }

  return true;
}


// --------------------------------------------------
// Sign Out
// --------------------------------------------------

export async function signOut() {

  const { error } =
    await supabase.auth.signOut();

  if (error) {

    console.error(
      "TRUE AI sign out error:",
      error
    );

    throw error;
  }

  currentUser = null;

  authState = {

    signedIn: false,

    initialized: true
  };
}


// --------------------------------------------------
// Current User
// --------------------------------------------------

export function getCurrentUser() {
  return currentUser;
}


// --------------------------------------------------
// Signed In State
// --------------------------------------------------

export function isSignedIn() {
  return authState.signedIn;
}


// --------------------------------------------------
// Auth Ready State
// --------------------------------------------------

export function isAuthInitialized() {
  return authState.initialized;
}


// --------------------------------------------------
// Initialize Auth
// --------------------------------------------------

export async function initAuth({

  onUserChange,

  loginOverlayEl,

  confirmationEl,

  authStatusEl

}) {

  // ----------------------------------------------
  // Initial Session Load
  // ----------------------------------------------
  const {

    data: { session },

    error

  } = await supabase.auth.getSession();

  if (error) {

    console.error(
      "TRUE AI auth session error:",
      error
    );
  }

  currentUser =
    session?.user || null;

  authState.signedIn =
    !!currentUser;

  authState.initialized = true;


  // ----------------------------------------------
  // Update UI
  // ----------------------------------------------
  updateAuthUI({

    authStatusEl,

    confirmationEl,

    loginOverlayEl
  });


  // ----------------------------------------------
  // Notify App
  // ----------------------------------------------
  if (onUserChange) {

    onUserChange(currentUser);
  }


  // ----------------------------------------------
  // Auth Listener
  // ----------------------------------------------
  supabase.auth.onAuthStateChange(

    async (_event, session) => {

      currentUser =
        session?.user || null;

      authState.signedIn =
        !!currentUser;

      authState.initialized = true;


      updateAuthUI({

        authStatusEl,

        confirmationEl,

        loginOverlayEl
      });


      if (onUserChange) {

        onUserChange(currentUser);
      }
    }
  );
}


// --------------------------------------------------
// UI Updater
// --------------------------------------------------

function updateAuthUI({

  authStatusEl,

  confirmationEl,

  loginOverlayEl

}) {

  // ----------------------------------------------
  // Signed In
  // ----------------------------------------------
  if (currentUser) {

    if (authStatusEl) {

      authStatusEl.textContent =
        "Signed in";
    }

    if (confirmationEl) {

      confirmationEl.style.display =
        "block";
    }

    if (loginOverlayEl) {

      loginOverlayEl.classList.remove(
        "active"
      );
    }

    return;
  }


  // ----------------------------------------------
  // Signed Out
  // ----------------------------------------------
  if (authStatusEl) {

    authStatusEl.textContent =
      "Sign in";
  }

  if (confirmationEl) {

    confirmationEl.style.display =
      "none";
  }
}
