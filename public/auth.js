// public/auth.js
// TRUE V3 — Authentication & Persistence Gate
// Identity determines who you are
// Entitlement determines whether memory is allowed

import { supabase } from "./supabase.js";
import { loadUserSessions, clearLocalSessions } from "./sessions.js";

/**
 * Check whether the signed-in user
 * is entitled to session persistence
 */
async function hasSessionAccess(user) {
  if (!user) return false;

  const { data, error } = await supabase
    .from("user_access")
    .select("approved, access_level")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return false;
  return data.approved === true && data.access_level === "session_persistence";
}

/**
 * Initialize auth listener
 */
export function initAuth({
  onUserChange,
  authStatusEl
}) {
  supabase.auth.onAuthStateChange(async (_event, session) => {
    const user = session?.user ?? null;
    onUserChange(user);

    const logoutBtn = document.getElementById("logout-btn");

    // ─────────────────────────────────────────────
    // ANONYMOUS USER
    // ─────────────────────────────────────────────
    if (!user) {
      authStatusEl.textContent = "Sessions not saved";
      if (logoutBtn) logoutBtn.style.display = "none";

      clearLocalSessions();
      return;
    }

    // ─────────────────────────────────────────────
    // AUTHENTICATED (MAGIC LINK)
    // ─────────────────────────────────────────────
    const allowed = await hasSessionAccess(user);

    if (allowed) {
      authStatusEl.textContent = `Sessions saved`;
      loadUserSessions(user.id);
    } else {
      // This should almost never happen in magic-link flow
      authStatusEl.textContent = "Sessions not saved";
      clearLocalSessions();
    }

    if (logoutBtn) logoutBtn.style.display = "inline";
  });
}
