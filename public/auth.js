// auth.js
import { supabase } from "./supabase.js";
import { loadUserSessions } from "./sessions.js";

export function initAuth({
  onUserChange,
  loginOverlayEl,
  authStatusEl
}) {
  supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user ?? null;

    onUserChange(user);

    const logoutBtn = document.getElementById("logout-btn");

if (!user) {
  authStatusEl.textContent = "Sign in";
  authStatusEl.style.cursor = "pointer";
  if (logoutBtn) logoutBtn.style.display = "none";
  return;
}


if (logoutBtn) logoutBtn.style.display = "inline";


    authStatusEl.textContent = `Saved as ${user.email}`;
    loadUserSessions(user.id);
const btn = document.getElementById("login-btn");
if (btn) {
  btn.disabled = false;
  btn.textContent = "Sign in or create account";
}

    // Close overlay on successful auth
   if (event === "SIGNED_IN") {
  const pw = document.getElementById("login-password");
  if (pw) pw.value = "";
  loginOverlayEl.classList.remove("active");
}
  });
}
