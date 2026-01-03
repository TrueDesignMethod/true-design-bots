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

    if (!user) {
      authStatusEl.textContent = "Not signed in";
      return;
    }

    authStatusEl.textContent = `Saved as ${user.email}`;
    loadUserSessions(user.id);

    // Close overlay on successful auth
    if (event === "SIGNED_IN") {
  const pw = document.getElementById("login-password");
  if (pw) pw.value = "";

  loginOverlayEl.classList.remove("active");
}


  });
}
