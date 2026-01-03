// auth.js
import { supabase } from "./supabase.js";
import { loadUserSessions } from "./sessions.js";
import { getLatestSession, getMessages } from "./sessions.js";

/**
 * Initializes auth state handling for the app.
 * This should be called ONCE from index.html
 */
export function initAuth({
  onUserChange,
  loginOverlayEl,
  confirmationEl,
  authStatusEl
}) {
  supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user ?? null;

    // Update global user state
    onUserChange(user);

    // Update header UI
    if (!user) {
      authStatusEl.textContent = "Not signed in";
      return;
    }

    authStatusEl.textContent = `Saved as ${user.email}`;

    // Load sessions once authenticated
    loadUserSessions(user.id);

    // Show reassurance only on actual sign-in
    if (event === "SIGNED_IN" && confirmationEl) {
      confirmationEl.style.display = "block";

      setTimeout(() => {
        loginOverlayEl.classList.remove("active");
        confirmationEl.style.display = "none";
      }, 1800);
    }
  });
}
const lastSession = await getLatestSession(user.id);

if (lastSession) {
  currentSession = lastSession;
  currentStage = lastSession.current_stage;

  const messages = await getMessages(lastSession.id);

  // Clear UI
  document.getElementById("landing").style.display = "none";
  document.getElementById("chat").style.display = "flex";
  const messagesEl = document.getElementById("messages");
  messagesEl.innerHTML = "";

  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = `bubble ${msg.role === "user" ? "user" : "bot"}`;
    div.textContent = msg.content;
    messagesEl.appendChild(div);
  });
}

